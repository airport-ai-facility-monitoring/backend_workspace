import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api'; // api 모듈 import

// 전체 UI를 구성하는 메인 컴포넌트
function EquipmentReportDashboard() {
  const navigate = useNavigate();
  
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 백엔드 API로부터 데이터를 가져오는 부분
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/equipmentReports'); 
        setReports(response.data);
      } catch (error) {
        console.error("장비 보고서 데이터를 불러오는데 실패했습니다.", error);
        alert("데이터를 불러오는데 실패했습니다.");
      }
    };

    fetchData();
  }, []);

  const handleNavigate = (id) => {
    navigate(`/equipment/report/${id}`);
  };

  // --- 삭제 기능 추가 ---
  const handleDelete = async (id) => {
    // 사용자에게 삭제 여부를 다시 한번 확인
    if (window.confirm(`정말로 ${id}번 보고서를 삭제하시겠습니까?`)) {
      try {
        // 백엔드에 DELETE 요청 전송
        await api.delete(`/equipmentReports/${id}`);
        
        // 화면에서도 해당 데이터를 즉시 제거하여 사용자 경험 향상
        setReports(reports.filter(report => report.id !== id));

        alert("보고서가 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("보고서 삭제에 실패했습니다.", error);
        alert("보고서 삭제 중 오류가 발생했습니다.");
      }
    }
  };
  // --- 삭제 기능 끝 ---

  // 검색 로직
  const filteredReports = reports.filter((report) =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={styles.headerLogo}></span> 장비분석 보고서
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>장비 분석 보고서 조회</h2>
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="장비명"
              style={styles.input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* 조회 버튼은 현재 프론트엔드 필터링에만 사용됩니다 */}
            <button style={styles.searchButton}>조회</button>
          </div>
        </section>

        <section style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>번호</th>
                <th style={styles.th}>장비 종류</th>
                <th style={styles.th}>장비명</th>
                <th style={styles.th}>보고서 등록 시간</th>
                <th style={styles.th}>예측 유지보수 비용(원)</th>
                <th style={styles.th}>보고서</th>
                <th style={styles.th}>관리</th> {/* 관리 컬럼 추가 */}
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} style={styles.tr}>
                  <td style={styles.td}>{report.id}</td>
                  <td style={styles.td}>{report.type}</td>
                  <td style={styles.td}>{report.name}</td>
                  <td style={styles.td}>{report.timestamp}</td>
                  <td style={styles.td}>
                    {report.cost ? report.cost.toLocaleString() : '비용 정보 없음'}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.detailsButton}
                      onClick={() => handleNavigate(report.id)}
                    >
                      상세보기
                    </button>
                  </td>
                  {/* --- 삭제 버튼을 위한 새로운 셀 추가 --- */}
                  <td style={styles.td}>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(report.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

// 스타일 정의 객체
const styles = {
  container: {
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: '"Pretendard", "Malgun Gothic", sans-serif',
  },
  header: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#333',
  },
  headerLogo: {
    marginRight: '8px',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '1rem',
  },
  searchBox: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  searchButton: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: '#f1f1f1',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#333',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  th: {
    padding: '12px 8px',
    backgroundColor: '#fafafa',
    fontWeight: '600',
    color: '#333',
    borderBottom: '1px solid #e2e8f0',
  },
  tr: {
    '&:hover': {
        backgroundColor: '#f8f9fa',
    }
  },
  td: {
    padding: '16px 8px',
    color: '#4a5568',
    borderBottom: '1px solid #f3f3f3',
  },
  detailsButton: {
    padding: '6px 14px',
    fontSize: '0.8rem',
    color: '#368ce8ff',
    backgroundColor: 'white',
    border: '1px solid #368ce8ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  // --- 삭제 버튼 스타일 추가 ---
  deleteButton: {
    padding: '6px 14px',
    fontSize: '0.8rem',
    color: '#f44336', // 빨간색 계열
    backgroundColor: 'white',
    border: '1px solid #f44336',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default EquipmentReportDashboard;