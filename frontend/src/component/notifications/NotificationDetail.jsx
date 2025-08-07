import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../config/api'
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

  const maskWriterId = (id) => {
    if (!id || id.length < 3) return id
    return id[0] + '*'.repeat(id.length - 2) + id.slice(-1)
  }

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
        <h2 className="detail-item-title">{notification.title || '제목 없음'}</h2>
        <div className="detail-datetime">
          {notification.writeDate?.replace('T', ' ') ?? '작성일 정보 없음'} / 작성자: {maskWriterId(notification.writerId?.toString())}
        </div>
        <pre className="detail-body">{notification.contents?.trim()}</pre>

        {notification.fileUrl && (
          <div className="detail-file">
            <span role="img" aria-label="파일">📎</span> 첨부파일:&nbsp;
            <a
              href={notification.fileUrl}
              download={notification.originalFilename} // 클릭 시 원본 파일명으로 다운로드
              target="_blank"
              rel="noopener noreferrer"
            >
              {notification.originalFilename}
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