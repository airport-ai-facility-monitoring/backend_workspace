import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReportViewer from "../ReportViewer"; // ✅ 경로 수정
import api from "../../config/api";

/** ✅ 환경에 맞게 백엔드 베이스 URL만 맞춰주세요 */
// const API_BASE = "https://supreme-carnival-x7wr65q5gp43vgp9-8088.app.github.dev";

const LABELS = { lighting: "조명", weather: "기상관측", sign: "표지" };

const PREVIEW_PATH = {
  lighting: "/equipmentReports/preview/lighting",
  weather: "/equipmentReports/preview/weather",
  sign: "/equipmentReports/preview/sign",
};

const REGIST_PATH = {
  lighting: "/equipmentReports/regist/lighting",
  weather: "/equipmentReports/regist/weather",
  sign: "/equipmentReports/regist/sign",
};

const fmtKRW = (n) =>
  typeof n === "number" && isFinite(n) ? `${Math.round(n).toLocaleString("ko-KR")} 원` : "-";
const fmtNum = (n, unit = "") =>
  n == null || Number.isNaN(Number(n)) ? "-" : `${Number(n).toLocaleString()}${unit}`;

const styles = {
  page: { background: "#f5f7fc", minHeight: "100vh", padding: 24 },
  shell: { maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 },
  header: {
    gridColumn: "1 / -1",
    background: "#fff",
    border: "1px solid #e6e8ef",
    borderRadius: 12,
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 },
  crumbs: { display: "flex", gap: 8, color: "#6b7280", fontSize: 13 },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#eef2ff",
    color: "#3730a3",
    border: "1px solid #e5e7eb",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
  },
  btnRow: { display: "flex", gap: 8, alignItems: "center" },
  btn: { padding: "10px 14px", borderRadius: 8, border: "1px solid #d7dde8", background: "#fff", cursor: "pointer", fontWeight: 700 },
  btnPrimary: { padding: "10px 14px", borderRadius: 8, border: "1px solid #0ea5e9", background: "#0ea5e9", color: "#fff", cursor: "pointer", fontWeight: 800 },
  card: { background: "#fff", border: "1px solid #e6e8ef", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" },
  leftCardBody: { padding: 18 },
  rightCardBody: { padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 800, marginBottom: 10, color: "#111827" },
  kv: { display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 8, columnGap: 12 },
  k: { color: "#6b7280", fontWeight: 600 },
  v: { color: "#111827" },
  hr: { border: 0, borderTop: "1px solid #edf0f6", margin: "16px 0" },
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
  editor: {
    width: "100%",
    minHeight: 420,
    border: "1px solid #e0e6ef",
    borderRadius: 10,
    padding: 14,
    lineHeight: 1.68,
    fontSize: 14,
    resize: "vertical",
    background: "#fff",
  },
  previewBox: {
    minHeight: 420,
    border: "1px solid #e0e6ef",
    borderRadius: 10,
    padding: 16,
    background: "#fff",
    lineHeight: 1.68,
    fontSize: 14,
  },
  "@print": `
    @media print {
      .no-print { display: none !important; }
      body { background: #fff !important; }
      .shell { grid-template-columns: 1fr !important; }
    }
  `,
};

