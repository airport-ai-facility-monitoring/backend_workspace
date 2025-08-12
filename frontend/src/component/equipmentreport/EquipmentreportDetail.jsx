import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ⚠️ 네 스프링 백엔드 주소
const BASE = "https://supreme-carnival-x7wr65q5gp43vgp9-8088.app.github.dev";

const styles = {
  appContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
    backgroundColor: "#f9f9f9",
    fontFamily: "'Malgun Gothic','맑은 고딕',sans-serif",
    color: "#333",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  reportContainer: {
    width: "100%",
    maxWidth: "800px",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    border: "1px solid #eee",
  },
  title: { textAlign: "center", fontSize: "26px", fontWeight: 600, margin: "0 0 10px" },
  date: { textAlign: "center", fontSize: "16px", color: "#666", marginBottom: "20px" },
  hr: { border: 0, height: "1px", backgroundColor: "#e0e0e0", margin: "30px 0" },
  infoGrid: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px 15px", fontSize: "16px" },
  dt: { fontWeight: "bold", color: "#555" },
  dd: { margin: 0, color: "#222" },
  h3: { fontSize: "18px", fontWeight: 600, margin: "0 0 15px" },
  opinionTextarea: {
    width: "100%", minHeight: "250px", padding: "12px", fontSize: "16px", lineHeight: 1.7,
    border: "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box", resize: "vertical",
    fontFamily: "'Malgun Gothic','맑은 고딕',sans-serif",
  },
  opinionTextareaReadOnly: { backgroundColor: "#f9f9f9", border: "1px solid #e0e0e0" },
  buttonContainer: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: "30px" },
  button: {
    color: "#fff", border: "none", padding: "12px 24px", fontSize: "16px", fontWeight: 500,
    cursor: "pointer", borderRadius: "5px", transition: "background-color .2s, box-shadow .2s",
    boxShadow: "0 2px 4px rgba(0,0,0,.1)",
  },
  editButton: { backgroundColor: "#333" },
  saveButton: { backgroundColor: "#007bff" },
  secondaryButton: { backgroundColor: "#6c757d" },
};

function isNum(v) { return typeof v === "number" && Number.isFinite(v); }
function fmtDate(d) {
  try {
    if (!d) return "";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return `${d}`;
    return `${dt.getFullYear()}. ${dt.getMonth()+1}. ${dt.getDate()}.`;
  } catch { return ""; }
}

const EquipmentReportDetail = () => {
  const { id } = useParams();           // /equipment/report/:id
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // 편집 모드 & 텍스트(LLM 본문)
  const [isEditing, setIsEditing] = useState(false);
  const [opinion, setOpinion] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${BASE}/equipmentReports/${id}`);
        if (!res.ok) {
          const t = await res.text();
          throw new Error(`보고서 조회 실패: ${res.status} ${t}`);
        }
        const data = await res.json();
        console.log("[Report detail]", data);
        setReport(data);

        // 서버의 필드명에 맞게 LLM 본문 키 선택
        const llmText = data.llmReport || data.report || data.content || data.llm_report || "";
        setOpinion(llmText);
      } catch (e) {
        setErr(e.message || String(e));
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  // 저장 클릭시(지금은 안내만; PUT API 생기면 여기서 호출)
  const handleSave = async () => {
    // TODO: PUT /equipmentReports/{id} 가 생기면 여기서 opinion(LLM 본문) 업데이트
    alert("저장 API가 아직 없어요. 백엔드에 PUT 엔드포인트 추가 후 연결해주세요.");
    setIsEditing(false);
  };

  if (loading) return <div style={{ padding: 24 }}>로딩 중...</div>;
  if (err) return <div style={{ padding: 24, color: "red" }}>에러: {err}</div>;
  if (!report) return <div style={{ padding: 24 }}>데이터가 없습니다.</div>;

  // ===== 엔티티 필드 매핑(필드명은 프로젝트에 맞게 조정) =====
  // const equipmentName   = report.equipmentName || report.title || "-";
  // const equipmentType   = report.equipmentType || report.type || "-";
  const equipmentName   = report.manufacturer || "-";      // 이름 없으니 제조사로 대체 표기
  const equipmentType   = report.category || "-";
  const category        = report.category || report.subCategory || "-";
  // const maintenanceCost = report.maintenanceCost ?? report.predictedMaintenanceCost ?? report.cost;
  const maintenanceCost = (
    Number.isFinite(report.maintenanceCostNum) ? report.maintenanceCostNum :
    (report.cost != null ? Number(report.cost) : null)
  );
  // const purchase        = report.newPurchaseCost ?? report.purchase ?? null;
  const purchase        = (
    report.newPurchaseCost != null ? Number(report.newPurchaseCost) :
    (report.purchase != null ? Number(report.purchase) : null)
  );
  // const createdAt       = report.createdAt || report.created_date || report.created || null;
  const createdAt       = null; // 현재 엔티티에 없음 → '-'로 표기
  return (
    <div style={styles.appContainer}>
      <div style={styles.reportContainer}>
        <h1 style={styles.title}>{equipmentName} 장비 분석 보고서</h1>
        <p style={styles.date}>보고서 작성일자: {fmtDate(createdAt) || "-"}</p>
        <hr style={styles.hr} />

        <dl style={styles.infoGrid}>
          <dt style={styles.dt}>장비명:</dt>
          <dd style={styles.dd}>{equipmentName}</dd>
          <dt style={styles.dt}>장비 종류:</dt>
          <dd style={styles.dd}>{equipmentType}</dd>
          <dt style={styles.dt}>카테고리:</dt>
          <dd style={styles.dd}>{category}</dd>
        </dl>

        <hr style={styles.hr} />

        <dl style={styles.infoGrid}>
          <dt style={styles.dt}>유지보수 비용예측:</dt>
          <dd style={styles.dd}>
            {isNum(maintenanceCost) ? `${Math.round(maintenanceCost).toLocaleString()} 원` : "-"}
          </dd>
          <dt style={styles.dt}>신규 장비 구매비용:</dt>
          <dd style={styles.dd}>
            {isNum(purchase) ? `${Math.round(purchase).toLocaleString()} 원` : "-"}
          </dd>
        </dl>

        <hr style={styles.hr} />

        <div>
          <h3 style={styles.h3}>종합의견:</h3>
          <textarea
            style={{ ...styles.opinionTextarea, ...(isEditing ? {} : styles.opinionTextareaReadOnly) }}
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            readOnly={!isEditing}
          />
        </div>

        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => navigate(-1)}
          >
            뒤로
          </button>
          <button
            style={{ ...styles.button, ...(isEditing ? styles.saveButton : styles.editButton) }}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? "저장하기" : "편집하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentReportDetail;
