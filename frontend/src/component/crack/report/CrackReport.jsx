import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import api from "../../../config/api";

export default function Crackreport() {
  const navigate = useNavigate();
  const { rcId } = useParams();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>로딩 중...</div>;
  if (!reportData) return <div>데이터가 없습니다.</div>;

  // 엔티티 필드명에 맞게 구조분해 할당
  const {
    title,
    cause,
    reportContents,
    repairCost,
    repairPeriod,
  } = reportData;

  const styles = {
    container: { flex: 1, padding: "2rem", background: "#f0f4fb", boxSizing: "border-box", fontFamily: "sans-serif", color: "#1f263d" },
    back: { fontSize: "1.5rem", cursor: "pointer", marginBottom: "1rem" },
    card: { background: "white", borderRadius: "12px", maxWidth: "700px", margin: "0 auto", padding: "2rem", boxSizing: "border-box", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
    titleRow: { display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem" },
    title: { fontSize: "1.25rem", fontWeight: "bold", textDecoration: "underline" },
    infoRow: { marginBottom: "1rem", lineHeight: 1.5 },
    hr: { border: "none", borderBottom: "1px solid #dde4f8", margin: "1rem 0" },
    section: { marginBottom: "1.5rem" },
    sectionHeader: { display: "flex", alignItems: "center", fontWeight: "bold", marginBottom: "0.5rem" },
    sectionIcon: { color: "#4e73df", marginRight: "0.5rem" },
    sectionText: { fontSize: "0.95rem", lineHeight: 1.5, color: "#333", whiteSpace: "pre-wrap" },
    btnRow: { marginTop: "2rem", display: "flex", justifyContent: "flex-end" },
    btn: { padding: "0.75rem 1.5rem", background: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.back} onClick={() => navigate(-1)}>←</div>

      <div style={styles.card}>
        <div style={styles.titleRow}>
          <div style={styles.title}>{title || "활주로 크랙 보고서"}</div>
        </div>

        <div style={styles.infoRow}>
          {repairCost != null && <div>예상 수리 비용: {repairCost.toLocaleString()} 원</div>}
          {repairPeriod != null && <div>예상 수리 기간: {repairPeriod} 일</div>}
        </div>

        <div style={styles.hr} />

        {/* 보고서 내용 */}
        {reportContents && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <CheckBoxIcon style={styles.sectionIcon} />
              보고서 내용
            </div>
            <div style={styles.sectionText}>{reportContents}</div>
          </div>
        )}

        <div style={styles.hr} />

        {/* 원인 */}
        {cause && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <CheckBoxIcon style={styles.sectionIcon} />
              원인
            </div>
            <div style={styles.sectionText}>{cause}</div>
          </div>
        )}

        <div style={styles.btnRow} onClick={() => navigate(`/anomalyreport/edit/${rcId}`)}>
          <button style={styles.btn}>편집하기</button>
        </div>
      </div>
    </div>
  );
}