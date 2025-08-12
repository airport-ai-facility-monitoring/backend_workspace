import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ... (스타일 객체는 기존과 동일합니다)
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
  // --- ⬇️ 확인 버튼 스타일 추가 ⬇️ ---
  confirmButton: {
    backgroundColor: '#6c757d',
    marginLeft: '10px',
  },
  // --- ⬆️ 확인 버튼 스타일 추가 ⬆️ ---
};


const EquipmentReportDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { reportItem } = location.state || {};

    if (!reportItem) {
        return (
            <div style={styles.appContainer}>
                <div style={styles.reportContainer}>
                    <h1 style={styles.title}>데이터 오류</h1>
                    <p style={{textAlign: 'center'}}>보고서 데이터를 찾을 수 없습니다. 목록 페이지에서 다시 시도해주세요.</p>
                    <div style={styles.buttonContainer}>
                        <button style={{...styles.button, ...styles.editButton}} onClick={() => navigate('/equipment/report')}>
                            목록으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    const { reportData, formData, type: mainCategory, opinion: initialOpinion } = reportItem;
    
    const [isEditing, setIsEditing] = useState(false);
    const [opinion, setOpinion] = useState(initialOpinion);

    const handleButtonClick = () => {
        if (isEditing) {
            try {
                const savedReports = JSON.parse(localStorage.getItem('reports') || '[]');
                const updatedReports = savedReports.map(report => {
                    if (report.id === reportItem.id) {
                        return { ...report, opinion: opinion };
                    }
                    return report;
                });
                localStorage.setItem('reports', JSON.stringify(updatedReports));
                alert('수정된 내용이 저장되었습니다.');
                
                navigate('/equipment/report');

            } catch (error) {
                console.error("localStorage 저장 중 오류 발생:", error);
                alert("저장에 실패했습니다.");
            }
        }
        setIsEditing(!isEditing);
    };

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}.`;

    return (
        <div style={styles.appContainer}>
            <div style={styles.reportContainer}>
                <h1 style={styles.title}>{formData.equipmentName || 'N/A'} 장비 분석 보고서</h1>
                <p style={styles.date}>보고서 작성일자: {formattedDate}</p>
                <hr style={styles.hr} />

                <dl style={styles.infoGrid}>
                    <dt style={styles.dt}>장비명:</dt>
                    <dd style={styles.dd}>{formData.equipmentName || 'N/A'}</dd>
                    <dt style={styles.dt}>장비 종류:</dt>
                    <dd style={styles.dd}>{mainCategory}</dd>
                    <dt style={styles.dt}>카테고리:</dt>
                    <dd style={styles.dd}>{formData.category}</dd>
                </dl>

                <hr style={styles.hr} />

                <dl style={styles.infoGrid}>
                    <dt style={styles.dt}>유지보수 비용예측:</dt>
                    <dd style={styles.dd}>{Number(reportData.cost).toLocaleString()} 원</dd>
                    <dt style={styles.dt}>신규 장비 구매비용:</dt>
                    <dd style={styles.dd}>{Number(formData.purchase).toLocaleString()} 원</dd>
                </dl>

                <hr style={styles.hr} />

                <div>
                    <h3 style={styles.h3}>종합의견:</h3>
                    <textarea
                        style={{ ...styles.opinionTextarea, ...(isEditing ? {} : styles.opinionTextareaReadOnly) }}
                        value={opinion}
                        onChange={(e) => setOpinion(e.target.value)}
                        readOnly={!isEditing}
                    />
                </div>

                {/* --- ⬇️ 주요 수정 사항: 버튼 컨테이너 로직 변경 ⬇️ --- */}
                <div style={styles.buttonContainer}>
                    {isEditing ? (
                        // 편집 모드일 때: '저장하기' 버튼만 표시
                        <button
                            style={{ ...styles.button, ...styles.saveButton }}
                            onClick={handleButtonClick}
                        >
                            저장하기
                        </button>
                    ) : (
                        // 기본 모드일 때: '편집하기'와 '확인' 버튼 표시
                        <>
                            <button
                                style={{ ...styles.button, ...styles.editButton }}
                                onClick={handleButtonClick}
                            >
                                편집하기
                            </button>
                            <button
                                style={{ ...styles.button, ...styles.confirmButton }}
                                onClick={() => navigate('/equipment/report')}
                            >
                                확인
                            </button>
                        </>
                    )}
                </div>
                 {/* --- ⬆️ 주요 수정 사항 ⬆️ --- */}
            </div>
        </div>
    );
};

export default EquipmentReportDetail;
