from dataclasses import dataclass
from typing import List, Tuple, Dict, Optional

def iou(a, b) -> float:
    # a,b = (x1,y1,x2,y2)
    x1 = max(a[0], b[0]); y1 = max(a[1], b[1])
    x2 = min(a[2], b[2]); y2 = min(a[3], b[3])
    inter = max(0, x2 - x1) * max(0, y2 - y1)
    area_a = max(0, a[2]-a[0]) * max(0, a[3]-a[1])
    area_b = max(0, b[2]-b[0]) * max(0, b[3]-b[1])
    union = area_a + area_b - inter
    return inter / union if union > 0 else 0.0

@dataclass
class Track:
    track_id: int
    box: Tuple[float, float, float, float]
    last_seen: int = 0
    lost: int = 0

class IoUTracker:
    """
    매우 가벼운 Tracking-by-Detection
    - IoU 최대 매칭
    - max_lost 프레임 후 트랙 삭제
    """
    def __init__(self, iou_thr: float = 0.3, max_lost: int = 30):
        self.iou_thr = iou_thr
        self.max_lost = max_lost
        self._next_id = 1
        self.tracks: Dict[int, Track] = {}

    def update(self, frame_idx: int, boxes: List[Tuple[float, float, float, float]]) -> List[int]:
        # 기존 트랙 모두 lost 증가
        for tr in self.tracks.values():
            tr.lost += 1

        assigned = set()
        track_ids = [-1] * len(boxes)

        # 1) IoU로 매칭
        for det_idx, det_box in enumerate(boxes):
            best_iou, best_tid = 0.0, None
            for tid, tr in self.tracks.items():
                i = iou(det_box, tr.box)
                if i > best_iou:
                    best_iou, best_tid = i, tid
            if best_tid is not None and best_iou >= self.iou_thr and best_tid not in assigned:
                tr = self.tracks[best_tid]
                tr.box = det_box
                tr.last_seen = frame_idx
                tr.lost = 0
                track_ids[det_idx] = best_tid
                assigned.add(best_tid)

        # 2) 매칭 안 된 박스 → 신규 트랙
        for det_idx, det_box in enumerate(boxes):
            if track_ids[det_idx] == -1:
                tid = self._next_id; self._next_id += 1
                self.tracks[tid] = Track(track_id=tid, box=det_box, last_seen=frame_idx, lost=0)
                track_ids[det_idx] = tid

        # 3) 오래 잃어버린 트랙 삭제
        for tid in list(self.tracks.keys()):
            if self.tracks[tid].lost > self.max_lost:
                del self.tracks[tid]

        return track_ids