import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 스타일 정의 객체 (기존과 동일)
const styles = {
  container: { backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '2rem', fontFamily: '"Pretendard", "Malgun Gothic", sans-serif' },
  header: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#333', display: 'flex', alignItems: 'center' },
  main: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  card: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' },
  cardTitle: { fontSize: '1rem', fontWeight: '600', color: '#1a202c', marginBottom: '1rem' },
  searchBox: { display: 'flex', gap: '8px' },
  input: { flex: 1, padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.9rem' },
  searchButton: { padding: '10px 20px', border: 'none', backgroundColor: '#f1f1f1', borderRadius: '4px', cursor: 'pointer', color: '#333', fontWeight: '600' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.9rem' },
  th: { padding: '12px 8px', backgroundColor: '#fafafa', fontWeight: '600', color: '#333', borderBottom: '2px solid #e2e8f0' },
  tr: {},
  td: { padding: '16px 8px', color: '#4a5568', borderBottom: '1px solid #f3f3f3' },
  detailsButton: { padding: '6px 14px', fontSize: '0.8rem', color: '#368ce8ff', backgroundColor: 'white', border: '1px solid #368ce8ff', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' },
  deleteButton: { padding: '6px 14px', fontSize: '0.8rem', color: '#f44336', backgroundColor: 'white', border: '1px solid #f44336', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' },
};

function EquipmentReportDashboard() {
  const navigate = useNavigate();
  
  // --- ⬇️ 주요 수정 사항: localStorage에서 데이터 불러오기 ⬇️ ---
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      const savedReports = localStorage.getItem('reports');
      // 저장된 데이터가 있으면 파싱하고, 없으면 빈 배열로 시작합니다.
      setReports(savedReports ? JSON.parse(savedReports) : []);
    } catch (error) {
      console.error("localStorage에서 보고서를 불러오는 데 실패했습니다.", error);
      setReports([]); // 에러 발생 시 빈 배열 반환
    }
  }, []);
  // --- ⬆️ 주요 수정 사항 ⬆️ ---

  const handleNavigate = (reportItem) => {
    // 상세 페이지로 이동하며, 해당 보고서의 전체 데이터를 state로 전달
    navigate(`/equipment/report/${reportItem.id}`, { state: { reportItem } });
  };

  const handleDelete = (id) => {
    if (window.confirm(`정말로 ${id}번 보고서를 삭제하시겠습니까?`)) {
      const updatedReports = reports.filter(report => report.id !== id);
      setReports(updatedReports);
      // 변경된 목록을 localStorage에 저장합니다.
      localStorage.setItem('reports', JSON.stringify(updatedReports));
      alert("보고서가 성공적으로 삭제되었습니다.");
    }
  };

  const filteredReports = reports.filter((report) =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>장비분석 보고서</header>
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
                  <tr key={report.id}>
                    <td style={styles.td}>{report.id}</td>
                    <td style={styles.td}>{report.type}</td>
                    <td style={styles.td}>{report.name}</td>
                    <td style={styles.td}>{report.timestamp}</td>
                    <td style={styles.td}>{report.cost.toLocaleString()}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.detailsButton}
                        onClick={() => handleNavigate(report)}
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
                  <td colSpan="7" style={styles.td}>생성된 보고서가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default EquipmentReportDashboard;
