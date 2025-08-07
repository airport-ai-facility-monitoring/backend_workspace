import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineFileImage, AiOutlineFolderOpen } from 'react-icons/ai'
import './notifications-write.css'
import api from '../../config/api' // axios 인스턴스 import

export default function NotificationWrite() {
  const navigate = useNavigate()
  const [authorId, setAuthorId] = useState('')
  const [maskedAuthor, setMaskedAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [important, setImportant] = useState(false)
  const [file, setFile] = useState(null)
  const [user, setUser] = useState(null);
  // ✅ 사용자 ID를 localStorage에서 불러와 자동 입력 + 마스킹
  // useEffect(() => {
  //   const userId = localStorage.getItem('userId') // 실제 상황에 따라 key 확인
  //   setAuthorId(userId || '')
  //   setMaskedAuthor(maskUserId(userId || ''))
  // }, [])
  useEffect(() => {
    api.get('/employees/setting')
      .then(response => {
        setUser(response.data);
        console.log("성공")
        console.log('저장된 토큰:', localStorage.getItem("accessToken"));
        console.log(response.data.realEmployeeId);
        setAuthorId(response.data.realEmployeeId);
        setMaskedAuthor(response.data.employeeId);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const maskUserId = (id) => {
    if (!id || id.length < 3) return id
    return id[0] + '*'.repeat(id.length - 2) + id.slice(-1)
  }

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!maskedAuthor) {
    alert("작성자 ID가 없습니다.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append('writerId', authorId);
    formData.append('title', title);
    //formData.append('contents', (important ? '[중요] ' : '') + body);
    formData.append('contents', body);
    formData.append('important', important ? 'true' : 'false');

    if (file) {
      formData.append('file', file);
    }

    for (let pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`)
  }

    await api.post('/notifications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    alert("공지사항이 등록되었습니다.");
    navigate('/notifications');
  } catch (error) {
    console.error('공지 등록 실패:', error);
    alert('공지 등록 중 오류가 발생했습니다.');
  }
};

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleFileRemove = () => {
  setFile(null);
  };

  return (
    <div className="write-wrapper">
      <div className="back-link" onClick={() => navigate(-1)}>
        <span style={{ marginRight: '6px' }}>←</span> 뒤로가기
      </div>

      <h1 className="write-header">Notifications Write</h1>

      <form className="write-form" onSubmit={handleSubmit}>
        
        {/* 작성자 */}
        <div className="form-row">
          <label>작성자</label>
          <input type="text" value={maskedAuthor} readOnly />
        </div>

        {/* 제목 + 중요체크 */}
        <div className="form-row title-row">
          <label>제목</label>
          <div className="title-content">
            <input
              type="text"
              placeholder="제목을 입력해 주세요."
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <label className="important-checkbox">
              <input
                type="checkbox"
                checked={important}
                onChange={e => setImportant(e.target.checked)}
              />
              <span>중요</span>
            </label>
          </div>
        </div>

        {/* 내용 */}
        <div className="form-row">
          <label>내용</label>
          <textarea
            placeholder="내용을 입력해 주세요."
            value={body}
            onChange={e => setBody(e.target.value)}
            required
          />
        </div>

        {/* 첨부파일 */}
        <div className="form-row">
          <label>첨부 파일</label>
          <div className="file-box">
            <input type="file" onChange={handleFileChange} />
            {file && (
              <div className="file-info">
                <span>선택된 파일: {file.name}</span>
                <button type="button" className="btn-delete" onClick={handleFileRemove}>삭제</button>
              </div>
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="form-actions">
          <button type="submit" className="btn-submit">등록</button>
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>취소</button>
        </div>
      </form>
    </div>
  );
}