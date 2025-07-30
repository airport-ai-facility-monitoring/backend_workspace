// src/components/notifications/NotificationsPage.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import './notifications.css'
import NotificationList from './NotificationList'

export default function NotificationsPage() {
  const navigate = useNavigate()

  return (
    <div className="notifications-container">
      {/* 헤더 */}
      <div className="notifications-header">
        <h1>Notifications</h1>
        <div className="header-actions">
          {/* 검색창 */}
          <input
            type="text"
            className="search-input"
            placeholder="검색..."
            onChange={(e) => {
              /* TODO: 검색 로직 */
            }}
          />

          {/* 새 공지 버튼 (MUI 아이콘 제거) */}
          <button
            className="btn-new"
            onClick={() => navigate('/notifications/new')}
          >
            작성
          </button>
        </div>
      </div>

      {/* 본문: 공지 리스트 */}
      <div className="notifications-content">
        <NotificationList />
      </div>
    </div>
  )
}

