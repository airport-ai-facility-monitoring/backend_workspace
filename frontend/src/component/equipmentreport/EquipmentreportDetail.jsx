import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReportViewer from "../../component/ReportViewer";
import api from "../../config/api";

// ⚠️ 백엔드 주소
// const BASE = "https://supreme-carnival-x7wr65q5gp43vgp9-8088.app.github.dev";

const styles = {
  page: { background: "#f5f7fc", minHeight: "100vh", padding: 24 },
  shell: {
    maxWidth: 1120,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: 20,
  },
  header: { gridColumn: "1 / -1", marginBottom: 4 },
  h1: { margin: 0, fontSize: 26, fontWeight: 800, color: "#111827" },
  sub: { color: "#6b7280", marginTop: 6, fontSize: 14 },

  card: {
    background: "#fff",
    border: "1px solid #e6e8ef",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },
  body: { padding: 18 },

  sectionTitle: { fontSize: 16, fontWeight: 800, marginBottom: 12, color: "#111827" },
  kv: { display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 8, columnGap: 12 },
  k: { color: "#6b7280", fontWeight: 600 },
  v: { color: "#111827" },
  hr: { border: 0, borderTop: "1px solid #edf0f6", margin: "16px 0" },

  // 버튼
  btnRow: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 },
  btn: {
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    border: "1px solid #d7dde8",
    background: "#fff",
  },
  btnPrimary: { borderColor: "#0ea5e9", background: "#0ea5e9", color: "#fff" },
  btnDanger: { borderColor: "#ef4444", color: "#b91c1c", background: "#fff" },

  // 본문 탭/뷰
  tabRow: { padding: "10px 12px", borderBottom: "1px solid #edf0f6", display: "flex", gap: 8 },
  tab: (active) => ({
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    border: active ? "1px solid #0ea5e9" : "1px solid #e6e8ef",
    color: active ? "#0ea5e9" : "#374151",
    background: active ? "rgba(14,165,233,0.06)" : "#fff",
  }),
  viewerBox: {
    minHeight: 420,
    maxHeight: 640,
    overflow: "auto",
    border: "1px solid #e0e6ef",
    borderRadius: 10,
    padding: 16,
    background: "#fff",
    lineHeight: 1.68,
    fontSize: 14,
  },
  editor: {
    width: "100%",
    maxWidth: "100%",
    minHeight: 420,
    maxHeight: 640,
    overflow: "auto",
    border: "1px solid #e0e6ef",
    borderRadius: 10,
    padding: 14,
    lineHeight: 1.68,
    fontSize: 14,
    resize: "vertical",
    background: "#fff",
    boxSizing: "border-box",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },

  "@print": `
    @media print {
      .no-print { display: none !important; }
      body { background: #fff !important; }
      .shell { grid-template-columns: 1fr !important; }
    }
  `,
};

function fmtDate(d) {
  try {
    if (!d) return "";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return `${d}`;
    return `${dt.getFullYear()}. ${dt.getMonth() + 1}. ${dt.getDate()}.`;
  } catch {
    return "";
  }
}

