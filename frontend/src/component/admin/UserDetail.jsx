// src/components/users/UserDetail.jsx
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // 예시 사용자 정보 (실제론 API 호출)
  const user = {
    id,
    name: '최재윤',
    staffNo: '20193040',
    phone: '010-1234-5678',
    email: 'IMPRINCESS18@pac.co.kr',
    avatar: 'https://via.placeholder.com/300x300.png?text=Avatar'
  }

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      padding: '2rem',
      background: '#f0f4fb',
      boxSizing: 'border-box',
      fontFamily: 'sans-serif',
      color: '#1f263d'
    },
    inner: {
      width: '100%',
      maxWidth: '700px',
      margin: '0 auto'
    },
    back: {
      fontSize: '1.5rem',
      cursor: 'pointer',
      marginBottom: '1.5rem',
      color: '#333'
    },
    card: {
      background: '#fff',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      boxSizing: 'border-box',
      width: '800px',

    },
    title: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      margin: 0,
      marginBottom: '2rem'
    },
    body: {
      display: 'flex',
      gap: '3rem',
      alignItems: 'center'
    },
    avatar: {
      width: '200px',
      height: '200px',
      borderRadius: '24px',       // softly rounded rectangle
      objectFit: 'cover',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    fields: {
      display: 'grid',
      gridTemplateColumns: '100px minmax(0,1fr)',
      columnGap: '2rem',
      rowGap: '1.5rem',
      alignItems: 'center'
    },
    label: {
      textAlign: 'right',
      fontSize: '1rem'
    },
    input: {
      background: '#e0dfe4',
      border: 'none',
      borderRadius: '6px',
      padding: '0.75rem 1rem',
      fontSize: '0.95rem',
      color: '#1f263d',
      maxWidth: '350px'
    },
    btnRow: {
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
      <div style={styles.inner}>
        {/* 뒤로가기 */}
        <div style={styles.back} onClick={() => navigate(-1)}>
          ←
        </div>

        {/* 카드 */}
        <div style={styles.card}>
          <h2 style={styles.title}>{user.name}</h2>

          <div style={styles.body}>
            {/* Avatar */}
            <img src={user.avatar} alt="avatar" style={styles.avatar} />

            {/* Info fields */}
            <div style={styles.fields}>
              <div style={styles.label}>이름</div>
              <input style={styles.input} value={user.name} readOnly />

              <div style={styles.label}>사번</div>
              <input style={styles.input} value={user.staffNo} readOnly />

              <div style={styles.label}>휴대폰번호</div>
              <input style={styles.input} value={user.phone} readOnly />

              <div style={styles.label}>이메일</div>
              <input style={styles.input} value={user.email} readOnly />
            </div>
          </div>

          {/* 확인 버튼 */}
          <div style={styles.btnRow}>
            <button style={styles.btn} onClick={() => navigate(-1)}>
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
