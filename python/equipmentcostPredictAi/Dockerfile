# 1️⃣ Python 3.12 slim 이미지 사용
FROM python:3.12-slim

# 2️⃣ 작업 디렉토리 설정
WORKDIR /app

# 3️⃣ 의존성 설치
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 4️⃣ 코드 복사
COPY . /app

# 5️⃣ FastAPI 포트
EXPOSE 8000

# 6️⃣ 컨테이너 시작 시 Uvicorn 실행
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]