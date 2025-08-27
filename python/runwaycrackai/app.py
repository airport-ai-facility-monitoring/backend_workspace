# app.py
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
import base64, time, math, os, logging
import numpy as np
import cv2

# Azure Blob
from azure.storage.blob import ContainerClient, ContentSettings

# YOLO 추론기 (네 파일명에 맞춰 import)
from detect_damage import DamageDetector
# from damage_detector import DamageDetector  # 사용 파일명에 맞게 선택

# -------------------------------
# 설정 & 초기화
# -------------------------------
app = FastAPI()

# 로깅
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("runway-detect")

# Azure Blob Storage
STORAGE_ACCOUNT_NAME = "airportcopy27"
CONTAINER_NAME = "videos"
STORAGE_URL = f"https://{STORAGE_ACCOUNT_NAME}.blob.core.windows.net/{CONTAINER_NAME}"
SAS_TOKEN = os.getenv("SAS_TOKEN", "")  # "sv=..." 형태 권장(물음표 없이)

def get_container_client() -> ContainerClient:
    token = SAS_TOKEN or ""
    token = token if (token == "" or token.startswith("?")) else ("?" + token)
    container_url = f"{STORAGE_URL}{token}"
    return ContainerClient.from_container_url(container_url)

container_client = get_container_client()

def upload_image_to_azure(image_bytes: bytes, filename: str) -> str:
    blob = container_client.get_blob_client(filename)
    blob.upload_blob(
        image_bytes,
        overwrite=True,
        content_settings=ContentSettings(
            content_type="image/jpeg",
            cache_control="public, max-age=31536000",
        ),
    )
    return f"{STORAGE_URL}/{filename}"

# YOLO 추론기
detector = DamageDetector(weight="best.pt")

# -------------------------------
# 프레임 내 병합 파라미터
# -------------------------------
MERGE_IOU_THR = 0.20          # 0.10 → 0.20 권장(과병합 방지)
MERGE_CENTER_RATIO = 0.25     # 0.30 → 0.25 권장

# -------------------------------
# 트랙 기반 저장 파라미터
# -------------------------------
GROWTH_RATIO_THR  = 0.20      # 이전 최대 면적 대비 20%↑일 때 저장
MIN_SAVE_INTERVAL = 10.0      # 동일 트랙 재저장 최소 간격(초)
TRACK_TTL_SECONDS = 60.0      # 마지막 관측 뒤 TTL(초)

@dataclass
class TrackState:
    max_area: float
    last_seen: float
    last_saved: float

# cameraId -> { track_id -> TrackState }
track_state_by_cam: Dict[int, Dict[int, TrackState]] = {}

# -------------------------------
# 유틸: 박스 병합
# -------------------------------
def iou_xyxy(a, b):
    x1 = max(a[0], b[0]); y1 = max(a[1], b[1])
    x2 = min(a[2], b[2]); y2 = min(a[3], b[3])
    inter = max(0, x2 - x1) * max(0, y2 - y1)
    area_a = max(0, a[2] - a[0]) * max(0, a[3] - a[1])
    area_b = max(0, b[2] - b[0]) * max(0, b[3] - b[1])
    union = area_a + area_b - inter
    return inter / union if union > 0 else 0.0

def center_distance_norm(a, b):
    ax = (a[0] + a[2]) / 2; ay = (a[1] + a[3]) / 2
    bx = (b[0] + b[2]) / 2; by = (b[1] + b[3]) / 2
    dist = math.hypot(ax - bx, ay - by)
    scale = max(1.0, max(a[2]-a[0], a[3]-a[1], b[2]-b[0], b[3]-b[1]))
    return dist / scale

def bbox_union(a, b):
    return [min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3])]

