from ultralytics import YOLO
import numpy as np
import cv2
import base64
import uuid
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple

from tracker import IoUTracker


class DamageDetector:
    """
    - YOLOv8 세그멘테이션 추론
    - 마스크 → 컨투어 → 길이(px)·면적(px^2)
    - meters_per_pixel(m/px)로 길이/면적 (m, m^2) 변환
    - 박스(xyxy)로 IoU 트래킹 → 동일 객체 track_id 유지
    - 주석(컨투어/회전사각형/라벨) 그린 프레임 제공
    """

    def __init__(self, weight: str = "best.pt", out_dir: str = "runs/annotated"):
        self.model = YOLO(weight)
        self.out_dir = Path(out_dir)
        self.out_dir.mkdir(parents=True, exist_ok=True)

        self.tracker = IoUTracker(iou_thr=0.3, max_lost=30)
        self.frame_idx = 0

    @staticmethod
    def _mask_to_contour(mask: np.ndarray) -> Optional[np.ndarray]:
        # mask: (H, W), 0/1 or 0~255
        if mask.max() <= 1:
            mask = (mask * 255).astype(np.uint8)
        else:
            mask = mask.astype(np.uint8)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return None
        return max(contours, key=cv2.contourArea)

    @staticmethod
    def _compute_area_length(contour: np.ndarray, meters_per_pixel: float) -> Dict[str, float]:
        area_px2 = float(cv2.contourArea(contour))
        rect = cv2.minAreaRect(contour)
        (w, h) = rect[1]  # (width, height) in px
        length_px = float(max(w, h))
        return {
            "area_px2": area_px2,
            "length_px": length_px,
            "area_m2": area_px2 * (meters_per_pixel ** 2),
            "length_m": length_px * meters_per_pixel,
        }

    @staticmethod
    def _b64_from_bgr(img: np.ndarray, q: int = 85) -> str:
        ok, buf = cv2.imencode(".jpg", img, [int(cv2.IMWRITE_JPEG_QUALITY), q])
        return base64.b64encode(buf.tobytes()).decode("utf-8") if ok else ""

    def _draw_annotations(
        self,
        frame_bgr: np.ndarray,
        dets: List[Dict[str, Any]]
    ) -> np.ndarray:
        canvas = frame_bgr.copy()
        for d in dets:
            cnt = d.get("_contour")
            if cnt is not None:
                # 컨투어
                cv2.drawContours(canvas, [cnt], -1, (0, 255, 0), 2)
                # 회전 사각형(길이 시각화)
                rect = cv2.minAreaRect(cnt)
                box = cv2.boxPoints(rect).astype(int)
                cv2.polylines(canvas, [box], True, (255, 0, 0), 2)

            label = f"id:{d['track_id']} L≈{d['length_m']:.2f}m A≈{d['area_m2']:.3f}m^2"
            if cnt is not None:
                x, y, w, h = cv2.boundingRect(cnt)
                y0 = max(0, y - 22)
                cv2.rectangle(canvas, (x, y0), (x + 380, y0 + 22), (0, 0, 0), -1)
                cv2.putText(canvas, label, (x + 5, y0 + 15),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        return canvas

    def run_on_frame_min(self, frame_bgr: np.ndarray, meters_per_pixel: float) -> Dict[str, Any]:
        """
        - 입력 프레임에서 탐지/세그멘테이션
        - 길이/면적(m, m^2), track_id 부여
        - 주석 프레임(base64)과 최소 디텍션 결과 반환
        """
        results = self.model.predict(
            source=frame_bgr,
            conf=0.15,      # ↓ 신뢰도 낮춰서 놓치는 것 줄이기 (기본 0.25 → 0.15)
            iou=0.55,       # ↑ NMS IoU 올려서 마스크/박스 합치기
            imgsz=1280,     # ↑ 해상도 키워서 세그먼트 디테일 개선
            verbose=False
        )
        r = results[0]

        dets: List[Dict[str, Any]] = []
        boxes_xyxy: List[Tuple[float, float, float, float]] = []
        contours: List[Optional[np.ndarray]] = []

        if r.masks is not None and len(r.masks) > 0:
            masks = r.masks.data.cpu().numpy()                 # (N, H, W)
            boxes = r.boxes.xyxy.cpu().numpy()                 # (N, 4)
            for i, mask in enumerate(masks):
                cnt = self._mask_to_contour(mask)
                contours.append(cnt)
                boxes_xyxy.append(tuple(map(float, boxes[i])))

            # 트래킹 먼저 수행 (박스 기반)
            track_ids = self.tracker.update(self.frame_idx, boxes_xyxy)

            # 길이/면적 측정 및 결과 조립
            # boxes_xyxy: (N,4) 배열
            boxes_xyxy = r.boxes.xyxy.cpu().numpy()  # [[x1,y1,x2,y2], ...]
            masks = r.masks.data.cpu().numpy()       # (N,H,W)

            # ... (위에서 self.tracker.update(self.frame_idx, [tuple(b) for b in boxes_xyxy]) 수행했다고 가정)
            # track_ids = self.tracker.update(self.frame_idx, [tuple(b) for b in boxes_xyxy])

            dets = []
            for i, cnt in enumerate(contours):
                if cnt is None:
                    continue
                met = self._compute_area_length(cnt, meters_per_pixel)
                x1, y1, x2, y2 = boxes_xyxy[i].tolist()  # ← 박스 좌표 추출

                dets.append({
                    "track_id": int(track_ids[i]),
                    "length_m": float(met["length_m"]),
                    "area_m2": float(met["area_m2"]),
                    "box": [float(x1), float(y1), float(x2), float(y2)],  # ← 쉼표 꼭!
                    "_contour": cnt,  # 내부 주석용
                })

        self.frame_idx += 1

        # 주석 프레임
        annotated = self._draw_annotations(frame_bgr, dets)
        b64 = self._b64_from_bgr(annotated, q=85)

        # 응답용: contour 제거
        public_dets = [
            {k: v for k, v in d.items() if k != "_contour"}
            for d in dets
        ]
        return {
            "image_base64": b64,             # 탐지된(주석된) 이미지
            "detections": public_dets        # [{track_id, length_m, area_m2}, ...]
        }

    def run(self, image_path: str, meters_per_pixel: float):
        # 기존 YOLO 추론 로직...
        results = self.model(image_path)
        annotated_image = results[0].plot()

        # 주석 이미지 저장
        annotated_path = RESULT_DIR / f"{uuid.uuid4().hex}.jpg"
        cv2.imwrite(str(annotated_path), annotated_image)

        detections = []
        for i, box in enumerate(results[0].boxes):
            length_px = ... # 길이 계산 로직
            area_px2 = ...  # 면적 계산 로직
            length_m = length_px * meters_per_pixel
            area_m2 = area_px2 * (meters_per_pixel ** 2)
            detections.append({
                "id": i,
                "length_m": length_m,
                "area_m2": area_m2
            })

        return {
            "annotated_image_path": str(annotated_path),
            "detections": detections
        }