import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// --- UI 데모를 위한 목업 데이터 ---
const mockReports = [
  { id: 1, type: '조명', name: 'REL-001', timestamp: '2023-10-27 10:30:00', cost: 150000 },
  { id: 2, type: '기상관측', name: 'Anemometer-A5', timestamp: '2023-10-27 09:15:00', cost: 550000 },
  { id: 3, type: '표지', name: 'RDRS-T2', timestamp: '2023-10-26 17:45:00', cost: 300000 },
  { id: 4, type: '조명', name: 'RCL-012', timestamp: '2023-10-26 14:20:00', cost: 120000 },
  { id: 5, type: '기상관측', name: 'Visibilitysensor-V2', timestamp: '2023-10-25 11:05:00', cost: 780000 },
];

// 전체 UI를 구성하는 메인 컴포넌트
function EquipmentReportDashboard() {
  // const navigate = useNavigate();
  
  const [reports, setReports] = useState(mockReports);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNavigate = (id) => {
    alert(`상세보기: ${id}번 보고서로 이동합니다.`);
  };

  const handleDelete = (id) => {
    if (window.confirm(`정말로 ${id}번 보고서를 삭제하시겠습니까? (UI에서만 제거됩니다)`)) {
      setReports(reports.filter(report => report.id !== id));
      alert("보고서가 성공적으로 삭제되었습니다.");
    }
  };

  const filteredReports = reports.filter((report) =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        장비분석 보고서
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>장비 분석 보고서 조회</h2>
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="장비명으로 검색"
              style={styles.input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                <th style={styles.th}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
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
                    <td style={styles.td}>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(report.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={styles.td}>검색 결과가 없습니다.</td>
                </tr>
              )}
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
    display: 'flex',
    alignItems: 'center',
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
    borderBottom: '2px solid #e2e8f0',
  },
  tr: {},
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
    transition: 'all 0.2s',
  },
  deleteButton: {
    padding: '6px 14px',
    fontSize: '0.8rem',
    color: '#f44336',
    backgroundColor: 'white',
    border: '1px solid #f44336',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
};

export default EquipmentReportDashboard;