def group_detections(dets: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    같은 프레임 내에서 겹치거나 가까운 박스는 하나의 그룹으로 통합.
    - 면적: 합산
    - 길이: 최대값
    - track_ids: 병합
    """
    groups: List[Dict[str, Any]] = []
    for d in dets:
        placed = False
        for g in groups:
            if (iou_xyxy(d["box"], g["box"]) >= MERGE_IOU_THR) or \
               (center_distance_norm(d["box"], g["box"]) <= MERGE_CENTER_RATIO):
                g["box"] = bbox_union(g["box"], d["box"])
                g["area_m2"] += d["area_m2"]
                g["length_m"] = max(g["length_m"], d["length_m"])
                g["track_ids"].append(d["track_id"])
                placed = True
                break
        if not placed:
            groups.append({
                "box": d["box"][:],
                "length_m": d["length_m"],
                "area_m2": d["area_m2"],
                "track_ids": [d["track_id"]],
            })
    return groups

# -------------------------------
# 요청 모델
# -------------------------------
class FrameRequest(BaseModel):
    image_base64: str
    meters_per_pixel: float = 0.01
    cameraId: int

# -------------------------------
# 엔드포인트
# -------------------------------
@app.post("/api/runwaycracksDetect")
def detect_image(req: FrameRequest):
    try:
        # 1) 이미지 디코드
        b64 = req.image_base64.split(",")[-1]  # dataURL 헤더 제거(있으면)
        frame_bytes = base64.b64decode(b64)
        nparr = np.frombuffer(frame_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # 2) YOLO 추론(카메라별 트래커 사용) → 박스/길이/면적 + 주석 이미지
        out = detector.run_on_frame_min(
            frame_bgr=frame,
            meters_per_pixel=req.meters_per_pixel,
            camera_id=req.cameraId,
        )
        ts = time.strftime("%Y%m%d-%H%M%S")

        # 3) 프레임 내 병합(한 객체 다중탐지 방지 & 길이/면적 크게)
        raw_dets: List[Dict[str, Any]] = []
        for d in out.get("detections", []):
            if "box" not in d:
                continue
            raw_dets.append({
                "track_id": int(d["track_id"]),
                "length_m": float(d["length_m"]),
                "area_m2": float(d["area_m2"]),
                "box": [float(v) for v in d["box"]],
            })
        groups = group_detections(raw_dets)

        # 4) 프리뷰(항상 표시) 박스
        preview_boxes = [g["box"] for g in groups]

        # 5) 트랙 기반 저장 판단(최초 1회 + 성장 시)
        now_ts = time.time()
        cam_states = track_state_by_cam.setdefault(req.cameraId, {})

        # TTL 정리
        for tid, st in list(cam_states.items()):
            if now_ts - st.last_seen > TRACK_TTL_SECONDS:
                cam_states.pop(tid, None)

        to_save: List[Dict[str, Any]] = []
        for g in groups:
            rep_tid: Optional[int] = min(g["track_ids"]) if g["track_ids"] else None
            if rep_tid is None:
                continue

            st = cam_states.get(rep_tid)
            if st is None:
                cam_states[rep_tid] = TrackState(
                    max_area=g["area_m2"], last_seen=now_ts, last_saved=0.0
                )
                to_save.append(g)  # 최초 저장
            else:
                st.last_seen = now_ts
                grown  = g["area_m2"] > st.max_area * (1.0 + GROWTH_RATIO_THR)
                cooled = (now_ts - st.last_saved) >= MIN_SAVE_INTERVAL
                if grown and cooled:
                    st.max_area  = g["area_m2"]
                    st.last_saved = now_ts
                    to_save.append(g)

        # 6) 저장 발생 시 주석 이미지를 업로드
        image_url = None
        if to_save and out.get("image_base64"):
            img_b64 = out["image_base64"]
            img_b64 = img_b64.split(",")[-1]  # 혹시 dataURL 헤더가 붙어왔다면 제거
            img_bytes = base64.b64decode(img_b64)
            filename = f"camera_{req.cameraId}_{ts}.jpg"
            image_url = upload_image_to_azure(img_bytes, filename)

        # 7) 응답: preview + saved
        saved_item = None
        if to_save:
            saved_item = {
                "timestamp": ts,
                "track_ids": sorted({tid for g in to_save for tid in g["track_ids"]}),
                "length_m": sum(g["length_m"] for g in to_save),
                "area_m2": sum(g["area_m2"] for g in to_save),
                "image_path": image_url,
                "boxes": [g["box"] for g in to_save],
            }

            logger.info(
                f"[SAVE] cam={req.cameraId} tracks={saved_item['track_ids']} "
                f"length={saved_item['length_m']:.2f}m area={saved_item['area_m2']:.3f}m^2 url={image_url}"
            )

        return JSONResponse({
            "preview": {"boxes": preview_boxes},      # 프론트 오버레이는 항상 이걸로
            "saved": ([saved_item] if saved_item else [])
        })

    except Exception as e:
        logger.exception("Detect error")
        return JSONResponse(status_code=500, content={"error": f"처리 중 오류 발생: {str(e)}"})