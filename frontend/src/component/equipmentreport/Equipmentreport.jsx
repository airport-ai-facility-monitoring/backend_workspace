import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

function EquipmentReport() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // 엔티티 → 뷰 매핑
  const mapEntityToView = (e) => ({
    id: e.id,
    type: e.category || '미지정',
    name: e.name || '장비',
    timestamp: e.createdAt || e.registeredAt || e.updatedAt || e.timestamp || null,
    cost:
      typeof e.maintenanceCostNum === 'number'
        ? e.maintenanceCostNum
        : e.cost != null
        ? Number(e.cost)
        : null,
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/equipmentReports');
      const mapped = Array.isArray(data) ? data.map(mapEntityToView) : [];
      // 최신순
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

  useEffect(() => { fetchReports(); }, []);

  const handleNavigate = (id) => navigate(`/equipment/report/${id}`);

  const filteredReports = useMemo(() => {
    const q = (searchTerm || '').toLowerCase();
    return reports.filter((r) => (r.name || '').toLowerCase().includes(q));
  }, [reports, searchTerm]);

  return (
    <div style={S.container}>
      {/* Header */}
      <header style={S.pageHeader}>
        <div style={S.pageTitleWrap}>
          <div style={S.titleRow}>
            <h1 style={S.title}>장비분석 보고서</h1>
            <span style={S.countBadge}>{reports.length}</span>
          </div>
          <p style={S.subtitle}>예측 결과 기반 장비 분석 리포트를 조회합니다.</p>
        </div>
        <div style={S.headerActions}>
          <button style={S.secondaryBtn} onClick={fetchReports}>
            <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
              <path fill="currentColor" d="M12 6V3L8 7l4 4V8a5 5 0 1 1-4.9 6H4.9A7 7 0 0 0 19 13c0-3.87-3.13-7-7-7z"/>
            </svg>
            새로고침
          </button>
        </div>
      </header>

      {/* Search */}
      <section style={S.card}>
        <div style={S.toolbar}>
          <div style={S.searchWrap}>
            <div style={S.searchIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="m21 20.3l-5.6-5.6a7 7 0 1 0-1.4 1.4L20.3 21zM5 11a6 6 0 1 1 12 0a6 6 0 0 1-12 0"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="장비명으로 검색"
              style={S.input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {error && <div style={S.error}>{error}</div>}
      </section>

      {/* Table */}
      <section style={S.card}>
        <div style={S.tableScroll}>
          <table style={S.table}>
            <thead style={S.thead}>
              <tr>
                <th style={S.th}>번호</th>
                <th style={S.th}>장비 종류</th>
                <th style={S.thLeft}>장비명</th>
                <th style={S.th}>보고서 등록 시간</th>
                <th style={S.th}>예측 유지보수 비용(원)</th>
                <th style={S.th}>보고서</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : filteredReports.length > 0 ? (
                filteredReports.map((r) => {
                  const { pretty, tooltip, badge } = formatDateTimePretty(r.timestamp);
                  return (
                    <tr key={r.id} style={S.tr}>
                      <td style={S.td}>{r.id}</td>
                      <td style={S.td}>
                        <span style={{ ...S.chip, ...chipColor(r.type) }}>{r.type}</span>
                      </td>
                      <td
                        style={{ ...S.tdLeft, ...S.clickable }}
                        onClick={() => handleNavigate(r.id)}
                        title="상세보기"
                      >
                        {r.name}
                      </td>
                      <td style={S.td}>
                        <div title={tooltip} style={{ lineHeight: 1.2 }}>
                          <div style={{ fontWeight: 600 }}>{pretty}</div>
                          {badge && <div style={S.timeBadge}>{badge}</div>}
                        </div>
                      </td>
                      <td style={S.td}>
                        {r.cost != null ? Number(r.cost).toLocaleString() : <span style={S.muted}>정보 없음</span>}
                      </td>
                      <td style={S.td}>
                        <button style={S.primaryGhostBtn} onClick={() => handleNavigate(r.id)}>상세보기</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={S.emptyWrap}>
                    <div style={S.emptyIcon}>
                      <svg width="28" height="28" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v12l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2"/>
                      </svg>
                    </div>
                    <div style={S.emptyTitle}>검색 결과가 없습니다</div>
                    <div style={S.emptyText}>검색어를 바꾸거나 새로고침해 보세요.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ----- KST 기준, 안전한 파트 파싱 버전 ----- */
function formatDateTimePretty(val) {
  if (!val) return { pretty: '-', tooltip: '', badge: '' };

  const d = new Date(val);
  if (isNaN(d)) return { pretty: String(val), tooltip: String(val), badge: '' };

  const tz = 'Asia/Seoul';
  const df = new Intl.DateTimeFormat('ko-KR', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hour12: false,
  });

  const parts = df.formatToParts(d);
  const get = (type) => parts.find((p) => p.type === type)?.value;

  const yyyy = get('year');
  const MM   = get('month');
  const dd   = get('day');
  const hh   = get('hour');
  const mm   = get('minute');
  // '금', '월' 같은 약식 요일이 들어옵니다.
  const weekday = (get('weekday') || '').replace('요일', '');

  const pretty  = `${yyyy}.${MM}.${dd} (${weekday}) ${hh}:${mm}`;
  const tooltip = d.toISOString().replace('T', ' ').replace('Z', ' UTC');
  const badge   = timeAgoKST(d);

  return { pretty, tooltip, badge };
}

function timeAgoKST(date) {
  // date를 한국 시간으로 변환 (표시용)
  const thenKST = date.getTime() + 9 * 60 * 60 * 1000;

  const diff = Date.now() - thenKST; // 현재는 그대로 사용
  if (diff < 0) return '';

  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr  = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (sec < 60) return '방금 전';
  if (min < 60) return `${min}분 전`;
  if (hr  < 24) return `${hr}시간 전`;
  if (day < 7)  return `${day}일 전`;
  return '';
}

/* ---------- Skeleton rows ---------- */
function SkeletonRows({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx}>
          {[...Array(6)].map((__, i) => (
            <td key={i} style={S.td}>
              <div style={S.skeleton} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* ---------- Chip Colors ---------- */
function chipColor(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('조명')) return { backgroundColor: '#e8f2ff', color: '#155fba', borderColor: '#cfe2ff' };
  if (t.includes('기상') || t.includes('weather')) return { backgroundColor: '#e8fff3', color: '#1a7f55', borderColor: '#c9f2e1' };
  if (t.includes('표지') || t.includes('sign')) return { backgroundColor: '#fff5e6', color: '#a15b00', borderColor: '#ffe3bf' };
  return { backgroundColor: '#f2f4f7', color: '#3a3f45', borderColor: '#e5e7eb' };
}

/* ---------- Styles ---------- */
const S = {
  container: {
    background: 'linear-gradient(180deg,#f7f8fb 0%, #f0f2f5 100%)',
    minHeight: '100vh',
    padding: '28px 28px 56px',
    fontFamily: '"Pretendard","Malgun Gothic",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    color: '#0f172a',
  },

  pageHeader: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 },
  pageTitleWrap: { display: 'flex', flexDirection: 'column' },
  titleRow: { display: 'flex', alignItems: 'center', gap: 10 },
  title: { margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' },
  countBadge: {
    fontSize: 12, fontWeight: 700, backgroundColor: '#eef2ff', color: '#3730a3',
    border: '1px solid #e0e7ff', borderRadius: 999, padding: '4px 10px',
  },
  subtitle: { margin: '4px 0 0', color: '#64748b', fontSize: 13 },
  headerActions: { display: 'flex', gap: 8 },

  secondaryBtn: {
    padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb',
    background: '#fff', color: '#0f172a', fontWeight: 700, fontSize: 13,
    display: 'inline-flex', alignItems: 'center', boxShadow: '0 1px 1px rgba(16,24,40,.04)', cursor: 'pointer',
  },
  primaryGhostBtn: {
    padding: '8px 14px', borderRadius: 10, border: '1px solid #3b82f6',
    background: 'transparent', color: '#1d4ed8', fontWeight: 700, fontSize: 12, cursor: 'pointer',
  },

  card: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 18,
    boxShadow: '0 10px 15px -3px rgba(16,24,40,0.08), 0 4px 6px -2px rgba(16,24,40,0.03)',
    marginTop: 14,
  },

  toolbar: { display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' },
  searchWrap: { position: 'relative', flex: 1, minWidth: 260, maxWidth: 560 },
  searchIcon: { position: 'absolute', top: 9, left: 12, color: '#94a3b8' },
  input: {
    width: '100%', padding: '10px 12px 10px 38px', border: '1px solid #e5e7eb',
    borderRadius: 12, fontSize: 14, outline: 'none', transition: 'box-shadow .15s, border-color .15s',
    boxShadow: '0 1px 2px rgba(16,24,40,.04)',
  },

  tableScroll: { width: '100%', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 14 },
  thead: { position: 'sticky', top: 0, background: '#fff', zIndex: 1 },
  th: { padding: '12px 14px', color: '#0f172a', fontWeight: 700, borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap', textAlign: 'center' },
  thLeft: { padding: '12px 14px', color: '#0f172a', fontWeight: 700, borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap', textAlign: 'left' },

  tr: { transition: 'background .12s ease' },
  td: { padding: '14px', color: '#334155', borderBottom: '1px solid #f1f5f9', textAlign: 'center' },
  tdLeft: { padding: '14px', color: '#0f172a', borderBottom: '1px solid #f1f5f9', textAlign: 'left', fontWeight: 600 },
  clickable: { cursor: 'pointer' },

  chip: { display: 'inline-block', padding: '6px 10px', borderRadius: 999, fontSize: 12, fontWeight: 800, border: '1px solid transparent' },

  timeBadge: {
    marginTop: 2, display: 'inline-block', padding: '2px 8px', borderRadius: 999,
    background: '#f1f5f9', color: '#64748b', fontSize: 11, fontWeight: 700,
  },

  emptyWrap: { padding: '36px 12px', textAlign: 'center', color: '#475569' },
  emptyIcon: { margin: '0 auto 8px', width: 44, height: 44, borderRadius: '50%', background: '#f1f5f9', display: 'grid', placeItems: 'center', color: '#64748b' },
  emptyTitle: { fontWeight: 800, fontSize: 15, marginBottom: 2 },
  emptyText: { fontSize: 13, color: '#64748b' },
  error: { color: '#dc2626', marginTop: 10, fontWeight: 600 },
  muted: { color: '#94a3b8' },

  skeleton: {
    height: 14, borderRadius: 6,
    background: 'linear-gradient(90deg,#f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)',
    backgroundSize: '200% 100%', animation: 'shimmer 1.3s infinite',
  },
};

/* keyframes 주입 */
(() => {
  if (typeof document === 'undefined') return;
  const id = 'dash-shimmer-kf';
  if (document.getElementById(id)) return;
  const tag = document.createElement('style');
  tag.id = id;
  tag.innerHTML = `
    @keyframes shimmer { 0% {background-position: 200% 0;} 100% {background-position: -200% 0;} }
    input:focus { border-color:#93c5fd !important; box-shadow:0 0 0 4px rgba(59,130,246,.15) !important; }
    tr:hover { background:#fafafa; }
  `;
  document.head.appendChild(tag);
})();

export default EquipmentReport;