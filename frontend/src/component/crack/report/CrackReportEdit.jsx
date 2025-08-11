import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/api";

export default function CrackReportEdit() {
  const navigate = useNavigate();
  const { rcId } = useParams();

  // RunwayCrack 필드들 (수정 불가)
  const [imageUrl, setImageUrl] = useState("");
  const [length, setLength] = useState("");
  const [area, setArea] = useState("");
  const [cctvId, setCctvId] = useState("");
  const [detectedDate, setDetectedDate] = useState("");
  const [writingDate, setWritingDate] = useState("");

  // RunwayCrackReport 필드들 (수정 가능)
  const [title, setTitle] = useState("");
  const [damageInfo, setDamageInfo] = useState("");
  const [repairMaterials, setRepairMaterials] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [estimatedPeriod, setEstimatedPeriod] = useState("");
  const [summary, setSummary] = useState("");

  // maskEmployeeId (읽기 전용)
  const [maskEmployeeId, setMaskEmployeeId] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/runwaycrackreports/${rcId}`);
        const data = res.data;
        console.log(rcId);

        // RunwayCrack 필드들 (읽기 전용)
        setImageUrl(data.imageUrl || "");
        setLength(data.length || "");
        setArea(data.area || "");
        setCctvId(data.cctvId || "");
        setDetectedDate(formatDateTimeLocal(data.detectedDate));
        setWritingDate(formatDateTimeLocal(data.writingDate));

        // RunwayCrackReport 필드들 (수정 가능)
        setTitle(data.title || "");
        setDamageInfo(data.damageInfo || "");
        setRepairMaterials(data.repairMaterials || "");
        setEstimatedCost(data.estimatedCost || "");
        setEstimatedPeriod(data.estimatedPeriod || "");
        setSummary(data.summary || "");

        // 읽기 전용 마스킹된 작성자 ID
        setMaskEmployeeId(data.maskEmployeeId || "");
      } catch (err) {
        console.error("보고서 불러오기 실패", err);
        alert("보고서 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (rcId) fetchReport();
  }, [rcId]);

  function formatDateTimeLocal(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  }

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      // PATCH 요청: RunwayCrackReport 필드만 보냄
      await api.patch(`/runwaycrackreports/${rcId}`, {
        title,
        damageInfo,
        repairMaterials,
        estimatedCost,
        estimatedPeriod,
        summary,
      });

      alert("보고서가 성공적으로 저장되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("저장 실패", err);
      alert("보고서 저장 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 보고서를 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/runwaycrackreports/${rcId}`);
      alert("보고서가 삭제되었습니다.");
      navigate("/crack/report/list");
    } catch (err) {
      console.error("삭제 실패", err);
      alert("보고서 삭제 중 오류가 발생했습니다.");
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
    sectionTitle: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#333",
      marginBottom: "1rem",
      marginTop: "1.5rem",
      paddingBottom: "0.5rem",
      borderBottom: "2px solid #e0e0e0",
    },
    fieldRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "1rem",
    },
    label: {
      width: "120px",
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
    inputDisabled: {
      flex: 1,
      padding: "0.5rem 1rem",
      border: "1px solid #e0e0e0",
      borderRadius: "6px",
      fontSize: "0.95rem",
      backgroundColor: "#f5f5f5",
      color: "#666",
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
    btnDelete: {
      background: "#d32f2f",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "0.75rem 1.5rem",
      cursor: "pointer",
      marginLeft: "auto",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.back} onClick={() => navigate(-1)}>
        ←
      </div>

      <form style={styles.form} onSubmit={handleSave}>
        {/* 파손 정보 섹션 (수정 불가) */}
        <div style={styles.sectionTitle}>파손 정보 (수정 불가)</div>

        {/* CCTV ID (수정불가) */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>CCTV ID</label>
          <input
            style={styles.inputDisabled}
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
            style={styles.inputDisabled}
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
            style={styles.inputDisabled}
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
            style={styles.inputDisabled}
            value={length}
            disabled
          />
        </div>

        {/* 파손 면적 (수정불가) */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>파손 면적 (㎠)</label>
          <input
            type="number"
            style={styles.inputDisabled}
            value={area}
            disabled
          />
        </div>

        {/* 작성일 (수정불가) */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>작성일</label>
          <input
            type="datetime-local"
            style={styles.inputDisabled}
            value={writingDate}
            disabled
          />
        </div>

        {/* 작성자 ID (읽기 전용, 마스킹 처리) */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>작성자 ID</label>
          <input
            type="text"
            style={styles.inputDisabled}
            value={maskEmployeeId}
            disabled
          />
        </div>

        {/* 보고서 정보 섹션 (수정 가능) */}
        <div style={styles.sectionTitle}>보고서 정보 (수정 가능)</div>

        {/* 제목 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>제목</label>
          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 손상 정보 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>손상 정보</label>
          <textarea
            style={styles.textarea}
            value={damageInfo}
            onChange={(e) => setDamageInfo(e.target.value)}
          />
        </div>

        {/* 수리 자료 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>수리 자료</label>
          <textarea
            style={styles.textarea}
            value={repairMaterials}
            onChange={(e) => setRepairMaterials(e.target.value)}
          />
        </div>

        {/* 예상 수리 비용 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>예상 수리 비용</label>
          <input
            type="text"
            style={styles.input}
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="예: 100만원"
          />
        </div>

        {/* 예상 수리 기간 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>예상 수리 기간</label>
          <input
            type="text"
            style={styles.input}
            value={estimatedPeriod}
            onChange={(e) => setEstimatedPeriod(e.target.value)}
            placeholder="예: 3일"
          />
        </div>

        {/* 종합 의견 */}
        <div style={styles.fieldRow}>
          <label style={styles.label}>종합 의견</label>
          <textarea
            style={styles.textarea}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        {/* 저장/취소/삭제 버튼 */}
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
          <button
            type="button"
            style={styles.btnDelete}
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      </form>
    </div>
  );
}