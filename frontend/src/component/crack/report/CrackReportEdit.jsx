import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/api";

export default function CrackReportEdit() {
  const navigate = useNavigate();
  const { rcId } = useParams();

  // RunwayCrack (읽기 전용)
  const [imageUrl, setImageUrl] = useState("");
  const [length, setLength] = useState("");
  const [area, setArea] = useState("");
  const [cctvId, setCctvId] = useState("");
  const [detectedDate, setDetectedDate] = useState("");
  const [writingDate, setWritingDate] = useState("");

  // RunwayCrackReport (수정 가능)
  const [title, setTitle] = useState("");
  const [damageInfo, setDamageInfo] = useState("");
  const [repairMaterials, setRepairMaterials] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [estimatedPeriod, setEstimatedPeriod] = useState("");
  const [summary, setSummary] = useState("");

  // 읽기 전용 작성자
  const [maskEmployeeId, setMaskEmployeeId] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/runwaycrackreports/${rcId}`);
        const data = res.data;

        // 읽기 전용
        setImageUrl(data.imageUrl || "");
        setLength(data.length || "");
        setArea(data.area || "");
        setCctvId(data.cctvId || "");
        setDetectedDate(formatDateTimeLocal(data.detectedDate));
        setWritingDate(formatDateTimeLocal(data.writingDate));
        setMaskEmployeeId(data.maskEmployeeId || "");

        // 수정 가능
        setTitle(data.title || "");
        setDamageInfo(data.damageInfo || "");
        setRepairMaterials(data.repairMaterials || "");
        setEstimatedCost(data.estimatedCost || "");
        setEstimatedPeriod(data.estimatedPeriod || "");
        setSummary(data.summary || "");
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

  if (loading) return <div style={{ padding: 24 }}>로딩 중...</div>;

  // ===== 스타일 (상세 페이지와 톤 일치) =====
  const styles = {
    page: {
      background: "#f6f7fb",
      minHeight: "100vh",
      padding: "24px",
      boxSizing: "border-box",
    },
    sheet: {
      background: "#fff",
      maxWidth: "960px",
      margin: "0 auto",
      boxShadow: "0 2px 12px rgba(0,0,0,.08)",
      border: "1px solid #e5e7eb",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px 22px",
      borderBottom: "1px solid #e5e7eb",
      position: "sticky",
      top: 0,
      background: "#fff",
      zIndex: 10,
    },
    titleWrap: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
    titleH: { margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" },
    sub: { fontSize: 12, color: "#6b7280" },
    toolbar: { display: "flex", gap: 8 },
    btn: {
      padding: "10px 14px",
      borderRadius: 10,
      border: "1px solid #e5e7eb",
      background: "#fff",
      cursor: "pointer",
      fontSize: 14,
      minWidth: 90,
    },
    btnPrimary: { background: "#111827", color: "#fff", borderColor: "#111827" },
    btnDanger: { background: "#b91c1c", color: "#fff", borderColor: "#b91c1c" },

    body: { padding: "20px 24px" },

    sectionTitle: {
      margin: "14px 0 10px",
      fontSize: 16,
      fontWeight: 700,
      color: "#111827",
      borderTop: "1px solid #e5e7eb",
      paddingTop: 12,
    },

    metaGrid: {
      display: "grid",
      gridTemplateColumns: "180px 1fr 180px 1fr",
      rowGap: 10,
      columnGap: 16,
      wordBreak: "break-word",
      marginBottom: 6,
    },
    metaLabel: { fontSize: 13, color: "#6b7280" },
    metaValue: {
      fontSize: 14,
      color: "#111827",
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: "10px 12px",
    },

    kpiRow: {
      marginTop: 8,
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12,
    },
    kpi: {
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 14,
      background: "#fafafa",
    },
    kpiLabel: { fontSize: 12, color: "#6b7280" },
    kpiValue: { fontSize: 20, fontWeight: 800, marginTop: 6, color: "#111827" },

    imgWrap: { marginTop: 8, textAlign: "center" },
    img: {
      display: "inline-block",
      maxWidth: "100%",
      height: "auto",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
    },
    caption: { marginTop: 8, fontSize: 12, color: "#6b7280" },

    formGrid: {
      display: "grid",
      gridTemplateColumns: "180px 1fr",
      rowGap: 14,
      columnGap: 16,
      alignItems: "flex-start",
    },
    label: { fontSize: 13, color: "#6b7280", paddingTop: 10 },
    input: {
      width: "100%",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      outline: "none",
    },
    textarea: {
      width: "100%",
      minHeight: 110,
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: "12px 12px",
      fontSize: 14,
      resize: "vertical",
      lineHeight: 1.5,
    },

    btnRow: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 },
    help: { fontSize: 12, color: "#9ca3af", marginTop: 6 },
  };

  return (
    <div style={styles.page}>
      <div style={styles.sheet}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.titleWrap}>
            <h1 style={styles.titleH}>활주로 파손 보고서 편집</h1>
            <span style={styles.sub}>보고서 ID: {rcId}</span>
          </div>
          <div style={styles.toolbar}>
            <button className="no-print" style={styles.btn} onClick={() => navigate(-1)}>뒤로</button>
            <button className="no-print" style={{ ...styles.btn, ...styles.btnPrimary }} onClick={handleSave}>
              저장
            </button>
            {/* <button className="no-print" style={{ ...styles.btn, ...styles.btnDanger }} onClick={handleDelete}>
              삭제
            </button> */}
          </div>
        </div>

        {/* BODY */}
        <div style={styles.body}>
          {/* 읽기 전용 메타 */}
          <div style={styles.sectionTitle}>파손 정보 (읽기 전용)</div>
          <div style={styles.metaGrid}>
            <div style={styles.metaLabel}>CCTV ID</div>
            <div style={styles.metaValue}>{cctvId || "미지정"}</div>

            <div style={styles.metaLabel}>발견 일시</div>
            <div style={styles.metaValue}>{detectedDate || "-"}</div>

            <div style={styles.metaLabel}>작성 일시</div>
            <div style={styles.metaValue}>{writingDate || "-"}</div>

            <div style={styles.metaLabel}>작성자</div>
            <div style={styles.metaValue}>{maskEmployeeId || "-"}</div>
          </div>

          {/* KPI */}
          <div style={styles.kpiRow}>
            <div style={styles.kpi}>
              <div style={styles.kpiLabel}>파손 길이</div>
              <div style={styles.kpiValue}>{length !== "" ? `${length} cm` : "미측정"}</div>
            </div>
            <div style={styles.kpi}>
              <div style={styles.kpiLabel}>파손 면적</div>
              <div style={styles.kpiValue}>{area !== "" ? `${area} ㎠` : "미측정"}</div>
            </div>
            <div style={styles.kpi}>
              <div style={styles.kpiLabel}>이미지</div>
              <div style={styles.kpiValue}>{imageUrl ? "첨부됨" : "없음"}</div>
            </div>
          </div>

          {/* 이미지 미리보기 */}
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

          {/* 편집 가능한 필드 */}
          <div style={styles.sectionTitle}>보고서 정보 (수정 가능)</div>
          <form onSubmit={handleSave} style={{ marginTop: 8 }}>
            <div style={styles.formGrid}>
              <div style={styles.label}>제목</div>
              <input
                style={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 활주로 파손 조사 보고서 - 관찰"
              />

              <div style={styles.label}>손상 정보</div>
              <div>
                <textarea
                  style={styles.textarea}
                  value={damageInfo}
                  onChange={(e) => setDamageInfo(e.target.value)}
                  placeholder="길이/면적/구역/심각도 등 핵심 정보 요약"
                />
                <div style={styles.help}>예) 제1활주로 A구역에서 길이 15.2cm, 면적 2.6cm² 규모의 손상이 확인되었습니다. 심각도는 관찰입니다.</div>
              </div>

              <div style={styles.label}>수리 자료</div>
              <div>
                <textarea
                  style={styles.textarea}
                  value={repairMaterials}
                  onChange={(e) => setRepairMaterials(e.target.value)}
                  placeholder="사용되는 재료/공법 요약 (예: 에폭시, 줄눈 실링 등)"
                />
                <div style={styles.help}>입력 데이터에서 '사용' 항목만 기재하는 것을 권장합니다.</div>
              </div>

              <div style={styles.label}>예상 수리 비용</div>
              <input
                style={styles.input}
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="예: 예상 비용: 1,250,000원"
              />

              <div style={styles.label}>예상 수리 기간</div>
              <input
                style={styles.input}
                value={estimatedPeriod}
                onChange={(e) => setEstimatedPeriod(e.target.value)}
                placeholder="예: 예상 기간: 3일"
              />

              <div style={styles.label}>종합 의견</div>
              <div>
                <textarea
                  style={{ ...styles.textarea, minHeight: 160 }}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="안전영향/임시조치/영구조치/우선순위/재관측 기준 등을 문장으로 서술"
                />
                <div style={styles.help}>권장 분량: 6~10문장 (700~900자 내외)</div>
              </div>
            </div>

            <div style={styles.btnRow}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>저장</button>
              <button type="button" style={styles.btn} onClick={() => navigate(-1)}>취소</button>
              {/* <button type="button" style={{ ...styles.btn, ...styles.btnDanger }} onClick={handleDelete}>삭제</button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}