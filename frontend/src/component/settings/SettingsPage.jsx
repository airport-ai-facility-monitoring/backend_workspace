// src/component/settings/SettingsPage.jsx
import React, { useState, useEffect } from 'react'
// import api from '../../api';
import axios from 'axios';
import api from '../../config/api';

const SettingsPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/employees/setting')
      .then(response => {
        setUser(response.data);
        console.log("성공")
        console.log('저장된 토큰:', localStorage.getItem("accessToken"));
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

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
      justifyContent: 'center',
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
    }
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>Settings</div>
      <div style={styles.content}>
        <div style={styles.fields}>
          <div style={styles.label}>이름</div>
          <input style={styles.input} defaultValue={user.name} readOnly />

          <div style={styles.label}>사번</div>
          <input style={styles.input} defaultValue={user.employeeId} readOnly />

          <div style={styles.label}>휴대폰번호</div>
          <input style={styles.input} defaultValue={user.phoneNumber} readOnly />

          <div style={styles.label}>이메일</div>
          <input style={styles.input} defaultValue={user.email} readOnly />
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
