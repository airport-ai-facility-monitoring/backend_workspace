import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function UsersList() {
  const navigate = useNavigate()

  // 예시 데이터 (실제론 API로 받아오세요)
  const users = [
    { id: '1', name: '최재윤' },
    { id: '2', name: '문승환' },
    { id: '3', name: '진예나' },
    { id: '4', name: '김민욱' },
    { id: '5', name: '허진수' },
    { id: '6', name: '남강민' },
    { id: '7', name: '윤원우' },
    { id: '8', name: '전임록' },
  ]

  const styles = {
    container: {
      flex: 1,
      padding: '2rem',
      background: '#f0f4fb',
      boxSizing: 'border-box',
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#1f263d'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      maxWidth: '720px',
      margin: '0 auto',
      boxSizing: 'border-box',
      overflowY: 'auto',
      maxHeight: '70vh'
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      borderBottom: '1px solid #dde4f8'
    },
    name: {
      fontSize: '1rem',
      color: '#333'
    },
    btn: {
      padding: '0.5rem 1rem',
      background: '#e0e0e0',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      color: '#1f263d'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>관리자 정보 관리</div>
      <div style={styles.card}>
        {users.map(user => (
          <div key={user.id} style={styles.item}>
            <span style={styles.name}>{user.name}</span>
            <button
              style={styles.btn}
              onClick={() => navigate(`/admin/users/${user.id}`)}
            >
              상세
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
