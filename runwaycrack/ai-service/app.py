from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from pathlib import Path
import cv2
import json
import time
import base64
import math
import tempfile
import requests

#추가
from fastapi.staticfiles import StaticFiles

from detect_damage import DamageDetector

app = FastAPI()


detector = DamageDetector(weight="best.pt")

#SAVED_DIR = Path("runs/saved"); 
SAVED_DIR = Path("static/images")
STATIC_URL = "http://localhost:8001/static/images"
SAVED_DIR.mkdir(parents=True, exist_ok=True)
VIDEOS_DIR = Path("videos"); VIDEOS_DIR.mkdir(parents=True, exist_ok=True)

#추가
app.mount(
    "/static/images",  # URL에서 접근할 경로
    StaticFiles(directory="static/images"),  # 실제 저장 폴더 경로
    name="images"
)
# 병합 기준(필요시 조정)
MERGE_IOU_THR = 0.10           # 박스 IoU가 이 이상이면 같은 균열로 본다
MERGE_CENTER_RATIO = 0.30      # 중심거리 / max(box_w, box_h) ≤ 이 값이면 같은 균열

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
    """
    dets: [{track_id, length_m, area_m2, box:[x1,y1,x2,y2]}]
    return: list of groups; each = {"box":[...], "length_m":max, "area_m2":sum, "track_ids":[...]}
    """
    groups = []
    for d in dets:
        placed = False
        for g in groups:
            if (iou_xyxy(d["box"], g["box"]) >= MERGE_IOU_THR) or \
               (center_distance_norm(d["box"], g["box"]) <= MERGE_CENTER_RATIO):
                # 병합
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

# 비디오 세션
class VideoSession:
    def __init__(self, video_path: str):
        self.video_path = video_path
        self.cap = cv2.VideoCapture(video_path)
        # 이미 저장한 '그룹'을 바운딩박스 키로 기록 (프레임 간 중복 방지)
        self.seen_groups = set()
        self.notified_groups = set()

    def read_frame(self):
        ok, frame = self.cap.read()
        if not ok:
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ok, frame = self.cap.read()
        return ok, frame

    def release(self):
        try: self.cap.release()
        except: pass

_sessions = {}  # video_path -> VideoSession

def get_session(video_path: str) -> VideoSession:
    vs = _sessions.get(video_path)
    if vs is None:
        vs = VideoSession(video_path)
        _sessions[video_path] = vs
    if not vs.cap.isOpened():
        raise RuntimeError(f"Cannot open video: {video_path}")
    return vs

def group_key_from_box(box, precision=16):
    # 박스 좌표를 라운드해서 문자열 키 생성 (프레임 간 약간의 흔들림 허용)
    x1,y1,x2,y2 = box
    k = (round(x1/precision), round(y1/precision), round(x2/precision), round(y2/precision))
    return str(k)

# 컨테이너 URL
BASE_URL = "https://airportfrontendstorage.blob.core.windows.net/videos"
SAS_TOKEN = "?sp=rl&st=2025-08-14T05:57:58Z&se=2025-08-15T14:12:58Z&sip=0.0.0.0-255.255.255.255&sv=2024-11-04&sr=c&sig=2DBdl97%2BkRiEe9Tit3lCJVWKoyZTQ6tIVlgdr5zI%2Bh4%3D"
VIDEO_FILE = "4.mp4"
VIDEO_URL = "https://airportfrontendstorage.blob.core.windows.net/videos/4.mp4"

# 영상 URL 조합
def get_video_url():
    # 파일 경로와 SAS 토큰을 결합합니다.
    return f"{BASE_URL}/{VIDEO_FILE}{SAS_TOKEN}"

def get_local_video(video_url: str) -> str:
    # 임시 파일 생성
    tmp = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
    resp = requests.get(video_url, stream=True)
    print(tmp)
    if resp.status_code != 200:
        raise RuntimeError(f"Failed to download video: {video_url}")
    for chunk in resp.iter_content(chunk_size=8192):
        tmp.write(chunk)
    tmp.close()
    return tmp.name

