from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from pydantic import BaseModel
import cv2
import base64
import numpy as np
import os
import time
import re

app = FastAPI()

# 각 (object_type, camera_id) 조합별 마지막 전송 시간 저장
last_sent_times = {} # {(object_type, camera_id): timestamp}

# origins = [
#     "http://localhost:5173",
#     "http://localhost:8088",
#     "https://supreme-carnival-x7wr65q5gp43vgp9-5173.app.github.dev",
#     "https://supreme-carnival-x7wr65q5gp43vgp9-8088.app.github.dev"
# ]

# # CORS 설정 (React에서 접근 허용)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

model = YOLO("best.pt")  
model.predict(np.zeros((640,640,3), dtype=np.uint8), verbose=False)

class FrameRequest(BaseModel):
    image_base64: str
    cameraId: int


import json
from kafka import KafkaProducer

# Kafka Producer 설정
producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# --- 임시 데이터 (원래는 DB나 외부 API 조회) ---
WORKER_LIMIT = 2  # 작업자 수 한도
def is_working_hour():
    # 지금은 항상 작업 시간이 아니라고 가정
    return False
# -----------------------------------------

def safe_decode_image(image_b64: str) -> np.ndarray:
    if not image_b64 or not isinstance(image_b64, str):
        raise HTTPException(status_code=400, detail="image_base64 is missing")

    # 1) data URL 헤더 제거 (있으면)
    if "," in image_b64 and image_b64.strip().startswith("data:"):
        image_b64 = image_b64.split(",", 1)[1]

    # 2) 공백/개행 제거, URL 인코딩/플러스 손상 방지
    image_b64 = re.sub(r"\s+", "", image_b64).replace(" ", "+")
    # 3) padding 보정
    missing_padding = len(image_b64) % 4
    if missing_padding:
        image_b64 += "=" * (4 - missing_padding)

    try:
        image_bytes = base64.b64decode(image_b64, validate=False)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 encoding")

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Decoded bytes are empty")

    nparr = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if frame is None:
        raise HTTPException(status_code=400, detail="Failed to decode image (cv2.imdecode returned None)")
    return frame

@app.post("/api/objectDetect")
def detect_objects(req: FrameRequest):
    # 0. 요청 로깅(문제 원인 파악에 매우 유용)
    # 길이만 로깅하고 본문은 로그로 남기지 마세요 (보안/성능)
    img_len = len(req.image_base64 or "")
    if img_len < 50:  # 경험상 data URL은 수만~수십만자
        print(f"[WARN] image_base64 suspiciously short: len={img_len}")

    # 1. 안전 디코딩
    frame = safe_decode_image(req.image_base64)

    # 2. YOLO 추론
    results = model.predict(frame, verbose=False)[0]

    detections = []
    label_counts = {}

    for box in results.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
        label_id = int(box.cls[0])
        label_name = model.names.get(label_id, str(label_id))
        score = float(box.conf[0])

        label_counts[label_id] = label_counts.get(label_id, 0) + 1

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, f"{label_name} {score:.2f}", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        detections.append({
            "x": x1,
            "y": y1,
            "width": x2 - x1,
            "height": y2 - y1,
            "label": label_name,
            "score": round(score, 2)
        })

    # 3. 이벤트 발행 (귀하 코드 유지)
    current_time = time.time()
    for label_id, count in label_counts.items():
        label_name = model.names.get(label_id, str(label_id))
        event_key = (label_name, req.cameraId)

        # 규칙 1
        if label_id in [5, 6, 7, 8, 9, 11]:
            if (event_key not in last_sent_times) or (current_time - last_sent_times[event_key] >= 30):
                event = {"eventType":"ForeignObjectDetected","cameraId":req.cameraId,"objectType":label_name,"objectCount":count}
                print(f"KAFKA SEND: {event}")
                producer.send('event-in', event)
                last_sent_times[event_key] = current_time

        # 규칙 2
        elif label_id == 10:
            if count > WORKER_LIMIT and ((event_key not in last_sent_times) or (current_time - last_sent_times[event_key] >= 30)):
                event = {"eventType":"WorkerCountExceeded","cameraId":req.cameraId,"workerCount":count,"limit":WORKER_LIMIT}
                print(f"KAFKA SEND: {event}")
                producer.send('event-in', event)
                last_sent_times[event_key] = current_time

        # 규칙 3
        elif 13 <= label_id <= 22:
            if (not is_working_hour()) and ((event_key not in last_sent_times) or (current_time - last_sent_times[event_key] >= 30)):
                event = {"eventType":"WorkNotInProgress","cameraId":req.cameraId,"objectType":label_name,"objectCount":count}
                print(f"KAFKA SEND: {event}")
                producer.send('event-in', event)
                last_sent_times[event_key] = current_time

    # 4. 결과 이미지 인코딩 (실패 대비)
    ok, buffer = cv2.imencode('.jpg', frame)
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to encode result image")

    image_base64 = "data:image/jpeg;base64," + base64.b64encode(buffer).decode("utf-8")

    return {"boxes": detections, "result_image_base64": image_base64}


@app.get("/get_model_name")
def get_model_name():
    # YOLOv8 모델 객체 내부의 pt 파일 경로를 가져옵니다.
    model_path = getattr(model.model, 'pt_path', 'N/A') 
    return {"model_name": str(model_path)}

@app.get("/get_model_name")
def get_model_name():
    # YOLOv8 모델 객체 내부의 pt 파일 경로를 가져옵니다.
    model_path = getattr(model.model, 'pt_path', 'N/A') 
    return {"model_name": str(model_path)}

# @app.post("/detect")
# def detect_objects(req: FrameRequest):
#     # base64 디코딩
#     image_data = base64.b64decode(req.image_base64.split(",")[-1])
#     nparr = np.frombuffer(image_data, np.uint8)
#     frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#     results = model.predict(frame)[0]
#     # results = model(frame)[0]  # 단일 프레임 예측

#     detections = []
#     for box in results.boxes:
#         x1, y1, x2, y2 = box.xyxy[0].tolist()
#         label = model.names[int(box.cls[0])]
#         score = float(box.conf[0])
#         detections.append({
#             "x": x1,
#             "y": y1,
#             "width": x2 - x1,
#             "height": y2 - y1,
#             "label": label,
#             "score": round(score, 2)
#         })
    

#     return { "boxes": detections }