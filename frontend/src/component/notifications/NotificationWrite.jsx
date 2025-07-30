// src/component/notifications/NotificationWrite.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineFileImage, AiOutlineFolderOpen } from 'react-icons/ai'
import './notifications-write.css'

export default function NotificationWrite() {
  const navigate = useNavigate()

  const [author, setAuthor] = useState('')
  const [title, setTitle]   = useState('')
  const [body, setBody]     = useState('')
  const [important, setImportant] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: API 호출 or 상태 업데이트
    navigate('/notifications')  // 등록 후 목록으로
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className="write-wrapper">
      <h1 className="write-header">Notifications Write</h1>
      <form className="write-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>작성자</label>
          <input
            type="text"
            placeholder="이름을 입력해 주세요."
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label>제목</label>
          <input
            type="text"
            placeholder="제목을 입력해 주세요."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div className="important-switch">
            <span>중요 공지 사항으로 등록</span>
            <input
              type="checkbox"
              checked={important}
              onChange={e => setImportant(e.target.checked)}
            />
          </div>
        </div>
        <div className="form-row body-row">
          <label>내용</label>
          <textarea
            placeholder="내용을 입력해 주세요."
            value={body}
            onChange={e => setBody(e.target.value)}
          />
        </div>
        <div className="form-row file-row">
          <label>첨부 파일</label>
          <div className="file-buttons">
            {/* 실제로는 <input type="file"> 를 숨겨두고 라벨을 꾸며도 좋습니다 */}
            <button type="button" className="file-btn">
              <AiOutlineFileImage size={24}/>  
            </button>
            <button type="button" className="file-btn">
              <AiOutlineFolderOpen size={24}/>
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">등록</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
