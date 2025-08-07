import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../config/api'
import './notifications-detail.css'

export default function NotificationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)

  // 마스킹 함수
  const maskWriterId = (id) => {
    if (!id || id.length < 3) return id
    return id[0] + '*'.repeat(id.length - 2) + id.slice(-1)
  }

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

  const extractFileName = (url) => {
    if (!url) return ''
    const parts = url.split('/')
    return parts[parts.length - 1]
  }

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

        {/* 작성일 및 마스킹된 작성자 표시 */}
        <div className="detail-datetime">
          {formatDateTime(notification.writeDate)} / 작성자: {maskWriterId(notification.writerId?.toString())}
        </div>

        {/* 본문 내용 */}
        <pre className="detail-body">{notification.contents?.trim()}</pre>

        {/* 파일 링크 */}
        {notification.fileUrl && (
          <div className="detail-file">
            <span role="img" aria-label="file">📎</span>{' '}
            첨부파일:&nbsp;
            <a href={notification.fileUrl} download target="_blank" rel="noopener noreferrer">
              {extractFileName(notification.fileUrl)}
            </a>
          </div>
        )}
      </div>

      <button className="btn-back" onClick={() => navigate(-1)}>
        목록으로 돌아가기
      </button>
    </div>
  )
}
