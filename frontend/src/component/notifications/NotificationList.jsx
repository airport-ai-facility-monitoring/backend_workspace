import React, { useState, useEffect } from 'react'
import NotificationItem from './NotificationItem'
import api from '../../config/api' // axios 인스턴스 경로에 따라 조정

export default function NotificationList() {
  const [importantItems, setImportantItems] = useState([])
  const [generalItems, setGeneralItems] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications')
        const data = response.data

        const transformed = data.map((n) => ({
          id: n.notificationsId,
          time: formatDateTime(n.writeDate),
          tag: n.writerId?.toString(),
          text: n.title,
          isImportant: n.important ?? false,
        }))

        // 중요 / 일반 분리
        const important = transformed.filter(n => n.isImportant)
        const general = transformed.filter(n => !n.isImportant)

        setImportantItems(important)
        setGeneralItems(general)
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
      {/* 중요 공지사항은 순번 없이 표시 */}
      {importantItems.map(item => (
        <NotificationItem
          key={item.id}
          order={null}  // 중요 공지는 순번 X
          {...item}
        />
      ))}

      {/* 일반 공지는 1번부터 순번 매김 */}
      {generalItems.map((item, index) => (
        <NotificationItem
          key={item.id}
          order={index + 1}  // 일반 공지만 번호 매김
          {...item}
        />
      ))}
    </div>
  )
}