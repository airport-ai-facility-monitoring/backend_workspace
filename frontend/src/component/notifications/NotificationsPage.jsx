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
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          Notifications
        </h1>
        <div className="header-actions">
          <input
            type="text"
            className="search-input"
            placeholder="검색..."
            onChange={(e) => {
              /* TODO: 검색 로직 */
            }}
          />
          <button
            className="btn-new"
            onClick={() => navigate('/notifications/new')}
          >
            작성
          </button>
        </div>
      </div>

      {/* 리스트만 가운데로 고정 */}
      <div className="notification-page-content">
        <NotificationList />
      </div>
    </div>
  )
}