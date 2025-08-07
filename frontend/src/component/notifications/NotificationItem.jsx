import React from 'react'
import { useNavigate } from 'react-router-dom'
import './notification-item.css'

export default function NotificationItem({ id, order, time, tag, text, isImportant }) {
  const navigate = useNavigate()

  return (
    <div className="noti-card" onClick={() => navigate(`/notifications/${id}`)}>
      <div className="noti-top">
        {isImportant ? (
          <span className="noti-badge important">중요</span>
        ) : (
          <span className="noti-order">{order}</span>
        )}
        <span className="noti-time">{time}</span>
      </div>
      <div className="noti-middle">
        <span className="noti-title">{text}</span>
      </div>
      <div className="noti-bottom">
        <span className="noti-writer">작성자: {tag}</span>
      </div>
    </div>
  )
}