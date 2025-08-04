import React from 'react';

// 아이콘
const CheckIcon = () => <span style={{ marginRight: '8px', color: '#34D399' }}>✔️</span>;
const ChartIcon = () => <span style={{ marginRight: '8px', color: '#60A5FA' }}>📊</span>;

function ReportDetail() {
  const alternatives = [
    { name: 'TTR-550S', price: '3,100,000원', description: '동일 계열 최신 모델, 부품 호환 가능' },
    { name: 'TTR-ECO300', price: '2,450,000원', description: '전기식, 저소음, 유지비 절감 가능' },
    { name: 'GT TughMaster-2024', price: '3,400,000원', description: '기동성 우수, 신형 라인업 탑재' },
  ];

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        {/* 상단 제목 */}
        <header style={styles.header}>
          <h1 style={styles.title}>runway_light_1 장비 분석 보고서</h1>
        </header>

        {/* 보고서 메타 정보 */}
        <section style={styles.metaSection}>
          <p style={styles.metaText}>[장비명] runway_light_1</p>
          <p style={styles.metaText}>[처리 담당자] 관리자 전예나</p>
          <p style={styles.metaText}>[보고서 생성일] 2025-07-18 17:10</p>
        </section>

        {/* 장비 상태 분석 결과 */}
        <section>
          <h2 style={styles.sectionTitle}><CheckIcon />장비 상태 분석 결과</h2>
          <hr style={styles.divider} />
          <ul style={styles.list}>
            <li><strong>장비명:</strong> TTR-550 Tow Tractor</li>
            <li><strong>카테고리:</strong> 조명</li>
            <li><strong>구매일:</strong> 2024-09-20</li>
            <li><strong>평균 수명:</strong> 10년</li>
            <li><strong>월 평균 가동시간:</strong> 월 600시간</li>
          </ul>
        </section>
        
        <hr style={styles.sectionSpacer} />

        {/* 비용 예측 */}
        <section>
          <h2 style={styles.sectionTitle}><ChartIcon />추후 비용 예측</h2>
          <hr style={styles.divider} />
          <ul style={styles.list}>
            <li><strong>유지보수 비용:</strong> 490,000원<span style={styles.note}>비고: 브레이크 및 섀시 보강 기준</span></li>
            <li><strong>신규 매입 비용:</strong> 3,100,000원<span style={styles.note}>비고: 동급 장비 기준</span></li>
            {/* <li><strong>폐기 비용:</strong> 250,000원<span style={styles.note}>비고: 운반 및 인증 처리 포함</span></li> */}
          </ul>

          <p style={styles.paragraph}>
            AI 분석 결과, 해당 장비는 물리적 손상과 부품 노후가 복합적으로 감지되었으며, 노후도 점수는 이미 교체 권고 기준을 초과한 상태입니다.
            다만, 유지보수에 소요되는 비용은 전체 교체 비용의 약 16% 수준이며, 수리 이후 약 1년 이상의 추가 운용이 가능하다는 점에서 단기적으로는 정비 후 사용 지속이 보다 경제적인 선택으로 판단됩니다.
          </p>

          <table style={styles.table}>
            <tbody>
              {alternatives.map((item, index) => (
                <tr key={index}>
                  <td style={{ ...styles.td, ...styles.tdModel }}>{item.name}</td>
                  <td style={{ ...styles.td, ...styles.tdPrice }}>{item.price}</td>
                  <td style={{ ...styles.td, ...styles.tdDescription }}>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 하단 버튼 */}
        <footer style={styles.footer}>
          <button style={{ ...styles.button, ...styles.primaryButton }}>등록</button>
          <button style={{ ...styles.button, ...styles.secondaryButton }}>취소</button>
        </footer>
      </div>
    </div>
  );
}

// 스타일 객체
const styles = {
  background: {
    backgroundColor: '#f8f9fa',
    padding: '3rem 1rem',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: '"Pretendard", "Malgun Gothic", sans-serif',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '2rem 2.5rem',
    width: '100%',
    maxWidth: '850px',
  },
  header: {
    textAlign: 'center',
    borderBottom: '1px solid #e9ecef',
    paddingBottom: '1rem',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#343a40',
    margin: 0,
  },
  metaSection: {
    marginBottom: '2rem',
  },
  metaText: {
    fontSize: '0.85rem',
    color: '#868e96',
    margin: '0.4rem 0',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 0.75rem 0',
  },
  divider: {
    border: 0,
    borderTop: '1px solid #dee2e6',
    margin: '0 0 1rem 0',
  },
  sectionSpacer: {
    border: 0,
    borderTop: '1px solid #f1f3f5',
    margin: '2rem 0',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    fontSize: '0.9rem',
    lineHeight: 1.8,
    color: '#343a40', 
  },
  note: {
    color: '#868e96',
    marginLeft: '1rem',
    fontSize: '0.85rem',
  },
  paragraph: {
    margin: '1.5rem 0',
    fontSize: '0.9rem',
    lineHeight: 1.7,
    color: '#495057',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
    color: '#495057',
  },
  td: {
    padding: '0.75rem 0.5rem',
    borderTop: '1px solid #f1f3f5',
  },
  tdModel: {
    fontWeight: '500',
    width: '20%',
  },
  tdPrice: {
    textAlign: 'left',
    width: '15%',
  },
  tdDescription: {
    color: '#868e96',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '2.5rem',
  },
  button: {
    padding: '0.6rem 1.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  primaryButton: {
    backgroundColor: '#343a40',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: '#f1f3f5',
    color: '#495057',
  },
};

export default ReportDetail;