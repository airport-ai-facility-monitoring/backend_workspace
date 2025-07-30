// src/component/notifications/NotificationDetail.jsx
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './notifications-detail.css'

export default function NotificationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // TODO: 실제 데이터 fetch 로직
  const dummy = {
    title: '[관리자] 2025년 7월17일 김해공항 공항운영부 일일 종합상황',
    datetime: '2025.07.18 23:25',
    body: `
안녕하세요 김해공항 공항 운영부 관리자 남강민 입니다.
금일(7월 17일) 기준 김해공항 내 주요 시설물 이상 여부 및 운영 현황에 대한 종합 보고입니다.
특히 활주로 주변 구조물 이상 징후가 포착되어 관련 대응이 이루어졌으며, 다음과 같은 조치 사항이 보고됩니다.
1. 시설 이상 감지 내역
CH03 채널을 통해 남측 활주로 주변 콘크리트 구조물 파손 감지(17:06)
파손 구조물은 보조 항행시설 기반 지지대로 확인됨
임시 가설 펜스 설치 및 접근 통제 완료

2. 이상 원인 및 추정
최근 비 예보 및 트럭 진입 빈도 증가 → 지반 침하 및 누수 가능성
현장 철근 노출 및 진입로 일부 균열 확인됨

3. 응급 조치 사항
관련 부서와 긴급 회의 진행 (내일 오전 10:00)
임시 차단선 설치 및 CCTV 채널 실시간 모니터링 강화
수리 예상 기간: 7일 내외, 추정 비용 약 1,420만 원

4. 기타 사항
오늘 기준 항공기 이착륙 지연 없음
기상 상황 양호 (기온 27.3°C, 북서풍 2.3m/s, 강수 없음)
다음 보고는 7월 18일 20:00 예정
  
이상입니다. 남강민 드림
    `,
  }

  return (
    <div className="detail-wrapper">
      <div className="detail-header">
        <h1 className="detail-title">Notifications Detail</h1>
      </div>

      <div className="detail-content">
        <h2 className="detail-item-title">{dummy.title}</h2>
        <div className="detail-datetime">{dummy.datetime}</div>
        <pre className="detail-body">{dummy.body.trim()}</pre>
      </div>

      <button
        className="btn-back"
        onClick={() => navigate(-1)}
      >
        목록으로 돌아가기
      </button>
    </div>
  )
}