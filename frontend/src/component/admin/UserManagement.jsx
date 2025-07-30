// src/components/management/ManagementPage.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ManagementPage() {
  const navigate = useNavigate()

  // 예시 데이터 (실제론 서버에서 받아올 것)
  const approvalRequests = [
    { id: 1, name: '최재윤' },
    { id: 2, name: '진예나' },
    { id: 3, name: '문승환' },
    { id: 4, name: '허진수' },
    { id: 5, name: '남강민' },
  ]
  const infoRequests = [
    { id: 11, name: '남강민' },
    { id: 12, name: '김민욱' },
    { id: 13, name: '전임록' },
    { id: 14, name: '유의우' },
  ]

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '2rem',
      background: '#f0f4fb',
      boxSizing: 'border-box',
      fontFamily: 'sans-serif',
      color: '#1f263d'
    },
    inner: {
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto'
    },
    pageTitle: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem'
    },
    section: {
      marginBottom: '2rem'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '0.75rem'
    },
    box: {
      background: '#fff',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      maxHeight: '400px',      // 높이 제한
      overflowY: 'auto',       // 세로 스크롤
      boxSizing: 'border-box'
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      border: '1px solid #dee4f8',
      borderRadius: '8px',
      background: '#fff'
    },
    itemName: {
      fontSize: '1rem',
      fontWeight: 500
    },
    btnGroup: {
      display: 'inline-flex',
      gap: '0.5rem'
    },
    btn: {
      padding: '0.4rem 1rem',
      fontSize: '0.85rem',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer'
    },
    btnDetail: {
      background: '#dee1e7',
      color: '#333'
    },
    btnApprove: {
      background: '#4e73df',
      color: '#fff'
    },
    btnReject: {
      background: '#888',
      color: '#fff'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <div style={styles.pageTitle}>관리자 정보 관리</div>

        {/* 승인 요청 섹션 */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>승인 요청</div>
          <div style={styles.box}>
            <div style={styles.list}>
              {approvalRequests.map((u) => (
                <div key={u.id} style={styles.item}>
                  <div style={styles.itemName}>{u.name} 승인요청</div>
                  <div style={styles.btnGroup}>
                    <button
                      style={{ ...styles.btn, ...styles.btnDetail }}
                      onClick={() =>
                        navigate(`/management/approval/${u.id}`)
                      }
                    >
                      상세
                    </button>
                    <button
                      style={{ ...styles.btn, ...styles.btnApprove }}
                      onClick={() => {
                        /* TODO: 승인 API */
                      }}
                    >
                      승인
                    </button>
                    <button
                      style={{ ...styles.btn, ...styles.btnReject }}
                      onClick={() => {
                        /* TODO: 거절 API */
                      }}
                    >
                      거절
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 정보 변경 요청 섹션 */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>정보 변경 요청</div>
          <div style={styles.box}>
            <div style={styles.list}>
              {infoRequests.map((u) => (
                <div key={u.id} style={styles.item}>
                  <div style={styles.itemName}>{u.name} 정보 변경 요청</div>
                  <div style={styles.btnGroup}>
                    <button
                      style={{ ...styles.btn, ...styles.btnDetail }}
                      onClick={() =>
                        navigate(`/management/info/${u.id}`)
                      }
                    >
                      상세
                    </button>
                    <button
                      style={{ ...styles.btn, ...styles.btnApprove }}
                      onClick={() => {
                        /* TODO: 승인 API */
                      }}
                    >
                      승인
                    </button>
                    <button
                      style={{ ...styles.btn, ...styles.btnReject }}
                      onClick={() => {
                        /* TODO: 거절 API */
                      }}
                    >
                      거절
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
