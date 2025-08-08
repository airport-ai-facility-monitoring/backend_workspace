import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/api';
import './notifications-edit.css';

export default function NotificationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [important, setImportant] = useState(false);

  // 파일 상태: 기존/새 파일 공통 관리
  const [file, setFile] = useState(null);           // { name, url?, isNew, file? }
  const [removeFile, setRemoveFile] = useState(false); // 저장 시 삭제할지 여부
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get(`/notifications/${id}`)
      .then(res => {
        const { title, contents, important, originalFilename, fileUrl } = res.data;
        setTitle(title);
        setContents(contents);
        setImportant(important);

        if (originalFilename && fileUrl) {
          // 초기에도 “선택된 파일”처럼 보이게
          setFile({ name: originalFilename, url: fileUrl, isNew: false });
          setRemoveFile(false);
        } else {
          setFile(null);
          setRemoveFile(false);
        }
      })
      .catch(err => {
        alert('공지사항 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      });
  }, [id]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      setFile({ name: selected.name, isNew: true, file: selected });
      setRemoveFile(false);
    }
  };

  // “선택 취소” 버튼 동작: 기존파일이면 삭제 플래그만, 새파일이면 완전 초기화
  const handleClearSelected = () => {
    if (file?.isNew) {
      // 새 파일 선택 취소
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      // 기존 파일 선택 취소 → 저장 시 삭제
      setRemoveFile(true);
      // UI 상 “선택된 파일” 문구를 숨기고 싶으면 file을 null처럼 보이게 처리
      // 하지만 백엔드에 removeFile=true를 보내야 하므로 flag만 유지
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('contents', contents);
    formData.append('important', important);
    formData.append('removeFile', removeFile); // 서버에서 삭제/유지/교체 판단

    // 새 파일만 업로드(교체)
    if (file && file.isNew && file.file) {
      formData.append('file', file.file);
    }

    try {
      await api.put(`/notifications/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('수정이 완료되었습니다.');
      navigate(`/notifications/${id}`);
    } catch (error) {
      console.error(error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="edit-wrapper">
      <div className="back-link" onClick={() => navigate(-1)}>← 뒤로가기</div>
      <h1 className="edit-header">공지사항 수정</h1>

      <form className="edit-form" onSubmit={handleUpdate}>
        {/* 제목 */}
        <div className="form-row">
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 내용 */}
        <div className="form-row">
          <label>내용</label>
          <textarea
            value={contents}
            onChange={e => setContents(e.target.value)}
            rows="8"
            required
          />
        </div>

        {/* 중요 */}
        <div className="form-row checkbox-row">
          <input
            type="checkbox"
            checked={important}
            onChange={e => setImportant(e.target.checked)}
          />
          <span>중요 표시</span>
        </div>

        {/* 파일 */}
        <div className="form-row file-section">
          <label>첨부 파일</label>

          <div className="file-row" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {/* 파일 선택 버튼 (항상 표시) */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
            />

            {/* 초기에도 “선택된 파일” 스타일로 */}
            {file && !removeFile && (
              <div className="selected-file" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* 기존 파일이면 링크, 새 파일이면 평문 */}
                {file.isNew
                  ? <span>선택된 파일: {file.name}</span>
                  : <a href={file.url} target="_blank" rel="noreferrer">선택된 파일: {file.name}</a>}
                <button type="button" onClick={handleClearSelected}>선택 취소</button>
              </div>
            )}

            {/* 사용자가 기존 파일을 ‘선택 취소’한 경우에는 아무것도 표시하지 않음 */}
            {!file && removeFile && (
              <span style={{ opacity: 0.7 }}>선택된 파일 없음</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">저장</button>
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>취소</button>
        </div>
      </form>
    </div>
  );
}