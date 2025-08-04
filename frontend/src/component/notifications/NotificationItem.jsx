import React from 'react'
import { Link } from 'react-router-dom'

export default function NotificationItem({ id, time, text, isImportant, order }) {
  return (
    <Link
      to={`/notifications/${id}`}
      className="notification-item"
      style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
    >
      {/* 조건 분기: 중요일 때만 박스로 감싸기 */}
      {isImportant ? (
        <span className="item-tag important">중요</span>
      ) : (
        <span className="item-order">{order}</span>
      )}

      <div className="item-body">
        <span className="item-time">{time}</span>
        <div className="item-text">{text}</div>
      </div>
    </Link>
  )
}