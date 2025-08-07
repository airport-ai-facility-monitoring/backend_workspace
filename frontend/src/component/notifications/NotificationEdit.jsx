import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/api';
import './notifications-edit.css'; // 통일된 스타일 적용

export default function NotificationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [important, setImportant] = useState(false);
  const [originalFile, setOriginalFile] = useState(null);
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    api.get(`/notifications/${id}`)
      .then(res => {
        const { title, contents, important, originalFilename, fileUrl } = res.data;
        setTitle(title);
        setContents(contents.replace('[중요] ', '')); // 중요 태그 제거
        setImportant(important);
        if (originalFilename && fileUrl) {
          setOriginalFile({ name: originalFilename, url: fileUrl });
        }
      })
      .catch(err => {
        alert("공지사항 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('contents', (important ? '[중요] ' : '') + contents);
    formData.append('important', important);
    if (newFile) {
      formData.append('file', newFile);
    }

    try {
      await api.put(`/notifications/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      alert('수정이 완료되었습니다.');
      navigate(`/notifications/${id}`);
    } catch (error) {
      console.error(error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteFile = () => {
    api.delete(`/notifications/${id}/file`)
      .then(() => {
        alert('첨부파일이 삭제되었습니다.');
        setOriginalFile(null);
      })
      .catch(err => {
        console.error(err);
        alert('파일 삭제에 실패했습니다.');
      });
  };

  return (
    <div className="edit-wrapper">
      <div className="back-link" onClick={() => navigate(-1)}>← 뒤로가기</div>
      <h1 className="edit-header">공지사항 수정</h1>
      <form className="edit-form" onSubmit={handleUpdate}>
        <div className="form-row">
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label>내용</label>
          <textarea
            value={contents}
            onChange={e => setContents(e.target.value)}
            rows="8"
            required
          />
        </div>

        <div className="form-row checkbox-row">
        <input
            type="checkbox"
            checked={important}
            onChange={e => setImportant(e.target.checked)}
        />
        <span>중요 표시</span>
        </div>

        <div className="form-row file-section">
          <label>첨부 파일</label>
          {originalFile && (
            <div className="file-preview">
              <a href={originalFile.url} target="_blank" rel="noreferrer">{originalFile.name}</a>
              <button type="button" className="btn-delete-file" onClick={handleDeleteFile}>삭제</button>
            </div>
          )}
          <input
            type="file"
            onChange={e => setNewFile(e.target.files[0])}
          />
          {newFile && <p>선택된 파일: {newFile.name}</p>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">저장</button>
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>취소</button>
        </div>
      </form>
    </div>
  );
}