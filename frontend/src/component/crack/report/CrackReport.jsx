// src/components/anomalyreport/Anomalyreport.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

export default function Anomalyreport() {
  const navigate = useNavigate()

  const styles = {
    container: {
      flex: 1,
      padding: '2rem',
      background: '#f0f4fb',
      boxSizing: 'border-box',
      position: 'relative',
      fontFamily: 'sans-serif',
      color: '#1f263d'
    },
    back: {
      fontSize: '1.5rem',
      cursor: 'pointer',
      marginBottom: '1rem'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      maxWidth: '700px',
      margin: '0 auto',
      padding: '2rem',
      boxSizing: 'border-box',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    },
    titleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    title: {
      flex: 1,
      textAlign: 'center',
      fontSize: '1.25rem',
      fontWeight: 'bold',
      textDecoration: 'underline'
    },
    image: {
      width: '200px',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '6px',
      marginLeft: '1rem'
    },
    info: {
      marginBottom: '1rem',
      lineHeight: 1.5
    },
    hr: {
      border: 'none',
      borderBottom: '1px solid #dde4f8',
      margin: '1rem 0'
    },
    section: {
      marginBottom: '1.5rem'
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    sectionIcon: {
      color: '#4e73df',
      marginRight: '0.5rem'
    },
    sectionText: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
      color: '#333'
    },
    editBtn: {
      marginTop: '2rem',
      display: 'flex',
      justifyContent: 'flex-end'
    },
    btn: {
      padding: '0.75rem 1.5rem',
      background: '#333',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  }

  return (
    <div style={styles.container}>
      {/* Back arrow */}
      <div style={styles.back} onClick={() => navigate(-1)}>
        ←
      </div>

      {/* Card */}
      <div style={styles.card}>
        {/* Title + Image */}
        <div style={styles.titleRow}>
          <div style={styles.title}>활주로 남동방향 크랙 보고서</div>
          <img
            src="anomalyreportimg.jpg"
            alt="report"
            style={styles.image}
          />
        </div>

        {/* Site / Channel / Date */}
        <div style={styles.info}>
          <div>현장: SITE B</div>
          <div>채널: CCTV‑CH09</div>
          <div>날짜: 2025년 7월 18일 14:12</div>
        </div>

        <div style={styles.hr} />

        {/* 이상 탐지 결과 */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <CheckBoxIcon style={styles.sectionIcon} />
            이상 탐지 결과
          </div>
          <div style={styles.sectionText}>
            콘크리트 덩어리 파손 및 구조물 기울어짐 감지<br/>
            콘크리트 기반 구조물이 내부에서부터 파열된 형태로 기울어져 있음<br/>
            지지대에 연결된 철근이 다수 노출되고, 주변 전선 및 지지물 손상 확인됨<br/>
            부근의 시각 신호등(ILS 관련 구조물)도 손상 우려 있음
          </div>
        </div>

        <div style={styles.hr} />

        {/* 예측 정보 */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <CheckBoxIcon style={styles.sectionIcon} />
            예측 정보
          </div>
          <div style={styles.sectionText}>
            🔧 예상 수리 비용 약 14,200,000원 (±5%)<br/>
            ⏱️ 예상 수리 기간: 5일~7일 소요<br/>
            📋 대체 자재 추천:<br/>
            &nbsp;&nbsp;- 프리캐스트 콘크리트 구조블록 (KS F 4009)<br/>
            &nbsp;&nbsp;- 내식성 철근 봉강 (SD400급)<br/>
            &nbsp;&nbsp;- 케이블 피복 보호 튜브
          </div>
        </div>

        <div style={styles.hr} />

        {/* 원인 추정 */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <CheckBoxIcon style={styles.sectionIcon} />
            원인 추정
          </div>
          <div style={styles.sectionText}>
            활주로 접지 인근 잦은 진동 및 저강도 충격 누적에 따라 내부 균열이 진행되었을 가능성<br/>
            콘크리트 기반 하단에 배수 불량으로 인한 지반 침하 가능성 존재<br/>
            최근 강풍 및 중장비 근접 운행에 의한 구조물 충격 유입 가능성도 분석 필요
          </div>
        </div>

        {/* Edit button */}
        <div style={styles.editBtn} onClick={() => navigate('/anomalyreport/edit')}>
          <button style={styles.btn}>편집하기</button>
        </div>
      </div>
    </div>
  )
}
