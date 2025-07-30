// src/component/notifications/NotificationItem.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function NotificationItem({ id, time, tag, text }) {
  return (
    <Link
      to={`/notifications/${id}`}
      className="notification-item"
      style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
    >
      <span className="item-tag">{tag}</span>
      <div className="item-body">
        <span className="item-time">{time}</span>
        <div className="item-text">{text}</div>
      </div>
    </Link>
  )
}

