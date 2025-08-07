import React from 'react'
import { useNavigate } from 'react-router-dom'
import './notification-item.css'

export default function NotificationItem({ id, time, tag, text, isImportant, order }) {
  const navigate = useNavigate()

  return (
    <div
      className="notification-item"
      onClick={() => navigate(`/notifications/${id}`)}
    >
      <div className="notification-left">
        {isImportant ? (
          <span className="notification-important">중요</span>
        ) : (
          <span className="notification-order">{order}</span>
        )}
        <span className="notification-time">{time}</span>
      </div>

      <div className="notification-content">
        <div className="notification-title">{text || '제목 없음'}</div>
        <div className="notification-writer">작성자: {tag}</div>
      </div>
    </div>
  )
}