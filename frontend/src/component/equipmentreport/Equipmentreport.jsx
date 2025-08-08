import React, { useState } from 'react';
// 1. react-router-dom에서 useNavigate 훅을 가져옵니다.
import { useNavigate } from 'react-router-dom';

// 표에 들어갈 목업 데이터
const reports = [
  {
    id: 1,
    type: '조명(시각유도)',
    name: 'runway_light_1',
    timestamp: '2025-07-18 17:06',
    cost: '550,000',
  },
  {
    id: 2,
    type: '기상관측',
    name: 'runway_9',
    timestamp: '2025-07-17 12:00',
    cost: '1,200,000',
  },
  {
    id: 3,
    type: '표지·표시',
    name: 'runway_15',
    timestamp: '2025-07-17 06:35',
    cost: '300,000'
  },
  {
    id: 4,
    type: '표지·표시',
    name: 'runway_light_8',
    timestamp: '2025-07-16 17:06',
    cost: '55,000',
  },
];

// 전체 UI를 구성하는 메인 컴포넌트
function EquipmentReportDashboard() {
  // 2. useNavigate 훅을 초기화합니다.
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReports, setFilteredReports] = useState(reports);

  // 3. navigate 함수를 사용하여 페이지를 이동하도록 수정합니다.
  const handleNavigate = (id) => {
    // '/equipment/report/{id}' 경로로 이동합니다.
    navigate(`/equipment/report/${id}`);
  };

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredReports(reports);
      return;
    }
    const searchResult = reports.filter((report) =>
      report.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(searchResult);
  };

  return (
    <div style={styles.container}>
      {/* 상단 헤더 */}
      <header style={styles.header}>
        <span style={styles.headerLogo}></span> 장비분석 보고서
      </header>

      <main style={styles.main}>
        {/* 장비 분석 보고서 조회 섹션 */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>장비 분석 보고서 조회</h2>
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="장비명"
              style={styles.input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // 엔터 키를 눌러도 검색이 되도록 추가
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button style={styles.searchButton} onClick={handleSearch}>조회</button>
          </div>
        </section>

        {/* 장비 분석 요청 목록 섹션 */}
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
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} style={styles.tr}>
                  <td style={styles.td}>{report.id}</td>
                  <td style={styles.td}>{report.type}</td>
                  <td style={styles.td}>{report.name}</td>
                  <td style={styles.td}>{report.timestamp}</td>
                  <td style={styles.td}>{report.cost}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.detailsButton}
                      // 수정된 handleNavigate 함수를 호출합니다.
                      onClick={() => handleNavigate(report.id)}
                    >
                      상세보기
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
    // ✅ '조회' 버튼 글씨를 굵게 변경
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
};

export default EquipmentReportDashboard;