const PrintStyle = () => {
  useEffect(() => {
    const el = document.createElement("style");
    el.innerHTML = styles["@print"];
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
};

export default function EquipmentReportPreview() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const category = state?.category;
  const payload = state?.payload;

  const [loading, setLoading] = useState(false);
  const [llmText, setLlmText] = useState("");
  const [predCost, setPredCost] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("preview"); // 'preview' | 'edit'

  const derived = useMemo(() => {
    const runtimeMonth = Number(payload?.runtime) || 0;
    const hoursYear = runtimeMonth * 12;
    const laborRate = Number(payload?.labor_rate) || 0;
    const repairTime = Number(payload?.repair_time) || 0;
    const lastRepairLaborCost = laborRate && repairTime ? laborRate * repairTime : null;
    const mtbf = Number(payload?.avg_life) || null;
    const failureYr = mtbf && hoursYear ? Math.max(0, +(hoursYear / mtbf).toFixed(2)) : null;
    return { hoursYear, lastRepairLaborCost, mtbf, failureYr };
  }, [payload]);

  const headerFields = useMemo(() => {
    const common = [
      ["name", "장비명"],
      ["manufacturer", "제조사"],
      ["protection_rating", "보호 등급"],
      ["service_years", "내용 연수(년)", (v) => fmtNum(v, "년")],
      ["purchase", "구매 금액", (v) => fmtKRW(v)],
      ["failure", "고장 기록(회)", (v) => fmtNum(v, "회")],
      ["runtime", "가동시간(월평균)", (v) => fmtNum(v, "시간")],
      ["avg_life", "평균 수명(시간)", (v) => fmtNum(v, "시간")],
    ];
    const lighting = [
      ["lamp_type", "램프 유형"],
      ["power_consumption", "소비 전력(W)", (v) => fmtNum(v, "W")],
    ];
    const weather = [
      ["power_consumption", "소비 전력(W)", (v) => fmtNum(v, "W")],
      ["mount_type", "설치 형태"],
    ];
    const sign = [
      ["panel_width", "패널 너비(mm)", (v) => fmtNum(v, "mm")],
      ["panel_height", "패널 높이(mm)", (v) => fmtNum(v, "mm")],
      ["material", "재질"],
      ["sign_color", "표지판 색상"],
      ["mount_type", "설치 형태"],
    ];
    const extra = category === "lighting" ? lighting : category === "weather" ? weather : sign;
    return [...common, ...extra];
  }, [category]);

  useEffect(() => {
    if (!category || !payload) {
      setError("미리보기 입력이 없습니다. 이전 화면에서 다시 시도하세요.");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError("");

        const url = PREVIEW_PATH[category]; // baseURL은 api 인스턴스에 이미 설정됨
        const res = await api.post(url, payload);

        const data = res.data;
        setLlmText(data.llmReport || "");

        const pc =
          typeof data.maintenanceCost === "number"
            ? data.maintenanceCost
            : payload.maintenance_cost;
        setPredCost(pc);
      } catch (e) {
        setError("미리보기 생성 실패: " + (e.response?.data || e.message));
      } finally {
        setLoading(false);
      }
    })();
  }, [category, payload]);

  const onSave = async () => {
    try {
      setLoading(true);
      setError("");

      const url = REGIST_PATH[category]; // baseURL은 api 인스턴스에 이미 있음
      const body = { ...payload, llm_report: llmText };

      const res = await api.post(url, body);
      const saved = res.data;

      const id =
        saved.id ||
        saved.equipmentReportId ||
        saved.reportId ||
        saved.equipment_report_id;

      if (!id) {
        alert("저장은 되었지만 ID를 찾지 못했습니다. 목록으로 이동합니다.");
        navigate("/equipment/report");
        return;
      }

      navigate(`/equipment/report/${id}`);
    } catch (e) {
      setError(
        "저장 실패: " + (e.response?.data?.message || e.message || "알 수 없는 오류")
      );
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => navigate(-1);
  const onReset = () => setLlmText("");

  const fallbackReport = useMemo(() => {
    const lines = [];
    lines.push(`■ 장비 개요`);
    lines.push(
      `- 분류: ${LABELS[category]} / 장비명: ${payload?.name ?? "-"} / 제조사: ${payload?.manufacturer ?? "-"}`
    );
    lines.push(
      `- 보호등급: ${payload?.protection_rating ?? "-"} / 내용연수: ${payload?.service_years ?? "-"}년`
    );
    lines.push("");
    lines.push(`■ 비용 요약`);
    lines.push(`- 예측 유지보수 비용(연간 추정): ${fmtKRW(predCost)}`);
    if (payload?.repair_cost) lines.push(`- 최근 수리 비용: ${fmtKRW(payload.repair_cost)}`);
    if (derived.lastRepairLaborCost != null)
      lines.push(`- 최근 수리 인건비(산정): ${fmtKRW(derived.lastRepairLaborCost)}`);
    lines.push("");
    lines.push(`■ 운영 지표`);
    lines.push(`- 월평균 가동시간: ${fmtNum(payload?.runtime, "시간")}`);
    lines.push(`- 연간 가동시간(추정): ${fmtNum(derived.hoursYear, "시간")}`);
    if (derived.mtbf) lines.push(`- MTBF(평균고장간격): ${fmtNum(derived.mtbf, "시간")}`);
    if (derived.failureYr != null) lines.push(`- 연간 예상 고장 횟수: ${fmtNum(derived.failureYr, "회")}`);
    lines.push("");
    lines.push(`■ 리스크 및 권고`);
    lines.push(
      `- 노후화/환경 요소(비·염분·온도)에 따라 유지보수 주기를 조정하세요. 고장 기록이 증가 시 예방점검 주기를 단축 권고.`
    );
    lines.push(`- 예비 부품(램프/모듈/패널) 최소 ${LABELS[category] === "표지" ? "2세트" : "3개"} 이상 확보 권고.`);
    lines.push("");
    lines.push(`■ 정비 계획(제안)`);
    lines.push(
      `- 정기점검: 월 1회(가동/절연/방수상태 점검), 반기 1회(전기 특성 진단), 연 1회(전면 청소·부품 교체 검토).`
    );
    lines.push(
      `- 인력/시간 가정: 고장 1회당 수리 ${fmtNum(payload?.repair_time, "시간")}, 시간당 인건비 ${fmtKRW(
        payload?.labor_rate
      )}.`
    );
    lines.push("");
    lines.push(`■ 산정 근거 데이터`);
    lines.push(
      `- 입력값: 고장기록 ${fmtNum(payload?.failure, "회")}, 평균수명 ${fmtNum(
        payload?.avg_life,
        "시간"
      )}, 최근 수리비 ${fmtKRW(payload?.repair_cost)}`
    );
    lines.push(`- 모델 산출값: 예측 유지보수 비용 ${fmtKRW(predCost)}`);
    return lines.join("\n");
  }, [category, payload, predCost, derived]);

  const previewText = llmText && llmText.trim().length > 0 ? llmText : fallbackReport;

  if (!category || !payload) {
    return <div style={{ padding: 24 }}>미리보기 입력이 없습니다. 이전 화면에서 다시 시도하세요.</div>;
  }

  return (
    <>
      <PrintStyle />
      <div style={styles.page}>
        <div style={styles.shell} className="shell">
          {/* Header */}
          <div style={styles.header} className="no-print">
            <div>
              <div style={styles.crumbs}>
                <span>설비 관리</span><span>›</span><span>유지보수 보고서</span><span>›</span><strong>미리보기</strong>
              </div>
              <h1 style={styles.title}>장비 유지보수 보고서</h1>
            </div>
            <div style={styles.btnRow}>
              <span style={styles.chip}>{LABELS[category]} · {payload?.name || "-"}</span>
              <button style={styles.btn} onClick={() => window.print()} title="인쇄/저장(PDF)">인쇄</button>
            </div>
          </div>

          {/* Left: body (tabs) */}
          <div style={styles.card}>
            <div style={styles.tabRow} className="no-print">
              <button type="button" style={styles.tab(tab === "preview")} onClick={() => setTab("preview")}>미리보기</button>
              <button type="button" style={styles.tab(tab === "edit")} onClick={() => setTab("edit")}>본문 편집</button>
            </div>

            <div style={styles.leftCardBody}>
              {tab === "edit" && (
                <>
                  <div style={{ marginBottom: 8, color: "#6b7280", fontSize: 13 }}>
                    보고서 본문은 저장 시 그대로 사용됩니다. 필요한 항목만 간결히 유지하세요.
                  </div>
                  <textarea
                    style={styles.editor}
                    value={llmText}
                    onChange={(e) => setLlmText(e.target.value)}
                    placeholder="LLM이 생성한 보고서를 편집하세요. (비어 있으면 기본 프레임으로 출력됩니다)"
                  />
                  <div className="no-print" style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 10 }}>
                    <button style={styles.btn} onClick={() => setLlmText(fallbackReport)}>기본 프레임으로 대체</button>
                    <button style={styles.btn} onClick={() => setLlmText("")}>비우기</button>
                  </div>
                </>
              )}

              {tab === "preview" && (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>
                      {LABELS[category]} | {payload?.name || "-"}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: 13 }}>
                      제조사: {payload?.manufacturer || "-"} · 보호등급: {payload?.protection_rating || "-"} · 내용연수: {fmtNum(payload?.service_years, "년")}
                    </div>
                  </div>

                  {/* ✅ HTML/Markdown 자동 처리 + 예쁜 스타일 */}
                  <div style={styles.previewBox}>
                    {/* ReportViewer 가 html 혹은 content 프로프를 쓰는 어떤 구현이든 대응 */}
                    <ReportViewer html={previewText} content={previewText} />
                  </div>
                </>
              )}
            </div>

            <div className="no-print" style={{ borderTop: "1px solid #edf0f6", padding: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button style={styles.btn} onClick={onCancel} disabled={loading}>취소</button>
              <button style={styles.btn} onClick={() => setTab("preview")}>미리보기</button>
              <button style={styles.btn} onClick={() => setTab("edit")}>편집</button>
              <button style={styles.btn} onClick={onReset} disabled={loading}>초기화</button>
              <button style={styles.btnPrimary} onClick={onSave} disabled={loading}>{loading ? "불러오는중..." : "저장"}</button>
            </div>
          </div>

          {/* Right: summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={styles.card}>
              <div style={styles.rightCardBody}>
                <div style={styles.sectionTitle}>예측 요약</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ border: "1px dashed #e5e7eb", borderRadius: 10, padding: 12, background: "#fafbfd" }}>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>예측 유지보수 비용</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#0d6efd" }}>
                      {fmtKRW(predCost ?? payload?.maintenance_cost)}
                    </div>
                  </div>
                  <div style={{ border: "1px dashed #e5e7eb", borderRadius: 10, padding: 12, background: "#fafbfd" }}>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>연간 가동시간(추정)</div>
                    <div style={{ fontSize: 20, fontWeight: 900 }}>{fmtNum(derived.hoursYear, "시간")}</div>
                  </div>
                </div>

                <div style={styles.hr} />

                <div style={styles.kv}>
                  <div style={styles.k}>최근 수리 비용</div><div style={styles.v}>{fmtKRW(payload?.repair_cost)}</div>
                  <div style={styles.k}>최근 수리 시간</div><div style={styles.v}>{fmtNum(payload?.repair_time, "시간")}</div>
                  <div style={styles.k}>시간당 인건비</div><div style={styles.v}>{fmtKRW(payload?.labor_rate)}</div>
                  <div style={styles.k}>MTBF(평균고장간격)</div><div style={styles.v}>{fmtNum(derived.mtbf, "시간")}</div>
                  <div style={styles.k}>연간 예상 고장 횟수</div><div style={styles.v}>{fmtNum(derived.failureYr, "회")}</div>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.rightCardBody}>
                <div style={styles.sectionTitle}>장비 요약</div>
                <div style={styles.kv}>
                  <div style={styles.k}>분류</div><div style={styles.v}>{LABELS[category]}</div>
                  {headerFields.map(([key, label, fmt]) => {
                    const raw = payload?.[key];
                    const val = fmt ? fmt(raw) : raw ?? "-";
                    return (
                      <React.Fragment key={key}>
                        <div style={styles.k}>{label}</div>
                        <div style={styles.v}>{val}</div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {error && (
              <div style={{ ...styles.card, border: "1px solid #fecaca", background: "#fff1f2" }}>
                <div style={{ padding: 12, color: "#7f1d1d", fontSize: 13 }}>{error}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}