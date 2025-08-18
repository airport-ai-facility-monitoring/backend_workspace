import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/api';
import './notifications-edit.css';

// ✅ 업로드 정책 (프론트 사전검증)
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

// ✅ 백엔드 다운로드 엔드포인트 규칙에 맞는 URL 생성
const getDownloadUrl = (id, savedName) => `/notifications/${id}/files/${savedName}`;

export default function NotificationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [important, setImportant] = useState(false);

  // 파일 상태: 기존/새 파일 공통 관리
  const [file, setFile] = useState(null);           // { name, url?, isNew, file? }
  const [removeFile, setRemoveFile] = useState(false); // 저장 시 삭제할지 여부
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get(`/notifications/${id}`)
      .then(res => {
        const { title, contents, important, originalFilename, fileUrl } = res.data;
        setTitle(title);
        setContents(contents);
        setImportant(important);

        if (originalFilename && fileUrl) {
          // fileUrl에는 savedName이 들어온다고 가정
          setFile({ name: originalFilename, url: getDownloadUrl(id, fileUrl), isNew: false, savedName: fileUrl });
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
    if (!selected) {
      setFile(null);
      setFileName('');
      return;
    }

    try {
      // ✅ 업로드 즉시 사전검증
      validateFiles([selected]);
      setFile({ name: selected.name, isNew: true, file: selected });
      setFileName(selected.name)
      setRemoveFile(false); // 새 파일을 고르면 삭제 플래그는 해제
    } catch (err) {
      alert(err.message);
      setFile(null);
      setFileName('')
      if (fileInputRef.current) fileInputRef.current.value = '';
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
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // ✅ 백엔드 규칙상 "파일 교체"와 "삭제"를 동시에 요청하면 안 됨
    if (removeFile && file?.isNew) {
      alert('파일 교체와 삭제를 동시에 할 수 없습니다. 하나만 선택하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('contents', contents);
    formData.append('important', important);
    formData.append('filename', fileName);

    // 새 파일만 업로드(교체)
    if (file && file.isNew && file.file) {
      // ✅ 서버 가기 전 최종검증
      try {
        validateFiles([file.file]);
      } catch (err) {
        alert(err.message);
        return;
      }
    }

    try {
      // 백엔드가 DTO로 200/201을 내려주면 성공 처리
      const res = await api.put(`/notifications/${id}`, formData);
      const sasUrl = res.data.url
        if (file) {
        await fetch(sasUrl, {
          method: 'PUT',
          headers: {
            'x-ms-blob-type': 'BlockBlob',
            'Content-Type': file.type
          },
          body: file
        });
      }
      alert('수정이 완료되었습니다.');
      navigate(`/notifications/${id}`);
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.message || '수정 중 오류가 발생했습니다.';
      alert(msg);
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
            {/* ✅ 파일 선택시 accept으로 1차 필터 */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"  // ✅
            />
            <small style={{ opacity: 0.7 }}>
              허용 확장자: jpg, jpeg, png, pdf · 최대 크기: 5MB · 최대 1개
            </small>

            {/* 선택된 파일 표기 */}
            {file && !removeFile && (
              <div className="selected-file" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {file.isNew
                  ? <span>선택된 파일: {file.name}</span>
                  : <a href={file.url} target="_blank" rel="noreferrer">선택된 파일: {file.name}</a>}
                <button type="button" onClick={handleClearSelected}>선택 취소</button>
              </div>
            )}

            {!file && removeFile && (
              <span style={{ opacity: 0.7 }}>선택된 파일 없음 (저장 시 삭제)</span>
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