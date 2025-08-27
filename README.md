<h1 align="center">✈️ AI 기반 통합 공항시설 관리 시스템</h1>
<p align="center"><b>공항 안전과 유지보수를 자동화하는 스마트 솔루션
실시간 이상 탐지부터 수리 예측, 보고서 자동생성까지 한 번에</b></p>

<p align="center">
  <img src="images/KakaoTalk_20250825_163614162.png" alt="프로젝트 썸네일" width="500px">
</p>

## 👥 팀원을 소개합니다

<table>
  <tr>
    <td align="center"><img src="https://github.com/ok-jam.png" width="100px;"><br/><sub><b>김민욱</b></sub><br/>팀원</td>
    <td align="center"><img src="https://github.com/namgangmin.png" width="100px;"><br/><sub><b>남강민</b></sub><br/>팀장</td>
    <td align="center"><img src="https://github.com/munseunghwan.png" width="100px;"><br/><sub><b>문승환</b></sub><br/>팀원</td>
    <td align="center"><img src="https://github.com/jinyena.png" width="100px;"><br/><sub><b>진예나</b></sub><br/>팀원</td>
    <td align="center"><img src="https://github.com/jaeeyun103.png" width="100px;"><br/><sub><b>최재윤</b></sub><br/>팀원</td>
   <td align="center"><img src="https://github.com/201924611.png" width="100px;"><br/><sub><b>허진수</b></sub><br/>팀원</td>
  </tr>
</table>

---
## 🛫 프로젝트 배경
최근 무안공항 참사 등, 국내 공항에서의 안전사고가 꾸준히 발생하고 있습니다.
하지만 인력과 예산이 부족한 지방공항의 경우, 고비용의 시설관리 시스템을 도입하기 어려워 사고 대응의 공백이 존재합니다.

인천국제공항은 고도화된 FOD 탐지 시스템과 통합 시설관리 시스템을 갖추고 있지만,
지방공항은 초기 구축 비용, 유지보수 인력, 운영 비용의 부담으로 같은 수준의 시스템을 도입하기 어려운 상황입니다.

이에 따라 “지방공항에서도 도입 가능한 저비용, 고효율의 AI 기반 통합 시스템”의 필요성을 절감하게 되었고,
자동화된 탐지, 예측, 보고 시스템을 통해 운영 효율을 극대화하는 방향으로 프로젝트를 기획하게 되었습니다.

## 🗂️ 프로젝트 소개


이에 따라 “지방공항에서도 도입 가능한 저비용, 고효율의 AI 기반 통합 시스템”의 필요성을 절감하게 되었고,
자동화된 탐지, 예측, 보고 시스템을 통해 운영 효율을 극대화하는 방향으로 프로젝트를 기획하게 되었습니다.
프로젝트는 AI를 기반으로 공항의 시설 위험 요소를 자동으로 탐지하고,  
이상 상황에 대해 수리비용 및 기간을 예측, 이후 보고서까지 자동으로 생성하는 올인원(All-in-one) 공항시설 관리 솔루션입니다.  
지방공항도 쉽게 도입 가능하도록  
✅ 기존 인프라 재활용  
✅ 인력 최소화  
✅ 유지보수 비용 절감을 고려해 설계하였습니다.

---

## 🚀 주요 기능

| 기능 | 설명 |
|------|------|
| 🛰️ **이상 객체 탐지** | FOD/조류/차량/인물 등 실시간 탐지 및 맞춤형 경고, 관련 부서 자동 호출 |
| 🛠️ **활주로 손상 탐지 및 보고서 생성** | 균열 탐지 → 수리비용·기간 예측 → 보고서 자동 생성 (LLM 기반) |
| 🧾 **장비 유지보수 분석 및 보고서 생성** | 장비 상태 기반 유지/폐기/신규 판단 및 보고서 생성 |
| 🖥️ **통합 모니터링 대시보드** | 공항 지도, CCTV 스트리밍, 날씨 API, 알림 로그, 이상 탐지 로그 제공 |

<p align="center">
  <img src="images/제목을-입력해주세요_-001 (14).png" alt="서비스 플로우" width="500px">
</p>

---

## 📸 링크
- [서비스 바로가기](https://airportcopy27-h6d3g9g8e6aah6f3.z01.azurefd.net/)
- [관련 자료](https://www.canva.com/design/DAGwwNbYXQQ/meQ64MBZQNk1bcT6cnMEBw/edit?utm_content=DAGwwNbYXQQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

---

## 🪄 기술 스택

### ​ 🧠AI 모델링
[![YOLOv11](https://img.shields.io/badge/YOLOv11-FF4088?style=flat-square&logo=opencv&logoColor=white)](https://github.com/AlexeyAB/darknet)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-FF4088?style=flat-square&logo=opencv&logoColor=white)](https://github.com/ultralytics/ultralytics)
[![LightGBM](https://img.shields.io/badge/LightGBM-9ACD32?style=flat-square&logo=LightGBM&logoColor=white)](https://lightgbm.readthedocs.io/)
[![SVR](https://img.shields.io/badge/SVR-orange?style=flat-square)]()
[![HGBR](https://img.shields.io/badge/HGBR-blueviolet?style=flat-square)]()

### ​ 📚AI Frameworks & Libraries
[![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![Hugging Face](https://img.shields.io/badge/HuggingFace-FFD21F?style=flat-square&logo=huggingface&logoColor=black)](https://huggingface.co/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Roboflow](https://img.shields.io/badge/Roboflow-purple?style=flat-square&logo=roboflow&logoColor=white)](https://roboflow.com/)

### ​ 📝LLM
[![Gemini API](https://img.shields.io/badge/Gemini-4285F4?style=flat-square&logo=google&logoColor=white)]()
[![Transformers](https://img.shields.io/badge/Transformers-orange?style=flat-square&logo=OpenAI&logoColor=white)](https://huggingface.co/transformers/)

### ​​ 🖥️Front-End
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)]()
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

### ​​ ⚙️Back-End
[![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Apache Tomcat](https://img.shields.io/badge/Tomcat-F8DC75?style=flat-square&logo=apachetomcat&logoColor=black)](https://tomcat.apache.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

### ​📦인프라
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Azure](https://img.shields.io/badge/Azure-0078D4?style=flat-square&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![MSA](https://img.shields.io/badge/Microservice--Architecture-green?style=flat-square)]()
[![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=flat-square&logo=apachekafka&logoColor=white)](https://kafka.apache.org/)

### ​🗃️​ Database
[![Azure SQL](https://img.shields.io/badge/Azure%20SQL-0078D4?style=flat-square&logo=microsoftsqlserver&logoColor=white)](https://azure.microsoft.com/services/sql-database/)
[![Azure Storage](https://img.shields.io/badge/Azure%20Storage-0089D6?style=flat-square&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/services/storage/)

