import React from 'react'
import { Link } from 'react-router-dom'

export default function NotificationItem({ id, time, text, isImportant, order }) {
  return (
    <Link
      to={`/notifications/${id}`}
      className="notification-item"
      style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
    >
      {/* ✅ 중요: 파란 박스 / 일반: 숫자 표시 */}
      {isImportant ? (
        <span className="item-tag important">중요</span>
      ) : order != null ? (
        <span className="item-order">{order}</span>
      ) : null}

      <div className="item-body">
        <span className="item-time">{time}</span>
        <div className="item-text">{text}</div>
      </div>
    </Link>
  )
}