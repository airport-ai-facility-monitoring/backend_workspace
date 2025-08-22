from ultralytics import YOLO
import numpy as np
import cv2
import base64
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from tracker import IoUTracker


class DamageDetector:
    """
    - YOLOv8 세그멘테이션 추론
    - 마스크 → 컨투어 → 길이(px)·면적(px^2)
    - meters_per_pixel(m/px)로 길이/면적 (m, m^2) 변환
    - (개선) 카메라별 IoU 트래킹(박스 기반) → 동일 객체 track_id 유지
    - 주석(컨투어/회전사각형/라벨) 그린 프레임 제공
    """

    def __init__(self, weight: str = "best.pt", out_dir: str = "runs/annotated"):
        self.model = YOLO(weight)
        self.out_dir = Path(out_dir)
        self.out_dir.mkdir(parents=True, exist_ok=True)

        # 기존: 단일 트래커 → (개선) 카메라별 트래커/프레임 인덱스
        self.trackers: dict[int, IoUTracker] = {}
        self.frame_idx_by_cam: dict[int, int] = {}

    def _get_tracker(self, camera_id: int) -> IoUTracker:
        if camera_id not in self.trackers:
            self.trackers[camera_id] = IoUTracker(iou_thr=0.3, max_lost=30)
            self.frame_idx_by_cam[camera_id] = 0
        return self.trackers[camera_id]

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
        """
        원래 방식 그대로: 컨투어가 있을 때 컨투어/회전사각형/라벨을 그림.
        (컨투어가 없으면 아무 것도 안 그림 = 기존 동작 유지)
        """
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

                # 라벨
                label = f"id:{d['track_id']} L≈{d['length_m']:.2f}m A≈{d['area_m2']:.3f}m^2"
                x, y, w, h = cv2.boundingRect(cnt)
                y0 = max(0, y - 22)
                cv2.rectangle(canvas, (x, y0), (x + 380, y0 + 22), (0, 0, 0), -1)
                cv2.putText(canvas, label, (x + 5, y0 + 15),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        return canvas

    def run_on_frame_min(self, frame_bgr: np.ndarray, *, meters_per_pixel: float, camera_id: int = 0) -> Dict[str, Any]:
        """
        - 입력 프레임에서 탐지/세그멘테이션
        - 길이/면적(m, m^2), track_id 부여
        - 주석 프레임(base64)과 최소 디텍션 결과 반환
        - (주의) 오버레이는 '처음 코드'와 동일하게 컨투어 기반으로만 그림
        """
        results = self.model.predict(
            source=frame_bgr,
            conf=0.15,      # 놓침 줄이기
            iou=0.55,       # NMS 병합 강화
            imgsz=1280,
            verbose=False
        )
        r = results[0]

        dets: List[Dict[str, Any]] = []
        contours: List[Optional[np.ndarray]] = []
        boxes_xyxy: List[Tuple[float, float, float, float]] = []

        if r.masks is not None and len(r.masks) > 0:
            # 1) 마스크/박스 추출
            masks = r.masks.data.cpu().numpy()          # (N, H, W)
            boxes = r.boxes.xyxy.cpu().numpy()          # (N, 4)

            # 2) 마스크 → 컨투어
            for i, mask in enumerate(masks):
                cnt = self._mask_to_contour(mask)
                contours.append(cnt)
                boxes_xyxy.append(tuple(map(float, boxes[i])))

            # 3) 카메라별 IoU 트래킹
            tracker = self._get_tracker(camera_id)
            frame_idx = self.frame_idx_by_cam[camera_id]
            track_ids = tracker.update(frame_idx, boxes_xyxy)
            self.frame_idx_by_cam[camera_id] += 1

            # 4) 길이/면적 계산 + 결과 조립
            for i, cnt in enumerate(contours):
                if cnt is None:
                    continue
                met = self._compute_area_length(cnt, meters_per_pixel)
                x1, y1, x2, y2 = boxes_xyxy[i]
                dets.append({
                    "track_id": int(track_ids[i]),
                    "length_m": float(met["length_m"]),
                    "area_m2": float(met["area_m2"]),
                    "box": [float(x1), float(y1), float(x2), float(y2)],
                    "_contour": cnt,  # 내부 주석용 (응답에선 제거)
                })

        # 주석 프레임(원래 스타일 유지: 컨투어가 있을 때만 그림)
        annotated = self._draw_annotations(frame_bgr, dets)
        b64 = self._b64_from_bgr(annotated, q=85)

        # 응답용: contour 제거
        public_dets = [{k: v for k, v in d.items() if k != "_contour"} for d in dets]

        return {
            "image_base64": b64,       # 주석된 이미지(base64)
            "detections": public_dets  # [{track_id, length_m, area_m2, box}, ...]
        }