from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import base64
import cv2
import numpy as np
import time
import math
import logging
from azure.storage.blob import ContainerClient
from detect_damage import DamageDetector
from azure.storage.blob import ContentSettings
import os


# --- Azure Blob Storage Front Door 설정 ---
# --- Azure Blob Storage 설정 ---
STORAGE_ACCOUNT_NAME = "airportfrontendstorage"
CONTAINER_NAME = "videos"
STORAGE_URL = f"https://{STORAGE_ACCOUNT_NAME}.blob.core.windows.net/{CONTAINER_NAME}"
SAS_TOKEN = os.getenv("SAS_TOKEN")

# 컨테이너 클라이언트 생성
def get_container_client():
    container_url = f"{STORAGE_URL}?{SAS_TOKEN}"
    return ContainerClient.from_container_url(container_url)

container_client = get_container_client()

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 업로드 함수
def upload_image_to_azure(image_bytes: bytes, filename: str) -> str:
    if not filename:
        raise ValueError("filename이 비어있습니다.")
    
    blob_client = container_client.get_blob_client(filename)
    
    # 파일 확장자 기반 Content-Type
    ext = filename.lower().split('.')[-1]
    content_type_map = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp'
    }
    content_type = content_type_map.get(ext, 'application/octet-stream')
    
    blob_client.upload_blob(
        image_bytes,
        overwrite=True,
        content_settings=ContentSettings(
            content_type=content_type,
            cache_control='public, max-age=31536000'
        )
    )
    
    # 업로드 후 Storage URL 반환
    return f"{STORAGE_URL}/{filename}"

# --- 모델 로드 ---
app = FastAPI()
detector = DamageDetector(weight="best.pt")

# --- 그룹 병합 기준 ---
MERGE_IOU_THR = 0.10
MERGE_CENTER_RATIO = 0.30

# 카메라별 중복 그룹 관리
seen_groups_by_camera = {}
saved_image_for_camera = set()

# 헬퍼 함수
def iou_xyxy(a, b):
    x1 = max(a[0], b[0]); y1 = max(a[1], b[1])
    x2 = min(a[2], b[2]); y2 = min(a[3], b[3])
    inter = max(0, x2-x1) * max(0, y2-y1)
    area_a = max(0, a[2]-a[0]) * max(0, a[3]-a[1])
    area_b = max(0, b[2]-b[0]) * max(0, b[3]-b[1])
    union = area_a + area_b - inter
    return inter/union if union > 0 else 0.0

def center_distance_norm(a, b):
    ax = (a[0]+a[2])/2; ay = (a[1]+a[3])/2
    bx = (b[0]+b[2])/2; by = (b[1]+b[3])/2
    dist = math.hypot(ax-bx, ay-by)
    scale = max(1.0, max(a[2]-a[0], a[3]-a[1], b[2]-b[0], b[3]-b[1]))
    return dist/scale

def bbox_union(a, b):
    return [min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3])]

def group_detections(dets):
    groups = []
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

def group_key_from_box(box, precision=16):
    x1,y1,x2,y2 = box
    k = (round(x1/precision), round(y1/precision), round(x2/precision), round(y2/precision))
    return str(k)

# 요청 모델
class FrameRequest(BaseModel):
    image_base64: str
    meters_per_pixel: float = 0.01
    cameraId: int = 0

