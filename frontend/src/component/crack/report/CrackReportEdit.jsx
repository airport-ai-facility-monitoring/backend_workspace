// src/components/anomalyreport/AnomalyReportEdit.jsx
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function AnomalyReportEdit() {
  const navigate = useNavigate()
  const { id } = useParams()

  // --- 더미 초기값 (실제론 API로 가져오세요) ---
  const [title, setTitle]       = useState('콘크리트 덩어리 파손 보고서')
  const [site, setSite]         = useState('SITE B')
  const [channel, setChannel]   = useState('CCTV‑CH09')
  const [datetime, setDatetime] = useState('2025-07-18T14:12')
  const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/200x120')
  const [section1, setSection1] = useState(
    '콘크리트 덩어리 파손 및 구조물 기울어짐 감지\n콘크리트 기반 구조물이 내부에서부터 파열된 형태로 기울어져 있음\n지지대에 연결된 철근이 다수 노출됨'
  )
  const [section2, setSection2] = useState(
    '🔧 예상 수리 비용 약 14,200,000원 (±5%)\n⏱️ 예상 수리 기간: 5일~7일 소요\n📋 대체 자재 추천:\n‑ 프리캐스트 콘크리트 구조블록\n‑ 내식성 철근 봉강 (SD400급)\n‑ 케이블 피복 보호 튜브'
  )
  const [section3, setSection3] = useState(
    '활주로 진동 및 저강도 충격 누적에 따른 내부 균열 진행 가능성\n배수 불량으로 인한 지반 침하 가능성\n중장비 충격 유입 가능성 분석 필요'
  )

  const handleSave = (e) => {
    e.preventDefault()
    // TODO: API 호출로 저장하고
    navigate(-1)  // 뒤로
  }

  const styles = {
    container: {
      flex: 1,
      padding: '2rem',
      background: '#f0f4fb',
      boxSizing: 'border-box',
      fontFamily: 'sans-serif',
      color: '#1f263d'
    },
    back: {
      fontSize: '1.5rem',
      cursor: 'pointer',
      marginBottom: '1rem'
    },
    form: {
      background: 'white',
      borderRadius: '12px',
      maxWidth: '700px',
      margin: '0 auto',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    },
    fieldRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    label: {
      width: '80px',
      fontWeight: '500',
      fontSize: '0.95rem'
    },
    input: {
      flex: 1,
      padding: '0.5rem 1rem',
      border: '1px solid #dde4f8',
      borderRadius: '6px',
      fontSize: '0.95rem'
    },
    imagePreview: {
      width: '200px',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '6px',
      marginLeft: '1rem',
      border: '1px solid #dde4f8'
    },
    textarea: {
      flex: 1,
      height: '100px',
      padding: '0.75rem',
      border: '1px solid #dde4f8',
      borderRadius: '6px',
      fontSize: '0.95rem',
      resize: 'vertical'
    },
    btnRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem',
      marginTop: '1.5rem'
    },
    btn: {
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.95rem',
      cursor: 'pointer'
    },
    btnPrimary: {
      background: '#333',
      color: '#fff'
    },
    btnSecondary: {
      background: '#e0e0e0',
      color: '#666'
    }
  }

  return (
    <div style={styles.container}>
      {/* ← 뒤로가기 */}
      <div style={styles.back} onClick={() => navigate(-1)}>
        ←
      </div>

      <form style={styles.form} onSubmit={handleSave}>
        {/* 제목 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>제목</label>
          <input
            style={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {/* 현장 / 채널 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>현장</label>
          <input
            style={styles.input}
            value={site}
            onChange={e => setSite(e.target.value)}
          />
        </div>
        <div style={styles.fieldRow}>
          <label style={styles.label}>채널</label>
          <input
            style={styles.input}
            value={channel}
            onChange={e => setChannel(e.target.value)}
          />
        </div>

        {/* 날짜 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>날짜</label>
          <input
            type="datetime-local"
            style={styles.input}
            value={datetime}
            onChange={e => setDatetime(e.target.value)}
          />
        </div>

        {/* 이미지 업로드/미리보기 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>사진</label>
          <input
            type="text"
            placeholder="이미지 url"
            style={styles.input}
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          />
          <img src={imageUrl} alt="preview" style={styles.imagePreview} />
        </div>

        {/* 구분선 */}
        <hr style={{ border: 'none', borderBottom: '1px solid #dde4f8', margin: '1.5rem 0' }} />

        {/* 섹션 1 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>이상 탐지</label>
          <textarea
            style={styles.textarea}
            value={section1}
            onChange={e => setSection1(e.target.value)}
          />
        </div>

        {/* 섹션 2 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>예측 정보</label>
          <textarea
            style={styles.textarea}
            value={section2}
            onChange={e => setSection2(e.target.value)}
          />
        </div>

        {/* 섹션 3 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>원인 추정</label>
          <textarea
            style={styles.textarea}
            value={section3}
            onChange={e => setSection3(e.target.value)}
          />
        </div>

        {/* 저장/취소 */}
        <div style={styles.btnRow}>
          <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>
            저장
          </button>
          <button
            type="button"
            style={{ ...styles.btn, ...styles.btnSecondary }}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
