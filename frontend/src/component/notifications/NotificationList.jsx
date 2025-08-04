import React, { useState, useEffect } from 'react'
import NotificationItem from './NotificationItem'
import api from '../../config/api' // axios 인스턴스 경로에 따라 조정

export default function NotificationList() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications')
        console.log('response.data:', response.data)
        const data = response.data

        const transformed = data.map((n) => ({
          id: n.notificationsId,
          time: formatDateTime(n.writeDate),
          tag: n.writerId?.toString(),
          text: n.title,
          isImportant: n.important ?? false // ✅ 중요 여부 수신
        }))

        setItems(transformed)
      } catch (error) {
        console.error('공지 불러오기 실패:', error)
      }
    }

    fetchNotifications()
  }, [])

  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${isToday ? 'Today' : 'Yesterday'} ${hours}:${minutes}`
  }

  return (
    <div className="notification-list">
      {items.map((item, index) => (
        <NotificationItem
          key={item.id}
          order={index + 1} // ✅ 순번 전달
          {...item}
        />
      ))}
    </div>
  )
}