# 1️⃣ Python 3.12 slim 이미지 사용
FROM python:3.12-slim

# 2️⃣ 작업 디렉토리 설정
WORKDIR /app

# 3️⃣ 시스템 패키지 설치 (OpenCV 관련)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 4️⃣ 의존성 설치
# CPU 전용 PyTorch 먼저 설치하여 용량 최적화
RUN pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# 나머지 의존성 설치
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 5️⃣ 코드 복사
COPY . /app

# 6️⃣ FastAPI 포트
EXPOSE 8000

# 7️⃣ 컨테이너 시작 시 Uvicorn 실행
CMD ["uvicorn", "yolo_api:app", "--host", "0.0.0.0", "--port", "8000"]
