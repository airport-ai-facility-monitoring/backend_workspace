import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import api from '../api/axios'; // <- 2)에서 만드는 axios 인스턴스
import api from '../../config/api';

function EquipmentReportDashboard() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // 백엔드 엔티티 -> 화면용 데이터 매핑
  // 필드명은 추정치이므로, 실제 엔티티 필드명에 맞게만 아래를 수정하면 됨.
  // const mapEntityToView = (e) => ({
  //   id: e.id ?? e.reportId ?? e.equipmentReportId,               // PK
  //   type: e.equipmentType ?? e.type ?? '미지정',                  // 장비 종류
  //   name: e.equipmentName ?? e.name ?? e.code ?? '이름 없음',      // 장비명
  //   timestamp: formatDateTime(e.createdAt ?? e.registeredAt ?? e.updatedAt ?? e.timestamp),
  //   cost: e.predictedCost ?? e.cost ?? e.estimatedCost ?? null,   // 예측 유지보수 비용
  // });
  const mapEntityToView = (e) => ({
    id: e.id,
    type: e.category || '미지정',
    name: e.name || '기상 장비1',
    timestamp: e.createdAt || '-', // 엔티티에 없으니 당장은 '-'
    cost: typeof e.maintenanceCostNum === 'number'
            ? e.maintenanceCostNum
            : (e.cost != null ? Number(e.cost) : null),
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/equipmentReports');
      const mapped = Array.isArray(data) ? data.map(mapEntityToView) : [];
      // 최신순 정렬 (timestamp가 파싱 가능하면 그걸로, 아니면 id desc)
      mapped.sort((a, b) => {
        const ta = Date.parse(a.timestamp) || 0;
        const tb = Date.parse(b.timestamp) || 0;
        if (tb !== ta) return tb - ta;
        return (b.id ?? 0) - (a.id ?? 0);
      });
      setReports(mapped);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('보고서 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleNavigate = (id) => {
    // 상세 페이지 라우팅 규칙에 맞게 경로 조정
    navigate(`/equipment/report/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`정말로 ${id}번 보고서를 삭제하시겠습니까?`)) return;
    try {
      await api.delete(`/equipmentReports/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
      alert('보고서가 성공적으로 삭제되었습니다.');
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const filteredReports = useMemo(() => {
    const q = (searchTerm || '').toLowerCase();
    return reports.filter((r) => (r.name || '').toLowerCase().includes(q));
  }, [reports, searchTerm]);

  if (loading) {
    return <div style={styles.container}><div style={styles.header}>장비분석 보고서</div><div style={styles.card}>불러오는 중...</div></div>;
  }

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
            <button style={styles.searchButton} onClick={fetchReports}>새로고침</button>
          </div>
          {error && <div style={{ color: '#e53e3e', marginTop: 8 }}>{error}</div>}
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
                    <td style={styles.td}>{report.timestamp || '-'}</td>
                    <td style={styles.td}>
                      {report.cost != null ? Number(report.cost).toLocaleString() : '비용 정보 없음'}
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

function pad(n) { return n.toString().padStart(2, '0'); }
function formatDateTime(val) {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d)) return typeof val === 'string' ? val : '';
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

// 스타일 (기존 유지)
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
