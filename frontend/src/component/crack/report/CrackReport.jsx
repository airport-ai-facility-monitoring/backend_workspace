import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/api";

export default function CrackReport() {
  const navigate = useNavigate();
  const { rcId } = useParams();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 로그인 정보
  const loggedEmployeeId = localStorage.getItem("employeeId");
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/runwaycrackreports/${rcId}`);
        setReportData(res.data);
      } catch (err) {
        console.error("보고서 데이터 로딩 실패", err);
        alert("보고서 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    if (rcId) fetchReport();
  }, [rcId]);

  // ====== 여기부터 훅/유틸은 항상 호출되도록 ======
  const fmtDate = (d) => {
    if (!d) return "미지정";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "미지정";
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
      dt.getDate()
    ).padStart(2, "0")} ${String(dt.getHours()).padStart(2, "0")}:${String(
      dt.getMinutes()
    ).padStart(2, "0")}`;
  };

  const fmtCost = (v) => {
    if (v === null || v === undefined || v === "" || v === "미정") return "미정";
    const num = Number(v);
    if (Number.isNaN(num)) return String(v);
    return `${num.toLocaleString("ko-KR")} 원`;
  };

  // reportData가 없어도 안전하게 접근
  const L = Number(reportData?.length) || 0;
  const A = Number(reportData?.area) || 0;

  const derivedSeverity = useMemo(() => {
    const level = reportData?.severityLevel;
    if (level) return level;
    if (L >= 50 || A >= 300) return "긴급";
    if (L >= 20 || A >= 120) return "경고";
    if (L > 0 || A > 0) return "관찰";
    return "미분류";
  }, [reportData?.severityLevel, L, A]);

  const severityColor = {
    긴급: "#b91c1c",
    경고: "#ea580c",
    관찰: "#2563eb",
    미분류: "#6b7280",
    일반: "#2563eb",
  }[derivedSeverity] || "#6b7280";

  // null-safe 구조분해 (항상 실행)
  const {
    reportId,
    imageUrl,
    length,
    area,
    cctvId,
    detectedDate,
    title,
    damageInfo,
    repairMaterials,
    estimatedCost,
    estimatedPeriod,
    summary,
    writingDate,
    employeeId,
    maskEmployeeId,
    runwayZone,
  } = reportData || {};

  const canEdit =
    loggedEmployeeId && employeeId && loggedEmployeeId.toString() === employeeId.toString();
  const canDelete = canEdit || isAdmin;

  const handleBack = () => navigate(-1);
  const handlePrint = () => window.print();
  const handleEdit = () => navigate(`/crack/report/edit/${rcId}`);
  const handleDelete = async () => {
    if (!canDelete) return;
    const ok = window.confirm("보고서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    if (!ok) return;
    try {
      await api.delete(`/runwaycrackreports/${rcId}`);
      alert("삭제되었습니다.");
      navigate(-1);
    } catch (e) {
      console.error(e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // ====== 스타일/인쇄 스타일 동일 (생략 없이 유지) ======
  const styles = {
    page: { background: "#f6f7fb", minHeight: "100vh", padding: "24px", boxSizing: "border-box" },
    sheet: { background: "#fff", maxWidth: "900px", margin: "0 auto", boxShadow: "0 2px 12px rgba(0,0,0,.08)", border: "1px solid #e5e7eb" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, background: "#fff", zIndex: 10 },
    titleWrap: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
    title: { margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" },
    badge: { fontSize: 12, padding: "4px 10px", borderRadius: 9999, color: "#fff", background: severityColor },
    toolbar: { display: "flex", gap: 8 },
    btn: { padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 14, minWidth: 90 },
    btnPrimary: { background: "#111827", color: "#fff", borderColor: "#111827" },
    btnDanger: { background: "#b91c1c", color: "#fff", borderColor: "#b91c1c" },
    body: { padding: "20px 24px" },
    metaGrid: { display: "grid", gridTemplateColumns: "180px 1fr 180px 1fr", rowGap: 10, columnGap: 16, wordBreak: "break-word" },
    metaLabel: { fontSize: 13, color: "#6b7280" },
    metaValue: { fontSize: 14, color: "#111827" },
    sectionTitle: { margin: "20px 0 10px", fontSize: 16, fontWeight: 700, color: "#111827", borderTop: "1px solid #e5e7eb", paddingTop: 14 },
    kpiRow: { marginTop: 8, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
    kpi: { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fafafa" },
    kpiLabel: { fontSize: 12, color: "#6b7280" },
    kpiValue: { fontSize: 20, fontWeight: 800, marginTop: 6, color: "#111827" },
    imgWrap: { marginTop: 8, textAlign: "center" },
    img: { display: "inline-block", maxWidth: "100%", height: "auto", border: "1px solid #e5e7eb", borderRadius: 8 },
    caption: { marginTop: 8, fontSize: 12, color: "#6b7280" },
    textBlock: { whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.6, fontSize: 14, color: "#111827" },
    footerNote: { marginTop: 24, fontSize: 12, color: "#6b7280", borderTop: "1px dashed #e5e7eb", paddingTop: 10 },
  };

  const printStyles = `
  @media print {
    body { background: #fff !important; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
    .sheet { box-shadow: none !important; border: none !important; }
    .page-break { break-before: page; }
    @page { size: A4; margin: 16mm; }
  }`;

  // ====== 렌더링 ======
  if (loading) {
    return <div style={{ padding: 24 }}>로딩 중...</div>;
  }
  if (!reportData) {
    return <div style={{ padding: 24 }}>데이터가 없습니다.</div>;
  }

  return (
    <div style={styles.page}>
      <style>{printStyles}</style>
      <div className="sheet" style={styles.sheet}>
        {/* HEADER */}
        <div style={styles.header} className="no-print">
          <div style={styles.titleWrap}>
            <h1 style={styles.title}>{title || "활주로 파손 조사 보고서"}</h1>
            <span style={styles.badge} aria-label={`심각도: ${derivedSeverity}`}>{derivedSeverity}</span>
          </div>
          <div style={styles.toolbar}>
            <button style={styles.btn} onClick={handleBack} aria-label="뒤로">뒤로</button>
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={handlePrint} aria-label="인쇄">인쇄</button>
            {canEdit && <button style={styles.btn} onClick={handleEdit} aria-label="편집">편집</button>}
            {canDelete && <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={handleDelete} aria-label="삭제">삭제</button>}
          </div>
        </div>

        {/* BODY */}
        <div style={styles.body}>
          <div style={styles.metaGrid}>
            <div style={styles.metaLabel}>보고서 ID</div><div style={styles.metaValue}>{reportId || rcId}</div>
            <div style={styles.metaLabel}>작성 일시</div><div style={styles.metaValue}>{fmtDate(writingDate)}</div>
            <div style={styles.metaLabel}>감지 일시</div><div style={styles.metaValue}>{fmtDate(detectedDate)}</div>
            <div style={styles.metaLabel}>CCTV ID</div><div style={styles.metaValue}>{cctvId || "미지정"}</div>
            <div style={styles.metaLabel}>활주로/구역</div><div style={styles.metaValue}>{runwayZone || "미지정"}</div>
            <div style={styles.metaLabel}>작성자</div><div style={styles.metaValue}>{maskEmployeeId || "-"}</div>
          </div>

          <div style={styles.sectionTitle}>핵심 지표</div>
          <div style={styles.kpiRow}>
            <div style={styles.kpi}><div style={styles.kpiLabel}>파손 길이</div><div style={styles.kpiValue}>{length != null ? `${length} cm` : "미측정"}</div></div>
            <div style={styles.kpi}><div style={styles.kpiLabel}>파손 면적</div><div style={styles.kpiValue}>{area != null ? `${area} ㎠` : "미측정"}</div></div>
            <div style={styles.kpi}><div style={styles.kpiLabel}>심각도</div><div style={styles.kpiValue}>{derivedSeverity}</div></div>
          </div>

          <div style={styles.sectionTitle}>현장 이미지</div>
          <div style={styles.imgWrap}>
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="활주로 파손 이미지" style={styles.img} />
                <div style={styles.caption}>자동 분석 시스템 캡처 이미지</div>
              </>
            ) : (
              <div style={{ fontSize: 14, color: "#6b7280" }}>이미지 없음</div>
            )}
          </div>

          <div className="page-break" style={styles.sectionTitle}>손상 상세</div>
          <div style={styles.textBlock}>{damageInfo || "분석 중"}</div>

          <div style={styles.sectionTitle}>조치 계획</div>
          <div style={styles.metaGrid}>
            <div style={styles.metaLabel}>수리 자재</div><div style={styles.metaValue}>{repairMaterials || "미정"}</div>
            <div style={styles.metaLabel}>예상 기간</div><div style={styles.metaValue}>{estimatedPeriod || "미정"}</div>
            <div style={styles.metaLabel}>예상 비용</div><div style={styles.metaValue}>{fmtCost(estimatedCost)}</div>
          </div>

          <div style={styles.sectionTitle}>종합 의견</div>
          <div style={styles.textBlock}>{summary || "해당 사항 없음"}</div>

          <div className="page-break" style={styles.sectionTitle}>결재</div>
          <div style={{ ...styles.metaGrid, gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div><div style={styles.metaLabel}>작성</div><div style={{ height: 64, border: "1px dashed #d1d5db", borderRadius: 8 }} /></div>
            <div><div style={styles.metaLabel}>검토</div><div style={{ height: 64, border: "1px dashed #d1d5db", borderRadius: 8 }} /></div>
            <div><div style={styles.metaLabel}>승인</div><div style={{ height: 64, border: "1px dashed #d1d5db", borderRadius: 8 }} /></div>
          </div>

          <div style={styles.footerNote}>※ 본 문서는 공항 시설관리팀 내부 문서입니다. 무단 배포를 금합니다.</div>
        </div>
      </div>
    </div>
  );
}