import React, { useState } from 'react';

// 인라인 스타일 객체
const styles = {
  appContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    backgroundColor: '#f9f9f9',
    fontFamily: "'Malgun Gothic', '맑은 고딕', sans-serif",
    color: '#333',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  reportContainer: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #eee',
  },
  title: {
    textAlign: 'center',
    fontSize: '26px',
    fontWeight: '600',
    margin: '0 0 10px 0',
  },
  date: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
  },
  hr: {
    border: '0',
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '30px 0',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr',
    gap: '12px 15px',
    fontSize: '16px',
  },
  dt: {
    fontWeight: 'bold',
    color: '#555',
  },
  dd: {
    margin: 0,
    color: '#222',
  },
  h3: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 15px 0',
  },
  opinionTextarea: {
    width: '100%',
    minHeight: '250px',
    padding: '12px',
    fontSize: '16px',
    lineHeight: 1.7,
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: "'Malgun Gothic', '맑은 고딕', sans-serif",
  },
  opinionTextareaReadOnly: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
  },
  buttonContainer: {
    textAlign: 'right',
    marginTop: '30px',
  },
  button: {
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  editButton: {
    backgroundColor: '#333',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
};


// --- 장비 분석 보고서 UI 컴포넌트 ---
const EquipmentReport = () => {
  // 샘플 데이터 (이 부분은 나중에 API 연동으로 대체 가능)
  const reportData = {
    equipmentName: 'runway_9',
    equipmentType: '조명(시각유도)',
    category: 'REL',
    predictions: '100,000',
    purchase: '350,000',
    initialOpinion: "초기 분석 결과, 터빈 블레이드의 미세 균열이 감지되었습니다. 잔여 수명 예측 모델(LLM)을 기반으로 3년 내 유지보수 비용이 급증할 것으로 예상됩니다.\n\n교체 장비로는 '차세대 GT-2000 모델'을 추천하며, 관련 LLM 프롬프트는 다음과 같습니다:\n'GT-2000 모델의 10년간 TCO(총소유비용)와 기존 모델 대비 에너지 효율 개선율을 비교 분석해줘.'",
  };

  // 편집 모드와 종합의견 텍스트를 관리하기 위한 state
  const [isEditing, setIsEditing] = useState(false);
  const [opinion, setOpinion] = useState(reportData.initialOpinion);

  // 편집/저장 버튼 클릭 핸들러
  const handleButtonClick = () => {
    setIsEditing(!isEditing);
    // 실제 애플리케이션에서는 저장 버튼을 누를 때 API 호출로 데이터를 서버에 전송합니다.
    if (isEditing) {
      console.log('저장된 내용:', opinion);
    // 페이지 이동 
    alert('내용이 저장되었습니다. 보고서 페이지로 이동합니다.'); // 사용자에게 알림
    window.location.href = '/equipment/report'; // 지정된 경로로 페이지 이동
    }
    // '편집하기' 또는 '저장하기' 클릭 시 항상 편집 모드를 토글
    setIsEditing(!isEditing);
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.reportContainer}>
        <h1 style={styles.title}>{reportData.equipmentName} 장비 분석 보고서</h1>
        <p style={styles.date}>보고서 작성일자: 2025. 8. 8.</p>
        <hr style={styles.hr} />

        <dl style={styles.infoGrid}>
          <dt style={styles.dt}>장비명:</dt>
          <dd style={styles.dd}>{reportData.equipmentName}</dd>
          <dt style={styles.dt}>장비 종류:</dt>
          <dd style={styles.dd}>{reportData.equipmentType}</dd>
          <dt style={styles.dt}>카테고리:</dt>
          <dd style={styles.dd}>{reportData.category}</dd>
        </dl>

        <hr style={styles.hr} />

        <dl style={styles.infoGrid}>
          <dt style={styles.dt}>유지보수 비용예측:</dt>
          <dd style={styles.dd}>{reportData.predictions} 원</dd>
          <dt style={styles.dt}>신규 장비 구매비용:</dt>
          <dd style={styles.dd}>{reportData.purchase} 원</dd>
        </dl>

        <hr style={styles.hr} />

        <div>
          <h3 style={styles.h3}>종합의견:</h3>
          {/* <p style={{fontSize: '14px', color: '#888', margin: '0 0 10px 0'}}>
            추천장비 및 LLM 프롬프트
          </p> */}
          <textarea
            style={{
              ...styles.opinionTextarea,
              ...(isEditing ? {} : styles.opinionTextareaReadOnly) // 편집 모드가 아닐 때 readonly 스타일 적용
            }}
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            readOnly={!isEditing} // isEditing이 false이면 수정 불가
          />
        </div>

        <div style={styles.buttonContainer}>
          <button
            style={{
              ...styles.button,
              ...(isEditing ? styles.saveButton : styles.editButton)
            }}
            onClick={handleButtonClick}
          >
            {isEditing ? '저장하기' : '편집하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentReport;