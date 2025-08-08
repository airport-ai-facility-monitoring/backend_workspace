1. 폴더 구조
runwaycrack/ai-service
├─ app.py                # FastAPI 엔드포인트 (/video_tick)
├─ detect_damage.py      # YOLOv8 + 길이/면적 계산 + 프레임 주석
├─ tracker.py            # 간단 IoU 트래커 (track_id 유지)
├─ best.pt               # 우리 모델 가중치 (여기에 둔다)
├─ videos/
│   └─ crack_test1.mp4   # 테스트 영상 (무한 반복 재생)
├─ runs/
│   └─ saved/            # 저장되는 JPG/JSON 결과물
├─ requirements.txt
└─ Dockerfile

2. 요구사항
Python 3.10+
pip (또는 venv/conda)
(Linux) OpenCV가 libgl 필요 → Dockerfile로 실행하면 자동 해결

cd runwaycrack/ai-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# AI-Service 균열 탐지 서비스

이 서비스는 YOLO 기반 균열 탐지 및 길이/면적 계산을 수행합니다.

## 환경 설정

```bash
# ai-service 디렉토리에서 가상환경 생성
python -m venv venv
source venv/bin/activate   # (Windows: venv\Scripts\activate)

# 필수 패키지 설치
pip install -r requirements.txt

3. 서비스 실행
# FastAPI 서버 실행
uvicorn app:app --host 0.0.0.0 --port 8001

4. 테스트 방법
4-1 단일 이미지 업로드 테스트
http --form POST http://localhost:8001/detect_damage image@uploads/test.jpg

4-2 비디오 업로드 테스트
http POST http://localhost:8001/video_tick

5. 결과 저장 위치
이미지: runs/saved/
JSON: runs/saved/


