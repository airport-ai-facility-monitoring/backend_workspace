import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './notifications-write.css';
import api from '../../config/api';

// 업로드 정책
const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'pdf'];
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_COUNT = 1;

function validateFiles(files) {
  if (!files || files.length === 0) throw new Error('첨부 파일이 없습니다.');
  if (files.length > MAX_COUNT) throw new Error(`파일은 최대 ${MAX_COUNT}개까지 업로드 가능합니다.`);
  for (const f of files) {
    if (f.size > MAX_SIZE) throw new Error('파일 크기는 5MB 이하여야 합니다.');
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) throw new Error('허용되지 않는 확장자입니다.');
    if (!ALLOWED_MIME.includes(f.type)) throw new Error('허용되지 않는 파일 형식입니다.');
  }
}

export default function NotificationWrite() {
  const navigate = useNavigate();
  const [authorId, setAuthorId] = useState('');
  const [maskedAuthor, setMaskedAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [important, setImportant] = useState(false);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  // 사용자 정보 로딩
  useEffect(() => {
    api.get('/employees/setting')
      .then(response => {
        setUser(response.data);
        setAuthorId(response.data.realEmployeeId);
        setMaskedAuthor(response.data.employeeId);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const ready = Boolean(authorId && title && body);

  // 실패 시 저장 여부 확인
  async function verifyCreatedAfterFailure({ writerId, title, body }) {
    try {
      const res = await api.get('/notifications');
      const now = Date.now();
      const found = res.data.find(n => {
        const w = new Date(n.writeDate).getTime();
        const within30s = Math.abs(now - w) < 30_000;
        return within30s
          && String(n.writerId) === String(writerId)
          && n.title === title
          && n.contents === body;
      });
      return !!found;
    } catch {
      return false;
    }
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
      formData.append('contents', body);
      formData.append('important', important); // 불리언으로

      if (file) {
        validateFiles([file]);
        formData.append('file', file);
      }

      await api.post('/notifications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("공지사항이 등록되었습니다.");
      navigate('/notifications');
    } catch (error) {
      console.error('공지 등록 실패:', error);

      const rescued = await verifyCreatedAfterFailure({
        writerId: authorId,
        title,
        body
      });

      if (rescued) {
        alert("공지사항이 등록되었습니다.");
        navigate('/notifications');
        return;
      }

      const msg = error?.response?.data?.message || '공지 등록 중 오류가 발생했습니다.';
      alert(msg);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setFile(null);
      return;
    }

    try {
      validateFiles(Array.from(files));
      setFile(files[0]);
    } catch (err) {
      alert(err.message);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf" // 수정 페이지처럼 추가
            />
            <small className="hint">허용 확장자: jpg, jpeg, png, pdf · 최대 크기: 5MB · 최대 1개</small>
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
          <button type="submit" className="btn-submit" disabled={!ready}>등록</button>
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>취소</button>
        </div>
      </form>
    </div>
  );
}