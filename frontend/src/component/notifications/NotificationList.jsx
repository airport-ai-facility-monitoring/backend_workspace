import React, { useState } from 'react'
import NotificationItem from './NotificationItem'

const DUMMY = [
  { id: 1, time: 'Yesterday 23:47', tag: '중요', text: '[통합] 김해공항 공지사항 작성 가이드' },
  { id: 2, time: 'Yesterday 23:47', tag: '중요', text: '[통합] 7월16일 김해공항 일일 종합상황' },
  { id: 3, time: 'Yesterday 23:47', tag: '중요', text: '[통합] 7월16일 김해공항 주의 안내' },
  { id: 4, time: 'Today 23:25',   tag: '1',     text: '[관리자] 7월17일 공항운영부 일일 종합상황' },
  { id: 5, time: 'Yesterday 23:23', tag: '2',    text: '[관리자] 7월16일 시설관리부 일일 종합상황' },
]

export default function NotificationList() {
  const [items] = useState(DUMMY)
  return (
    <div className="notification-list">
      {items.map(item => (
        <NotificationItem key={item.id} {...item} />
      ))}
    </div>
  )
}