# 카메라별 최대 면적 관리
max_area_by_camera = {}  # cameraId -> float
# POST API
@app.post("/api/runwaycracksDetect")
def detect_image(req: FrameRequest):
    try:
        image_data = base64.b64decode(req.image_base64.split(",")[-1])
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        out = detector.run_on_frame_min(frame, meters_per_pixel=req.meters_per_pixel)
        ts = time.strftime("%Y%m%d-%H%M%S")

        raw_dets = []
        for d in out.get("detections", []):
            if "box" not in d: continue
            raw_dets.append({
                "track_id": int(d["track_id"]),
                "length_m": float(d["length_m"]),
                "area_m2": float(d["area_m2"]),
                "box": [float(v) for v in d["box"]],
            })

        groups = group_detections(raw_dets)

        # 중복 제거
        seen_groups = seen_groups_by_camera.setdefault(req.cameraId, set())
        new_groups = []
        for g in groups:
            key = group_key_from_box(g["box"])
            if key not in seen_groups:
                seen_groups.add(key)
                new_groups.append(g)
        groups = new_groups

        # 총 면적 계산
        total_area = sum(g["area_m2"] for g in groups)
        total_length = sum(g["length_m"] for g in groups)
        all_ids = sorted({tid for g in groups for tid in g["track_ids"]})
        boxes = [g["box"] for g in groups]

        # 이전 최대 면적 확인
        prev_max_area = max_area_by_camera.get(req.cameraId, 0.0)

        image_url = None
        if total_area > prev_max_area and groups:
            # 이미지 업로드
            if out.get("image_base64"):
                base64_str = out["image_base64"]
                if ',' in base64_str:
                    base64_str = base64_str.split(',')[1]
                img_bytes = base64.b64decode(base64_str)
                filename = f"camera_{req.cameraId}_{ts}.jpg"
                image_url = upload_image_to_azure(img_bytes, filename)

            # 최대 면적 업데이트
            max_area_by_camera[req.cameraId] = total_area

        combined_item = {
            "timestamp": ts,
            "track_ids": all_ids,
            "length_m": total_length,
            "area_m2": total_area,
            "image_path": image_url,
            "boxes": boxes
        }

        return JSONResponse({"saved": [combined_item]})

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"처리 중 오류 발생: {str(e)}"}
        )
# # 비디오 세션
# class VideoSession:
#     def __init__(self, video_path: str):
#         self.video_path = video_path
#         self.cap = cv2.VideoCapture(video_path)
#         self.seen_groups = set()
#         self.notified_groups = set()
# 
#     def read_frame(self):
#         ok, frame = self.cap.read()
#         if not ok:
#             self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
#             ok, frame = self.cap.read()
#         return ok, frame
# 
#     def release(self):
#         try: self.cap.release()
#         except: pass
# 
# _sessions = {}  # video_path -> VideoSession
# 
# def get_session(video_path: str) -> VideoSession:
#     vs = _sessions.get(video_path)
#     if vs is None:
#         vs = VideoSession(video_path)
#         _sessions[video_path] = vs
#     if not vs.cap.isOpened():
#         raise RuntimeError(f"Cannot open video: {video_path}")
#     return vs
# 
# # 컨테이너 URL 관련
# BASE_URL = "https://airportfrontendstorage.blob.core.windows.net/videos"
# SAS_TOKEN = "?"
# VIDEO_FILE = "4.mp4"
# VIDEO_URL = "https://airportfrontendstorage.blob.core.windows.net/videos/4.mp4"

#     # 영상 URL 조합
# def get_video_url():
#     # 파일 경로와 SAS 토큰을 결합합니다.
#     return f"{BASE_URL}/{VIDEO_FILE}{SAS_TOKEN}"

# def get_local_video(video_url: str) -> str:
#     # 임시 파일 생성
#     tmp = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
#     resp = requests.get(video_url, stream=True)
#     print(tmp)
#     if resp.status_code != 200:
#         raise RuntimeError(f"Failed to download video: {video_url}")
#     for chunk in resp.iter_content(chunk_size=8192):
#         tmp.write(chunk)
#     tmp.close()
#     return tmp.name

# @app.get("/api/runwaycracksDetect")
# def video_tick(
#     video: str = Query(None), # 로컬 비디오 파일 경로를 선택적으로 받습니다.
#     mpp: float = Query(0.01),
#     stride: int = Query(2)
# ):
#     # video 쿼리 파라미터가 없으면 Azure URL을 사용