const PrintStyle = () => {
  useEffect(() => {
    const el = document.createElement("style");
    el.innerHTML = styles["@print"];
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
};

export default function EquipmentReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // 'preview' | 'edit'
  const [mode, setMode] = useState("preview");
  const [opinion, setOpinion] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/equipmentReports/${id}`);
        const data = res.data;

        setReport(data);

        const llmText =
          data.llmReport ||
          data.report ||
          data.content ||
          data.llm_report ||
          "";

        setOpinion(llmText);
      } catch (e) {
        setErr(
          e.response?.data?.message || e.message || "보고서 조회 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const createdAt = useMemo(
    () => report?.createdAt || report?.created_at || report?.created || null,
    [report]
  );

  const equipmentName = report?.name || "-";
  const category = report?.category || "-";
  const subCategory = report?.subCategory || report?.sub_category || "-";
  const manufacturer = report?.manufacturer || "-";
  const rating = report?.protectionRating || report?.protection_rating || "-";
  const years = report?.serviceYears ?? report?.service_years ?? "-";

  const maintenanceCost =
    Number.isFinite(report?.maintenanceCostNum) ? report.maintenanceCostNum :
    report?.cost != null ? Number(report.cost) : null;
  const purchase =
    report?.newPurchaseCost != null ? Number(report.newPurchaseCost) :
    report?.purchase != null ? Number(report.purchase) : null;

  // 저장
  const handleSave = async () => {
    try {
      const res = await api.put(`/equipmentReports/${id}`, {
        llm_report: opinion,
      });
      const saved = res.data;
      setReport(saved);
      setMode("preview");
    } catch (e) {
      alert(
        e.response?.data?.message || e.message || "저장 중 오류가 발생했습니다."
      );
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!window.confirm(`정말 ${id}번 보고서를 삭제하시겠습니까?`)) return;
    try {
      await api.delete(`/equipmentReports/${id}`);
      alert("삭제되었습니다.");
      navigate("/equipment/report");
    } catch (e) {
      alert(
        e.response?.data?.message || e.message || "삭제 중 오류가 발생했습니다."
      );
    }
  };

  if (loading) return <div style={{ padding: 24 }}>로딩 중…</div>;
  if (err) return <div style={{ padding: 24, color: "red" }}>에러: {err}</div>;
  if (!report) return <div style={{ padding: 24 }}>데이터가 없습니다.</div>;

  return (
    <>
      <PrintStyle />
      <div style={styles.page}>
        <div style={styles.shell} className="shell">
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.h1}>{equipmentName} 장비 분석 보고서</h1>
            <div style={styles.sub}>보고서 작성일자: {fmtDate(createdAt) || "-"}</div>
          </div>

          {/* 좌측: 요약 */}
          <div style={styles.card}>
            <div style={styles.body}>
              <div style={styles.sectionTitle}>장비 요약</div>
              <div style={styles.kv}>
                <div style={styles.k}>장비명</div><div style={styles.v}>{equipmentName}</div>
                <div style={styles.k}>대분류</div><div style={styles.v}>{category}</div>
                <div style={styles.k}>소분류</div><div style={styles.v}>{subCategory}</div>
                <div style={styles.k}>제조사</div><div style={styles.v}>{manufacturer}</div>
                <div style={styles.k}>보호등급</div><div style={styles.v}>{rating}</div>
                <div style={styles.k}>내용연수</div><div style={styles.v}>{years}</div>
              </div>

              <div style={styles.hr} />

              <div style={styles.sectionTitle}>비용 요약</div>
              <div style={styles.kv}>
                <div style={styles.k}>유지보수 비용</div>
                <div style={styles.v}>
                  {Number.isFinite(maintenanceCost) ? `${Math.round(maintenanceCost).toLocaleString()} 원` : "-"}
                </div>
                <div style={styles.k}>신규 구매비용</div>
                <div style={styles.v}>
                  {Number.isFinite(purchase) ? `${Math.round(purchase).toLocaleString()} 원` : "-"}
                </div>
              </div>

              {/* 뒤로 / 인쇄 / 삭제 */}
              <div className="no-print" style={styles.btnRow}>
                <button style={styles.btn} onClick={() => navigate("/equipment/report")}>뒤로</button>
                <button style={styles.btn} onClick={() => window.print()}>인쇄</button>
                <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={handleDelete}>삭제</button>
              </div>
            </div>
          </div>

          {/* 우측: 본문 */}
          <div style={styles.card}>
            <div className="no-print" style={styles.tabRow}>
              <button type="button" style={styles.tab(mode === "preview")} onClick={() => setMode("preview")}>
                미리보기
              </button>
              <button type="button" style={styles.tab(mode === "edit")} onClick={() => setMode("edit")}>
                편집
              </button>
            </div>

            <div style={styles.body}>
              <div style={styles.sectionTitle}>보고서 본문</div>

              {mode === "preview" ? (
                <div style={styles.viewerBox}>
                  <ReportViewer html={opinion} content={opinion} />
                </div>
              ) : (
                <textarea
                  style={styles.editor}
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                />
              )}

              {/* 미리보기 모드에서는 숨김 */}
              {mode === "edit" && (
                <div className="no-print" style={styles.btnRow}>
                  <button style={styles.btn} onClick={() => setMode("preview")}>취소</button>
                  <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={handleSave}>
                    저장하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}