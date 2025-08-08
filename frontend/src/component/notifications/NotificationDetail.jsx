import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../config/api'
import './notifications-detail.css'

export default function NotificationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState(null)

  // ✅ 현재 로그인한 사용자 정보 불러오기 (realEmployeeId)
  useEffect(() => {
    api.get('/employees/setting')
      .then(res => {
        setCurrentUserId(res.data.realEmployeeId)
      })
      .catch(err => {
        console.error('사용자 정보 불러오기 실패:', err)
        alert('로그인 정보를 불러올 수 없습니다.')
      })
  }, [])

  // ✅ 공지사항 데이터 불러오기
  useEffect(() => {
    api.get(`/notifications/${id}`)
      .then((res) => setNotification(res.data))
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

  const handleEdit = () => {
    navigate(`/notifications/edit/${id}`)
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?')
    if (!confirmDelete) return

    try {
      await api.delete(`/notifications/${id}`)
      alert('삭제되었습니다.')
      navigate('/notifications')
    } catch (err) {
      console.error('삭제 실패:', err)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading) return <div className="detail-wrapper">로딩 중...</div>
  if (!notification) return <div className="detail-wrapper">데이터가 없습니다.</div>

  // ✅ 작성자와 현재 로그인 유저가 같은지 확인
  const isWriter = currentUserId && currentUserId === notification.writerId

  return (
    <div className="detail-wrapper">
      <div className="back-link" onClick={() => navigate(`/notifications`)}>
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

        <pre className="detail-body">
          {/* {notification.important ? '[중요] ' : ''} */}
          {notification.contents?.trim()}
        </pre>

        {notification.fileUrl && notification.originalFilename && (
          <div className="detail-file">
            <span role="img" aria-label="파일">📎</span> 첨부파일:&nbsp;
            <a
              href={notification.fileUrl}
              download={notification.originalFilename}
              target="_blank"
              rel="noopener noreferrer"
            >
              {notification.originalFilename}
            </a>
          </div>
        )}
      </div>

      {isWriter && (
        <div className="detail-actions">
          <button onClick={handleEdit}>수정</button>
          <button onClick={handleDelete} style={{ marginLeft: '8px' }}>삭제</button>
        </div>
      )}

      <button className="btn-back" onClick={() => navigate(`/notifications`)}>
        목록으로 돌아가기
      </button>
    </div>
  )
}