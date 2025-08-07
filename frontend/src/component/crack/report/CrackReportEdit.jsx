import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/api";

export default function CrackReportEdit() {
  const navigate = useNavigate();
  const { rcId } = useParams();

  // 초기 상태
  const [title, setTitle] = useState("");
  const [cctvId, setCctvId] = useState("");
  const [detectedDate, setDetectedDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [length, setLength] = useState("");
  const [area, setArea] = useState("");
  const [repairPeriod, setRepairPeriod] = useState("");
  const [repairCost, setRepairCost] = useState("");
  const [cause, setCause] = useState("");
  const [reportContents, setReportContents] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchReport = async () => {
      try {
        const res = await api.get(`/runwaycrackreports/${rcId}`);
        const data = res.data;
        console.log(rcId);
        setTitle(data.title || "");
        setCctvId(data.cctvId || "");
        setDetectedDate(data.detectedDate ? data.detectedDate.slice(0, 16) : "");
        setImageUrl(data.imageUrl || "");
        setLength(data.length || "");
        setArea(data.area || "");
        setRepairPeriod(data.repairPeriod || "");
        setRepairCost(data.repairCost || "");
        setCause(data.cause || "");
        setReportContents(data.reportContents || "");
      } catch (err) {
        console.error("보고서 불러오기 실패", err);
        alert("보고서 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (rcId) fetchReport();
  }, [rcId]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      // PATCH 요청: 수정 가능한 필드만 보냄
      await api.patch(`/runwaycrackreports/${rcId}`, {
        title,
        repairPeriod: Number(repairPeriod),
        repairCost: Number(repairCost),
        cause,
        reportContents,
      });

      alert("보고서가 성공적으로 저장되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("저장 실패", err);
      alert("보고서 저장 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;

  const styles = {
    container: {
      flex: 1,
      padding: "2rem",
      background: "#f0f4fb",
      boxSizing: "border-box",
      fontFamily: "sans-serif",
      color: "#1f263d",
    },
    back: {
      fontSize: "1.5rem",
      cursor: "pointer",
      marginBottom: "1rem",
    },
    form: {
      background: "white",
      borderRadius: "12px",
      maxWidth: "700px",
      margin: "0 auto",
      padding: "2rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    fieldRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "1rem",
    },
    label: {
      width: "100px",
      fontWeight: "500",
      fontSize: "0.95rem",
    },
    input: {
      flex: 1,
      padding: "0.5rem 1rem",
      border: "1px solid #dde4f8",
      borderRadius: "6px",
      fontSize: "0.95rem",
    },
    imagePreview: {
      width: "200px",
      height: "120px",
      objectFit: "cover",
      borderRadius: "6px",
      marginLeft: "1rem",
      border: "1px solid #dde4f8",
    },
    textarea: {
      flex: 1,
      height: "100px",
      padding: "0.75rem",
      border: "1px solid #dde4f8",
      borderRadius: "6px",
      fontSize: "0.95rem",
      resize: "vertical",
    },
    btnRow: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.75rem",
      marginTop: "1.5rem",
    },
    btn: {
      padding: "0.75rem 1.5rem",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.95rem",
      cursor: "pointer",
    },
    btnPrimary: {
      background: "#333",
      color: "#fff",
    },
    btnSecondary: {
      background: "#e0e0e0",
      color: "#666",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.back} onClick={() => navigate(-1)}>
        ←
      </div>

      <form style={styles.form} onSubmit={handleSave}>
        {/* 제목 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>제목</label>
          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* CCTV ID (수정불가) */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>CCTV ID</label>
          <input
            style={styles.input}
            type="number"
            value={cctvId}
            disabled
          />
        </div>

        {/* 발견 날짜 (수정불가) */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>발견 날짜</label>
          <input
            type="datetime-local"
            style={styles.input}
            value={detectedDate}
            disabled
          />
        </div>

        {/* 이미지 URL (수정불가) */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>사진</label>
          <input
            type="text"
            placeholder="이미지 URL"
            style={styles.input}
            value={imageUrl}
            disabled
          />
          {imageUrl && (
            <img src={imageUrl} alt="preview" style={styles.imagePreview} />
          )}
        </div>

        {/* 파손 길이 (수정불가) */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>파손 길이 (cm)</label>
          <input
            type="number"
            style={styles.input}
            value={length}
            disabled
          />
        </div>

        {/* 파손 면적 (수정불가) */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>파손 면적 (㎠)</label>
          <input
            type="number"
            style={styles.input}
            value={area}
            disabled
          />
        </div>

        {/* 예상 수리 기간 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>예상 수리 기간 (일)</label>
          <input
            type="number"
            style={styles.input}
            value={repairPeriod}
            onChange={(e) => setRepairPeriod(e.target.value)}
          />
        </div>

        {/* 예상 수리 비용 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>예상 수리 비용 (원)</label>
          <input
            type="number"
            style={styles.input}
            value={repairCost}
            onChange={(e) => setRepairCost(e.target.value)}
          />
        </div>

        {/* 원인 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>원인</label>
          <textarea
            style={styles.textarea}
            value={cause}
            onChange={(e) => setCause(e.target.value)}
          />
        </div>

        {/* 보고서 내용 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>보고서 내용</label>
          <textarea
            style={styles.textarea}
            value={reportContents}
            onChange={(e) => setReportContents(e.target.value)}
          />
        </div>

        {/* 저장/취소 */}
        <div style={styles.btnRow}>
          <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>
            저장
          </button>
          <button
            type="button"
            style={{ ...styles.btn, ...styles.btnSecondary }}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}