@app.get("/api/runwaycracksDetect")
def video_tick(
    video: str = Query(None), # 로컬 비디오 파일 경로를 선택적으로 받습니다.
    mpp: float = Query(0.01),
    stride: int = Query(2)
):
    # video 쿼리 파라미터가 없으면 Azure URL을 사용

    if video:
        local_video = video
    else:
        # video_url = get_video_url()
        # local_video = get_local_video(video_url)
        local_video = get_local_video(VIDEO_URL)


    """
    - 프레임 탐지 → 같은 균열(겹치거나 가까운 박스)은 병합 → '그룹' 단위로 1회만 저장
    - 저장 항목: 이미지(JPG), length_m(최대), area_m2(합)
    """
    try:
        vs = get_session(local_video)
    except RuntimeError as e:
        return JSONResponse({"error": str(e)}, status_code=400)

    for _ in range(max(1, stride)):
        ok, frame = vs.read_frame()
        if not ok:
            return JSONResponse({"error": "Failed to read frame"}, status_code=500)

    # 추론 (run_on_frame_min은 image_base64와 detections를 반환)
    out = detector.run_on_frame_min(frame, meters_per_pixel=mpp)
    ts = time.strftime("%Y%m%d-%H%M%S")

    # 프론트 미리보기용 이미지 저장 (선택)
    img_path = None
    if out.get("image_base64"):
        img_bytes = base64.b64decode(out["image_base64"].encode("utf-8"))
        img_path = SAVED_DIR / f"{ts}.jpg"
        with img_path.open("wb") as f:
            f.write(img_bytes)
        #추가
        image_url = f"{STATIC_URL}/{ts}.jpg"

    # dets 확장: track_id, length_m, area_m2, box 필요
    raw_dets = []
    for d in out.get("detections", []):
        # detect_damage.run_on_frame_min 안에서 box(xyxy)가 함께 내려오도록 해두세요.
        # 없다면 detect_damage에서 boxes.xyxy를 같이 실어보내면 됩니다.
        if "box" not in d:
            # 박스 정보가 없으면 병합 못 하므로 스킵하거나 기본값 처리
            continue
        raw_dets.append({
            "track_id": int(d["track_id"]),
            "length_m": float(d["length_m"]),
            "area_m2": float(d["area_m2"]),
            "box": [float(v) for v in d["box"]],
        })

    # 1) 같은 균열 병합 (그대로 유지)
    groups = group_detections(raw_dets)

    # 병합 후, 이미 알림을 보낸 균열 제거
    new_groups = []
    for g in groups:
        key = group_key_from_box(g["box"])
        if key not in vs.seen_groups:
            vs.seen_groups.add(key)
            new_groups.append(g)

    groups = new_groups

    # 2) 프레임 단위로 하나만 저장: 길이/면적 합산 + track_ids 합치기
    total_area = sum(g["area_m2"] for g in groups)
    total_length = sum(g["length_m"] for g in groups)
    all_ids = sorted({tid for g in groups for tid in g["track_ids"]})

    # 같은 프레임(같은 이미지)면 1건만 저장
    combined_item = {
        "timestamp": ts,
        "track_ids": all_ids,# 이 프레임에 잡힌 모든 트랙 id
        "length_m": total_length,# 길이 합산
        "area_m2": total_area,# 면적 합산
        "image_path": image_url # str(img_path) if img_path else None
    }

    # 파일명은 프레임 기준으로 하나만
    json_path = SAVED_DIR / f"frame_{ts}.json"
    with json_path.open("w", encoding="utf-8") as f:
        json.dump(combined_item, f, ensure_ascii=False, indent=2)

    # 응답은 참고용으로 1건만 돌려줌
    return JSONResponse({
        # "image_base64": out.get("image_base64"),
        "saved": [combined_item]
    })
