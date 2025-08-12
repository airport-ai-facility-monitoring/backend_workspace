import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** ✅ 환경에 맞게 백엔드 베이스 URL만 맞춰주세요 */
const API_BASE = "https://supreme-carnival-x7wr65q5gp43vgp9-8088.app.github.dev";

const KRW = (n) =>
  typeof n === "number" && isFinite(n)
    ? n.toLocaleString("ko-KR") + " KRW"
    : "-";

const catLabel = {
  lighting: "조명",
  weather: "기상관측",
  sign: "표지",
};

const previewPath = {
  lighting: "/equipmentReports/preview/lighting",
  weather: "/equipmentReports/preview/weather",
  sign: "/equipmentReports/preview/sign",
};

const registPath = {
  lighting: "/equipmentReports/regist/lighting",
  weather: "/equipmentReports/regist/weather",
  sign: "/equipmentReports/regist/sign",
};

/** 저장 후 상세 페이지 라우팅 경로 */
const detailRoute = (id) => `/equipment/report/${id}`;

export default function EquipmentReportPreview() {
  const navigate = useNavigate();
  const { state } = useLocation();
  /**
   * state로 전달된 값들:
   * - category: 'lighting' | 'weather' | 'sign'
   * - payload: CommonMaintenanceRequest + (카테고리별 필드) + maintenance_cost
   */
  const category = state?.category;
  const payload = state?.payload;

  const [loading, setLoading] = useState(false);
  const [llmText, setLlmText] = useState("");
  const [predCost, setPredCost] = useState(null);
  const [error, setError] = useState("");

  // 상단 정보 요약에 보여줄 key 매핑
  const headerFields = useMemo(() => {
    const common = [
      ["category", "장비 대분류", (v) => catLabel[category] || v || "-"],
      ["manufacturer", "제조사"],
      ["purchase", "구매 금액(원)", (v) => (v != null ? v.toLocaleString() + " 원" : "-")],
      ["protection_rating", "보호 등급"],
      ["failure", "고장 기록(회)"],
      ["runtime", "가동시간(월평균)"],
      ["service_years", "내용 연수(년)"],
      ["avg_life", "평균 수명(시간)"],
      ["repair_cost", "수리 비용(원)", (v) => (v != null ? v.toLocaleString() + " 원" : "-")],
      ["repair_time", "수리 시간(시간)"],
      ["labor_rate", "시간당 인건비(원)", (v) => (v != null ? v.toLocaleString() + " 원" : "-")],
      ["maintenance_cost", "예측 유지보수 비용(원)", (v) =>
        v != null ? v.toLocaleString() + " 원" : "-"],
    ];

    const lighting = [
      ["lamp_type", "램프 유형"],
      ["power_consumption", "소비 전력(W)"],
    ];
    const weather = [
      ["power_consumption", "소비 전력(W)"],
      ["mount_type", "설치 형태"],
    ];
    const sign = [
      ["panel_width", "패널 너비(mm)"],
      ["panel_height", "패널 높이(mm)"],
      ["material", "재질"],
      ["sign_color", "표지판 색상"],
      ["mount_type", "설치 형태"],
    ];

    const extra =
      category === "lighting" ? lighting : category === "weather" ? weather : sign;

    return [...common, ...extra];
  }, [category]);

  useEffect(() => {
    if (!category || !payload) {
      setError("미리보기 입력이 없습니다. 이전 화면에서 다시 시도해주세요.");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError("");
        const url = API_BASE + previewPath[category];
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
        const data = await res.json();
        setLlmText(data.llmReport || "");
        setPredCost(
          typeof data.maintenanceCost === "number" ? data.maintenanceCost : payload.maintenance_cost
        );
      } catch (e) {
        setError("미리보기 생성 실패: " + e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [category, payload]);

  const onSave = async () => {
    try {
        setLoading(true);
        setError("");

        const url = API_BASE + registPath[category];  // /equipmentReports/regist/{lighting|weather|sign}
        const body = {
        ...payload,          // 폼에서 모은 모든 입력(예측 비용 포함)
        llm_report: llmText  // ✅ 편집한 보고서 본문
        };

        const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);

        const saved = await res.json();
        const newId =
        saved.id ||
        saved.equipmentReportId ||
        saved.reportId ||
        saved.equipment_report_id;

        if (!newId) {
        alert("저장은 되었지만 ID를 찾지 못했습니다. 목록으로 이동합니다.");
        navigate("/equipment/report");
        return;
        }

        // ✅ 저장된 보고서 상세 페이지로 이동
        navigate(`/equipment/report/${newId}`);
    } catch (e) {
        setError("저장 실패: " + e.message);
    } finally {
        setLoading(false);
    }
    };

  const onReset = () => setLlmText("");
  const onCancel = () => navigate(-1);

  const renderRow = (label, value) => (
    <div
      key={label}
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: "8px",
        padding: "6px 0",
      }}
    >
      <div style={{ color: "#677", fontWeight: 600 }}>{label}</div>
      <div>{value ?? "-"}</div>
    </div>
  );

  const headerBox = (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eaecef",
        borderRadius: 10,
        padding: 16,
      }}
    >
      {headerFields.map(([key, label, fmt]) => {
        const raw = payload?.[key];
        const val = fmt ? fmt(raw) : raw ?? "-";
        return renderRow(label, val);
      })}
      {/* {renderRow("LLM 계산 유지보수 비용", KRW(predCost))} */}
      {renderRow("장비 대분류(라벨)", catLabel[category] || "-")}
    </div>
  );

  return (
    <div style={{ background: "#f5f7fc", minHeight: "100vh", padding: "28px 16px" }}>
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e6e8ef",
          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ padding: "22px 24px", borderBottom: "1px solid #eef1f6" }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>장비 유지보수 보고서 (미리보기)</div>
          <div style={{ color: "#7a89a6", marginTop: 6, fontSize: 13 }}>
            저장하기 전에 내용을 확인하고 수정할 수 있습니다.
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {/* 상단 요약 */}
          {headerBox}

          {/* LLM 본문 */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>LLM 보고서(수정 가능)</div>
            <textarea
              value={llmText}
              onChange={(e) => setLlmText(e.target.value)}
              placeholder="LLM이 생성한 보고서가 여기에 표시됩니다."
              style={{
                width: "100%",
                minHeight: 360,
                border: "1px solid #e0e6ef",
                borderRadius: 8,
                padding: 12,
                lineHeight: 1.6,
                fontSize: 14,
                resize: "vertical",
                background: "#fff",
              }}
            />
          </div>

          {/* 에러 */}
          {error && (
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                background: "#fff3f3",
                color: "#c0392b",
                border: "1px solid #f3c1c1",
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          {/* 버튼들 */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18 }}>
            <button
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: "10px 18px",
                border: "1px solid #d7dde8",
                background: "#fff",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              취소
            </button>
            <button
              onClick={onReset}
              disabled={loading}
              style={{
                padding: "10px 18px",
                border: "1px solid #d7dde8",
                background: "#fff",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              초기화
            </button>
            <button
              onClick={onSave}
              disabled={loading}
              style={{
                padding: "10px 18px",
                background: "#0ea5e9",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
                minWidth: 96,
              }}
            >
              {loading ? "불러오는중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
