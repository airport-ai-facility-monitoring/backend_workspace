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
    "https://glowing-space-fiesta-g4w47xwqjgj525qp-5173.app.github.dev",
]

# CORS 설정 (React에서 접근 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("yolov8n.pt")  # YOLOv8n 모델 사용
model.predict(np.zeros((640,640,3), dtype=np.uint8), verbose=False)

class FrameRequest(BaseModel):
    image_base64: str
    cameraId: int

@app.post("/detect")
def detect_objects(req: FrameRequest):
    # 1. base64 디코딩
    image_data = base64.b64decode(req.image_base64.split(",")[-1])
    nparr = np.frombuffer(image_data, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 2. YOLO 추론
    results = model.predict(frame, verbose=False)[0]

    detections = []
    for box in results.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
        label = model.names[int(box.cls[0])]
        score = float(box.conf[0])

        # 바운딩 박스 시각화
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, f"{label} {score:.2f}", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        detections.append({
            "x": x1,
            "y": y1,
            "width": x2 - x1,
            "height": y2 - y1,
            "label": label,
            "score": round(score, 2)
        })

    # 3. 이미지 결과 base64로 변환
    _, buffer = cv2.imencode('.jpg', frame)
    image_base64 = base64.b64encode(buffer).decode("utf-8")
    image_base64 = f"data:image/jpeg;base64,{image_base64}"

    return {
        "boxes": detections,
        "result_image_base64": image_base64
    }

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