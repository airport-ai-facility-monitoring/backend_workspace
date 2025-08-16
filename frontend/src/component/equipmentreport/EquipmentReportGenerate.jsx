// src/pages/EquipmentReportGenerate.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from "../../config/api";

// 네 스프링 백엔드 주소
// const BASE = 'https://supreme-carnival-x7wr65q5gp43vgp9-8088.app.github.dev';

const styles = {
  page: { background: '#f3f6fe', minHeight: '100vh', padding: '40px 16px', fontFamily: 'sans-serif' },
  card: { maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: 24 },
  title: { fontSize: 22, fontWeight: 800, marginBottom: 8 },
  sub: { color: '#6c757d', marginBottom: 20 },
  hr: { border: 0, borderTop: '1px solid #eee', margin: '18px 0' },
  block: { background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 8, padding: 16, marginTop: 16 },
  row: { marginBottom: 10, display: 'flex', gap: 8, alignItems: 'baseline' },
  label: { color: '#6c757d', width: 140, fontWeight: 600 },
  val: { fontWeight: 700 },
  error: { color: '#b00020', marginTop: 12 },
  btns: { display: 'flex', gap: 10, marginTop: 16 },
  btn: { padding: '10px 16px', borderRadius: 6, border: '1px solid #ced4da', background: '#fff', cursor: 'pointer', fontWeight: 700 },
  btnPrimary: { padding: '10px 16px', borderRadius: 6, border: 0, background: '#198754', color: '#fff', cursor: 'pointer', fontWeight: 800 },
  reportBox: { marginTop: 16, whiteSpace: 'pre-wrap', lineHeight: 1.7 },
};

export default function EquipmentReportGenerate() {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 넘겨받은 값들
  const {
    equipmentId,
    mainCategory,            // "조명"/"기상관측"/"표지"
    manufacturer,
    purchase,
    protectionRating,
    serviceYears,
    formData,                // 입력 폼 값( snake_case )
    predictedMaintenanceCost // 예측값 (number)
  } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportText, setReportText] = useState(''); // LLM 보고서 본문
  const [createdId, setCreatedId] = useState(null); // 서버가 리턴한 보고서 ID

  const analyzeUrl = useMemo(() => {
    if (!equipmentId) return "";
    return `/equipmentReports/analyze/${equipmentId}`;
  }, [equipmentId]);

  // payload(LLM 프롬프트 DTO: snake_case) 만들기
  const buildPayload = () => {
    if (!formData) return null;
    return {
      category: mainCategory || '',
      manufacturer: manufacturer || '',
      purchase: purchase ?? 0,
      purchase_date: '', // 있으면 넣기
      failure: Number(formData.failure) || 0,
      protection_rating: protectionRating || '',
      runtime: Number(formData.runtime) || 0,
      service_years: serviceYears ?? 0,
      maintenance_cost: Math.round(Number(predictedMaintenanceCost || 0)),
      repair_cost: Number(formData.repair_cost) || 0,
      repair_time: Number(formData.repair_time) || 0,
      labor_rate: Number(formData.labor_rate) || 0,
      avg_life: Number(formData.avg_life) || 0,

      // 카테고리별 추가
      ...(mainCategory === '조명' ? {
        lamp_type: formData.lamp_type || '',
        power_consumption: Number(formData.power_consumption) || null,
      } : {}),

      ...(mainCategory === '기상관측' ? {
        power_consumption: Number(formData.power_consumption) || null,
        mount_type: formData.mount_type || '',
      } : {}),

      ...(mainCategory === '표지' ? {
        panel_width: Number(formData.panel_width) || null,
        panel_height: Number(formData.panel_height) || null,
        material: formData.material || '',
        sign_color: formData.sign_color || '',
        mount_type: formData.mount_type || '',
      } : {}),
    };
  };

  useEffect(() => {
    const run = async () => {
      try {
        if (!equipmentId) throw new Error("equipmentId가 없습니다.");
        if (!analyzeUrl) throw new Error("분석 URL을 만들 수 없습니다.");
        const payload = buildPayload();
        if (!payload) throw new Error("보고서 생성에 필요한 데이터가 없습니다.");

        // ✅ fetch → axios
        const res = await api.post(analyzeUrl, payload);
        const data = res.data;

        // 백엔드 응답 유연 처리
        const rid = data.eqReportId || data.reportId || data.id || null;
        const text =
          data.report ||
          data.reportHtml ||
          data.content ||
          data.llmReport ||
          "";

        if (rid && !text) {
          // 서버가 저장만 하고 본문은 상세 페이지에서 보여주는 경우 → 상세로 이동
          navigate(`/equipment/report/${rid}`, { replace: true });
          return;
        }

        if (rid) setCreatedId(rid);
        if (text) setReportText(text);
      } catch (e) {
        setError(
          e.response?.data?.message || e.message || "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPrint = () => window.print();
  const onBack = () => navigate(-1);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>장비 유지보수 보고서 생성</div>
        <div style={styles.sub}>장비 ID: {equipmentId ?? '-'}</div>
        <hr style={styles.hr} />

        <div style={styles.block}>
          <div style={styles.row}><div style={styles.label}>장비 대분류</div><div style={styles.val}>{mainCategory || '-'}</div></div>
          <div style={styles.row}><div style={styles.label}>예측 유지보수 비용</div><div style={styles.val}>
            {Number.isFinite(predictedMaintenanceCost) ? `${Math.round(predictedMaintenanceCost).toLocaleString()} KRW` : '-'}
          </div></div>
        </div>

        {loading && <div style={{ marginTop: 16 }}>보고서를 생성 중입니다...</div>}

        {error && <div style={styles.error}>에러: {error}</div>}

        {!loading && !error && (
          <>
            <div style={styles.block}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>LLM 보고서</div>
              <div style={styles.reportBox}>
                {reportText ? reportText : '서버가 보고서 본문을 반환하지 않았습니다.'}
              </div>
            </div>

            <div style={styles.btns}>
              <button style={styles.btn} onClick={onBack}>뒤로</button>
              <button style={styles.btn} onClick={onPrint}>인쇄</button>
              {createdId && (
                <button
                  style={styles.btnPrimary}
                  onClick={() => navigate(`/equipment/report/${createdId}`)}
                >
                  저장된 보고서로 이동
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
