import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineFileImage, AiOutlineFolderOpen } from 'react-icons/ai'
import './notifications-write.css'
import api from '../../api/axios' // axios 인스턴스 import

export default function NotificationWrite() {
  const navigate = useNavigate()

  const [author, setAuthor] = useState('')
  const [title, setTitle]   = useState('')
  const [body, setBody]     = useState('')
  const [important, setImportant] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const requestBody = {
      writerId: Number(author),      // writerId는 Long이므로 숫자로 변환
      title: title,
      contents: (important ? '[중요] ' : '') + body,  // 중요 표시
    }

    try {
      await api.post('/notifications', requestBody)
      navigate('/notifications')  // 등록 후 목록으로 이동
    } catch (error) {
      console.error('공지 등록 실패:', error)
      alert('공지 등록 중 오류가 발생했습니다.')
    }
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
            placeholder="숫자 ID를 입력해 주세요." // 현재는 writerId 숫자 기반이므로
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label>제목</label>
          <input
            type="text"
            placeholder="제목을 입력해 주세요."
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
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
            required
          />
        </div>
        <div className="form-row file-row">
          <label>첨부 파일</label>
          <div className="file-buttons">
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