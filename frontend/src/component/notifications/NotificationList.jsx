import React, { useState, useEffect } from 'react'
import NotificationItem from './NotificationItem'
import api from '../../config/api'

export default function NotificationList() {
  const [importantItems, setImportantItems] = useState([])
  const [regularItems, setRegularItems] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications')
        const data = response.data

        const sorted = data.sort((a, b) => new Date(b.writeDate) - new Date(a.writeDate))

        const important = []
        const regular = []

        let order = 1

        for (const n of sorted) {
          const item = {
            id: n.notificationsId,
            time: formatDateTime(n.writeDate),
            tag: maskWriterId(n.writerId?.toString()),
            text: n.title,
            isImportant: n.important ?? false,
            order: null, // 일단 null로
          }

          if (n.important) {
            important.push(item)
          } else {
            item.order = order++
            regular.push(item)
          }
        }

        setImportantItems(important)
        setRegularItems(regular)
      } catch (error) {
        console.error('공지 불러오기 실패:', error)
      }
    }

    fetchNotifications()
  }, [])

  // 시간 포맷 변경 함수
  const formatDateTime = (isoDate) => {
    if (!isoDate) return ''
    const date = new Date(isoDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  // 작성자 ID 마스킹 함수
  const maskWriterId = (id) => {
    if (!id || id.length < 3) return id
    return id[0] + '*'.repeat(id.length - 2) + id.slice(-1)
  }

  return (
    <div className="notification-list">
      {/* 중요 공지 먼저 렌더링 */}
      {importantItems.map((item) => (
        <NotificationItem key={item.id} {...item} />
      ))}

      {/* 일반 공지는 순번 매겨서 렌더링 */}
      {regularItems.map((item) => (
        <NotificationItem key={item.id} {...item} />
      ))}
    </div>
  )
}