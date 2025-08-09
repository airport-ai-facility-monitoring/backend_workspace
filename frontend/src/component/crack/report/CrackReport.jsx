import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/api";

export default function CrackReport() {
  const navigate = useNavigate();
  const { rcId } = useParams();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/runwaycrackreports/${rcId}`);
        console.log(res)
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

  // 새 DTO 필드명에 맞게 구조분해 할당
  const {
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
  } = reportData;

  const styles = {
    container: {
      padding: "2rem",
      background: "#fff",
      fontFamily: "serif",
      color: "#222",
      maxWidth: "800px",
      margin: "0 auto",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "2rem",
      borderBottom: "2px solid #000",
      paddingBottom: "0.5rem",
    },
    section: {
      marginBottom: "1.5rem",
    },
    label: {
      fontWeight: "bold",
      display: "inline-block",
      width: "160px",
    },
    image: {
      width: "100%",
      maxWidth: "400px",
      display: "block",
      margin: "1rem auto",
      border: "1px solid #ccc",
    },
    hr: {
      borderTop: "1px dashed #aaa",
      margin: "1.5rem 0",
    },
    buttonRow: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "2rem",
    },
    button: {
      padding: "0.6rem 1.2rem",
      background: "#333",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>{title || "활주로 파손 조사 보고서"}</div>

      {/* 1. 조사 개요 */}
      <div style={styles.section}>
        <div>
          <span style={styles.label}>보고서 작성일자:</span>{" "}
          {writingDate ? new Date(writingDate).toLocaleDateString() : "미지정"}
        </div>
        <div>
          <span style={styles.label}>파손 감지일자:</span>{" "}
          {detectedDate ? new Date(detectedDate).toLocaleDateString() : "미지정"}
        </div>
        <div>
          <span style={styles.label}>CCTV ID:</span> {cctvId || "미지정"}
        </div>
        <div>
          <span style={styles.label}>조사 방식:</span> 자동 분석 시스템 기반
        </div>
      </div>

      <div style={styles.hr} />

      {/* 2. 파손 이미지 */}
      <div style={styles.section}>
        <div>
          <span style={styles.label}>파손 이미지:</span>
        </div>
        {imageUrl && <img src={imageUrl} alt="Crack" style={styles.image} />}
      </div>

      <div style={styles.hr} />

      {/* 3. 파손 상세 내역 */}
      <div style={styles.section}>
        <div>
          <span style={styles.label}>파손 길이:</span> {length || "미측정"} cm
        </div>
        <div>
          <span style={styles.label}>파손 면적:</span> {area || "미측정"} ㎠
        </div>
        <div>
          <span style={styles.label}>손상 정보:</span> {damageInfo || "분석 중"}
        </div>
      </div>

      <div style={styles.hr} />

      {/* 4. 수리 정보 */}
      <div style={styles.section}>
        <div>
          <span style={styles.label}>수리 자료:</span> {repairMaterials || "미정"}
        </div>
        <div>
          <span style={styles.label}>예상 수리 기간:</span> {estimatedPeriod || "미정"}
        </div>
        <div>
          <span style={styles.label}>예상 수리 비용:</span> {estimatedCost || "미정"}
        </div>
      </div>

      <div style={styles.hr} />

      {/* 5. 종합 의견 */}
      <div style={styles.section}>
        <div>
          <span style={styles.label}>종합 의견:</span>
        </div>
        <div style={{ whiteSpace: "pre-wrap", marginTop: "0.5rem" }}>
          {summary || "해당 사항 없음"}
        </div>
      </div>

      <div style={styles.buttonRow}>
        <button
          style={styles.button}
          onClick={() => navigate(`/report/edit/${rcId}`)}
        >
          편집하기
        </button>
      </div>
    </div>
  );
}