import React from 'react';

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
function Dashboard() {
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
              placeholder="장비를 입력하시오"
              style={styles.input}
            />
            <button style={styles.searchButton}>조회</button>
          </div>
        </section>

        {/* 장비 분석 요청 목록 섹션 */}
        <section style={styles.card}>
          {/* <h2 style={styles.cardTitle}>장비 분석 요청</h2> */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.cardTitle}>번호</th>
                <th style={styles.cardTitle}>장비 종류</th>
                <th style={styles.cardTitle}>장비명</th>
                <th style={styles.cardTitle}>장비 등록 시간</th>
                <th style={styles.cardTitle}>예측 유지보수 비용</th>
                <th style={styles.cardTitle}>보고서</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} style={styles.tr}>
                  <td style={styles.td}>{report.id}</td>
                  <td style={styles.td}>
                    {report.isHighlighted ? (
                      <a href="#" style={styles.highlightLink}>
                        {report.type}
                      </a>
                    ) : (
                      report.type
                    )}
                  </td>
                  <td style={styles.td}>{report.name}</td>
                  <td style={styles.td}>{report.timestamp}</td>
                  <td style={styles.td}>{report.cost}</td>
                  <td style={styles.td}>
                    <button style={styles.detailsButton}>상세보기</button>
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
    margin: '0 0 1rem 0',
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
    fontWeight: '500',
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
    fontWeight: '500',
    color: '#555',
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
  highlightLink: {
    color: '#2563eb',
    textDecoration: 'underline',
    fontWeight: '500',
  },
  detailsButton: {
    padding: '6px 14px',
    fontSize: '0.8rem',
    color: '#4a5568',
    backgroundColor: 'white',
    border: '1px solid #cbd5e0',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Dashboard;