#     if video:
#         local_video = video
#     else:
#         # video_url = get_video_url()
#         # local_video = get_local_video(video_url)
#         local_video = get_local_video(VIDEO_URL)


#     """
#     - 프레임 탐지 → 같은 균열(겹치거나 가까운 박스)은 병합 → '그룹' 단위로 1회만 저장
#     - 저장 항목: 이미지(JPG), length_m(최대), area_m2(합)
#     """
#     try:
#         vs = get_session(local_video)
#     except RuntimeError as e:
#         return JSONResponse({"error": str(e)}, status_code=400)

#     for _ in range(max(1, stride)):
#         ok, frame = vs.read_frame()
#         if not ok:
#             return JSONResponse({"error": "Failed to read frame"}, status_code=500)

#     # 추론 (run_on_frame_min은 image_base64와 detections를 반환)
#     out = detector.run_on_frame_min(frame, meters_per_pixel=mpp)
#     ts = time.strftime("%Y%m%d-%H%M%S")

#     # 프론트 미리보기용 이미지 저장 (선택)
#     img_path = None
#     if out.get("image_base64"):
#         img_bytes = base64.b64decode(out["image_base64"].encode("utf-8"))
#         img_path = SAVED_DIR / f"{ts}.jpg"
#         with img_path.open("wb") as f:
#             f.write(img_bytes)
#         #추가
#         image_url = f"{STATIC_URL}/{ts}.jpg"

#     # dets 확장: track_id, length_m, area_m2, box 필요
#     raw_dets = []
#     for d in out.get("detections", []):
#         # detect_damage.run_on_frame_min 안에서 box(xyxy)가 함께 내려오도록 해두세요.
#         # 없다면 detect_damage에서 boxes.xyxy를 같이 실어보내면 됩니다.
#         if "box" not in d:
#             # 박스 정보가 없으면 병합 못 하므로 스킵하거나 기본값 처리
#             continue
#         raw_dets.append({
#             "track_id": int(d["track_id"]),
#             "length_m": float(d["length_m"]),
#             "area_m2": float(d["area_m2"]),
#             "box": [float(v) for v in d["box"]],
#         })

#     # 1) 같은 균열 병합 (그대로 유지)
#     groups = group_detections(raw_dets)

#     # 병합 후, 이미 알림을 보낸 균열 제거
#     new_groups = []
#     for g in groups:
#         key = group_key_from_box(g["box"])
#         if key not in vs.seen_groups:
#             vs.seen_groups.add(key)
#             new_groups.append(g)

#     groups = new_groups

#     # 2) 프레임 단위로 하나만 저장: 길이/면적 합산 + track_ids 합치기
#     total_area = sum(g["area_m2"] for g in groups)
#     total_length = sum(g["length_m"] for g in groups)
#     all_ids = sorted({tid for g in groups for tid in g["track_ids"]})

#     # 각 그룹의 박스 좌표만 뽑아서 리스트화
#     boxes = [g["box"] for g in groups]
#     # 같은 프레임(같은 이미지)면 1건만 저장
#     combined_item = {
#         "timestamp": ts,
#         "track_ids": all_ids,# 이 프레임에 잡힌 모든 트랙 id
#         "length_m": total_length,# 길이 합산
#         "area_m2": total_area,# 면적 합산
#         "image_path": image_url # str(img_path) if img_path else None
#         "boxes": boxes                 # 각 그룹의 박스 좌표
#     }

#     # 파일명은 프레임 기준으로 하나만
#     json_path = SAVED_DIR / f"frame_{ts}.json"
#     with json_path.open("w", encoding="utf-8") as f:
#         json.dump(combined_item, f, ensure_ascii=False, indent=2)

#     # 응답은 참고용으로 1건만 돌려줌
#     return JSONResponse({
#         # "image_base64": out.get("image_base64"),
#         "saved": [combined_item]
#     })
