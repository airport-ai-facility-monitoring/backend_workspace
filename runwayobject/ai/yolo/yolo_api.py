from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from pydantic import BaseModel
import cv2
import base64
import numpy as np
import os

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:8088",
    "https://glowing-space-fiesta-g4w47xwqjgj525qp-5173.app.github.dev",
    "https://glowing-space-fiesta-g4w47xwqjgj525qp-8088.app.github.dev"
]

# CORS 설정 (React에서 접근 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/detect")
def detect_objects(req: FrameRequest):
    # 1. base64 디코딩
    image_data = base64.b64decode(req.image_base64.split(",")[-1])
    nparr = np.frombuffer(image_data, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 2. YOLO 추론
    results = model.predict(frame, verbose=False)[0]

    detections = []
    
    # 라벨별 객체 수 카운트
    label_counts = {}

    for box in results.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
        label_id = int(box.cls[0])
        label_name = model.names[label_id]
        score = float(box.conf[0])

        # 라벨 카운트
        label_counts[label_id] = label_counts.get(label_id, 0) + 1

        # 바운딩 박스 시각화
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

    # 3. 알림 규칙 확인 및 Kafka 이벤트 발행
    for label_id, count in label_counts.items():
        label_name = model.names[label_id]
        event = None

        # 규칙 1: 이상 물체 (라벨 5,6,7,8,9,11)
        if label_id in [5, 6, 7, 8, 9, 11]:
            event = {
                "eventType": "ForeignObjectDetected",
                "cameraId": req.cameraId,
                "objectType": label_name,
                "objectCount": count
            }
            print(f"KAFKA SEND: {event}")
            producer.send('airport', event)

        # 규칙 2: 작업자 수 초과 (라벨 10)
        elif label_id == 10:
            if count > WORKER_LIMIT:
                event = {
                    "eventType": "WorkerCountExceeded",
                    "cameraId": req.cameraId,
                    "workerCount": count,
                    "limit": WORKER_LIMIT
                }
                print(f"KAFKA SEND: {event}")
                producer.send('airport', event)

        # 규칙 3: 허용되지 않은 작업 시간 (라벨 13-22)
        elif 13 <= label_id <= 22:
            if not is_working_hour():
                event = {
                    "eventType": "WorkNotInProgress",
                    "cameraId": req.cameraId,
                    "objectType": label_name,
                    "objectCount": count
                }
                print(f"KAFKA SEND: {event}")
                producer.send('airport', event)

    # 4. 이미지 결과 base64로 변환
    _, buffer = cv2.imencode('.jpg', frame)
    image_base64 = base64.b64encode(buffer).decode("utf-8")
    image_base64 = f"data:image/jpeg;base64,{image_base64}"

    return {
        "boxes": detections,
        "result_image_base64": image_base64
    }


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