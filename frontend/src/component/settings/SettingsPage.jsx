// src/component/settings/SettingsPage.jsx
import React, { useState } from 'react'


const SettingsPage = () => {
  const [showReset, setShowReset] = useState(false)

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem',
      background: '#f0f4fb',
      height: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      fontFamily: 'sans-serif',
      color: '#1f263d'
    },

    header: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem'
    },
    content: {
      display: 'flex',
      gap: '4rem',
      alignItems :'center',
    },
    profile: {
      position: 'relative',
      width: '300px',
      height: '300px'
    },
    avatar: {
      width: '100%',
      height: '100%',
      borderRadius: '75px',
      objectFit: 'cover',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    changeIcon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      background: 'white',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    },
    fields: {
      flex: 0.5,
      display: 'grid',
      gridTemplateColumns: '80px 1fr',
      rowGap: '1rem',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    label: {
      textAlign: 'right',
      paddingRight: '1rem',
      fontSize: '0.85rem'
    },
    input: {
      background: '#e0dfe4',
      border: 'none',
      borderRadius: '6px',
      padding: '0.75rem 1rem',
      fontSize: '0.95rem',
      color: '#1f263d'
    },
    buttonRow: {
      marginTop: '2rem',
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
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
      color: 'white'
    },
    btnSecondary: {
      background: '#e0e0e0',
      color: '#666'
    },
    popupOverlay: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '320px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      padding: '1rem',
      zIndex: 1000
    },
    popupHeader: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    popupText: {
      fontSize: '0.85rem',
      color: '#555',
      marginBottom: '1rem'
    },
    popupField: {
      width: '100%',
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    popupInput: {
      flex: 1,
      marginLeft: '0.5rem',
      border: 'none',
      borderBottom: '1px solid #ccc',
      fontSize: '0.95rem',
      padding: '0.25rem'
    },
    popupBtnRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.5rem'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>Settings</div>
      <div style={styles.content}>
        {/* Profile Area */}
        <div style={styles.profile}>
          {/* Replace src with your photo URL */}
          <img
            src="/karina.jpg"
            alt="avatar"
            style={styles.avatar}
          />
          <div style={styles.changeIcon}>
            ✎
          </div>
        </div>

        {/* Fields */}
        <div style={styles.fields}>
          <div style={styles.label}>이름</div>
          <input style={styles.input} defaultValue="진예나" />

          <div style={styles.label}>사번</div>
          <input style={styles.input} defaultValue="202112570" />

          <div style={styles.label}>휴대폰번호</div>
          <input style={styles.input} defaultValue="010-1234-5678" />

          <div style={styles.label}>이메일</div>
          <input style={styles.input} defaultValue="IMPRINCESS18@pac.co.kr" />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.buttonRow}>
        <button
          style={{ ...styles.btn, ...styles.btnPrimary }}
          onClick={() => setShowReset(true)}
        >
          비밀번호 재설정
        </button>
        <button style={{ ...styles.btn, ...styles.btnSecondary }}>
          정보 변경 요청
        </button>
      </div>

      {/* Password Reset Popup */}
      {showReset && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupHeader}>비밀번호 변경</div>
          <div style={styles.popupText}>
            새로운 비밀번호를 입력하세요. 비밀번호는 대/소문자를 구분하고,
            영문, 숫자, 특수문자 중 2가지 이상이 포함되어야 합니다.
          </div>
          <div style={styles.popupField}>
            <label>현재비밀번호</label>
            <input type="password" style={styles.popupInput} />
          </div>
          <div style={styles.popupField}>
            <label>신규비밀번호</label>
            <input type="password" style={styles.popupInput} />
          </div>
          <div style={styles.popupField}>
            <label>신규비밀번호확인</label>
            <input type="password" style={styles.popupInput} />
          </div>
          <div style={styles.popupBtnRow}>
            <button
              style={{ ...styles.btn, ...styles.btnPrimary }}
              onClick={() => { /* TODO: change logic */ setShowReset(false) }}
            >
              변경
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnSecondary }}
              onClick={() => setShowReset(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default SettingsPage