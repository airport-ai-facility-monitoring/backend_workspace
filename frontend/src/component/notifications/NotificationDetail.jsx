import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api'
import './notifications-detail.css'

export default function NotificationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/notifications/${id}`)
      .then((res) => {
        setNotification(res.data)
      })
      .catch((err) => {
        console.error('공지 조회 실패:', err)
        alert('공지 조회 중 오류가 발생했습니다.')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="detail-wrapper">로딩 중...</div>
  if (!notification) return <div className="detail-wrapper">데이터가 없습니다.</div>

  return (
    <div className="detail-wrapper">
      <div className="back-link" onClick={() => navigate(-1)}>
        <span style={{ marginRight: '6px' }}>←</span> 뒤로가기
      </div>
      <div className="detail-header">
        <h1 className="detail-title">Notifications Detail</h1>
      </div>

      <div className="detail-content">
        <h2 className="detail-item-title">{notification.title}</h2>
        <div className="detail-datetime">
          {notification.writeDate?.replace('T', ' ') ?? '작성일 정보 없음'}
        </div>
        <pre className="detail-body">{notification.contents.trim()}</pre>
      </div>

      <button className="btn-back" onClick={() => navigate(-1)}>
        목록으로 돌아가기
      </button>
    </div>
  )
}