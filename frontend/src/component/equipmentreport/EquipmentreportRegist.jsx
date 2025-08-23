import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./predict-form.css";
import api from "../../config/api";

/** ===== 상수/매핑 ===== */
const subCategoryMap = {
  조명: ["REL", "RCL", "TDZL", "REIL"],
  기상관측: ["Anemometer", "Windvane", "Visibilitysensor", "RVRsensor"],
  표지: ["RDRS", "TEL", "TS"],
};

const initialFormData = {
  조명: {
    failure: 1, repair_cost: 150000, repair_time: 25, labor_rate: 30000,
    runtime: 150, avg_life: 5000, lamp_type: "LED", power_consumption: 50,
  },
  기상관측: {
    failure: 1, repair_cost: 550000, repair_time: 40, labor_rate: 50000,
    runtime: 650, avg_life: 90000, power_consumption: 5, mount_type: "pole",
  },
  표지: {
    failure: 0, repair_cost: 300000, repair_time: 25, labor_rate: 35000,
    runtime: 690, avg_life: 100000, panel_width: 15, panel_height: 20,
    material: "Polycarbonate", sign_color: "Yellow", mount_type: "surface",
  },
};

const categoryNameMap = { lighting: "조명", weather: "기상관측", sign: "표지" };

const dropdownOptions = {
  lamp_type: ["LED", "Halogen", "Fluorescent"],
  mount_type: ["pole", "mast", "surface", "tripod"],
  material: ["Aluminum", "Stainless Steel", "Polycarbonate"],
  sign_color: ["White", "Yellow", "Black", "Red"],
};

// 예측 API에 맞춘 숫자 키 변환
const keyMap = {
  failure: "failure",
  runtime: "runtime",
  avg_life: "avgLife",
  repair_cost: "repairCost",
  repair_time: "repairTime",
  labor_rate: "laborRate",
  power_consumption: "powerConsumption",
  panel_width: "panelWidth",
  panel_height: "panelHeight",
  lamp_type: "lampType",             // ✅ Lighting 용
  mount_type: "mountType",           // ✅ Weather/Sign 용
  material: "material",              // ✅ Sign 용
  sign_color: "signColor",           // ✅ Sign 용
  installation_type: "installationType", // ✅ Sign 용
};

/** ===== 레이아웃 스타일(입력 박스는 CSS .box로 통일) ===== */
const styles = {
  page: { background: "#f5f6f8", minHeight: "100vh", padding: 24 },
  shell: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: 20,
  },
  header: {
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  h1: { margin: 0, fontSize: 22, fontWeight: 700, color: "#1f2937" },
  badgeRow: { display: "flex", gap: 8, alignItems: "center", marginTop: 6 },
  chip: {
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 16,
    background: "#eef2f7",
    color: "#374151",
    border: "1px solid #e5e7eb",
  },
  card: { background: "#fff", borderRadius: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: "1px solid #eef0f3" },
  cardBody: { padding: 20 },
  gridForm: { display: "grid", gridTemplateColumns: "200px 1fr", rowGap: 12, columnGap: 14 },
  label: { alignSelf: "center", color: "#6b7280", fontSize: 14, fontWeight: 600 },
  error: { color: "#dc2626", fontSize: 12, marginTop: 4, gridColumn: "2 / 3" },
  hr: { border: 0, borderTop: "1px solid #eef0f3", margin: "16px 0" },
  btnRow: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 },
  btn: { padding: "10px 16px", borderRadius: 8, border: "1px solid #111827", background: "#111827", color: "#fff", fontWeight: 700, cursor: "pointer" },
  btnGhost: { background: "#6b7280", borderColor: "#6b7280" },
  side: { position: "sticky", top: 20, height: "fit-content" },
  sideTitle: { fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 10 },
  sideKV: { display: "grid", gridTemplateColumns: "110px 1fr", rowGap: 8, columnGap: 10 },
  resultBig: { fontSize: 22, fontWeight: 800, color: "#0d6efd" },
  "@media (max-width: 960px)": {
    shell: { gridTemplateColumns: "1fr" },
    side: { position: "static" },
    gridForm: { gridTemplateColumns: "1fr" },
    label: { marginBottom: 4 },
  },
};

/** ===== 유틸 ===== */
const routeCatToKey = (routeCat) => {
  if (["lighting", "weather", "sign"].includes(routeCat)) return routeCat;
  if (routeCat === "조명") return "lighting";
  if (routeCat === "기상관측") return "weather";
  if (routeCat === "표지") return "sign";
  return "lighting";
};
const catKeyToLabel = (k) => ({ lighting: "조명", weather: "기상관측", sign: "표지" }[k] || "조명");
const numOrUndef = (v) => (v === "" || v == null ? undefined : Number(v));
const isPosInt = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

export default function EquipmentReportRegist() {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    equipmentId,
    equipmentName,
    manufacturer,
    purchase,
    protectionRating,
    serviceYears,
    purchaseDate,
  } = location.state || {};

  const catKey = useMemo(() => routeCatToKey(category), [category]);
  const mainCategory = categoryNameMap[catKey] || "조명";

  const [subCategory, setSubCategory] = useState("");
  const [formData, setFormData] = useState(null);
  const [fieldErr, setFieldErr] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // 초기 세팅
  useEffect(() => {
    const list = subCategoryMap[mainCategory];
    const base = initialFormData[mainCategory];
    if (list?.length && base) {
      setSubCategory(list[0]);
      setFormData(base);
    }
    setFieldErr({});
    setPrediction(null);
    setError(null);
  }, [mainCategory]);

  /** ===== 검증 ===== */
  const validate = (fd) => {
    const e = {};
    ["failure", "runtime", "avg_life", "repair_cost", "repair_time", "labor_rate"].forEach((k) => {
      if (fd?.[k] === "" || fd?.[k] == null) e[k] = "값을 입력하세요.";
      else if (!isPosInt(fd[k])) e[k] = "0 이상의 정수로 입력하세요.";
    });
    if (mainCategory === "조명" || mainCategory === "기상관측") {
      if (fd?.power_consumption === "" || fd?.power_consumption == null) e.power_consumption = "필수 입력입니다.";
      else if (!isPosInt(fd.power_consumption)) e.power_consumption = "0 이상의 정수";
    }
    if (mainCategory === "표지") {
      ["panel_width", "panel_height"].forEach((k) => {
        if (fd?.[k] === "" || fd?.[k] == null) e[k] = "필수 입력입니다.";
        else if (!isPosInt(fd[k])) e[k] = "0 이상의 정수";
      });
    }
    setFieldErr(e);
    return Object.keys(e).length === 0;
  };

  /** ===== 입력 바인딩 (박스 스타일은 CSS로) ===== */
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (fieldErr[name]) setFieldErr((prev) => ({ ...prev, [name]: undefined }));
  };
  const bind = (name) => ({
    name,
    value: formData?.[name] ?? "",
    onChange,
    className: "box",
  });

  /** ===== 예측 호출 ===== */
  // const BASE = "https://supreme-carnival-x7wr65q5gp43vgp9-8088.app.github.dev"; // TODO: 실제 백엔드 주소
  // const getPredictUrl = () => {
  //   if (!equipmentId) throw new Error("equipmentId가 없습니다. 상세 페이지에서 state로 넘겨주세요.");
  //   return `${BASE}/equip/predict/${equipmentId}`;
  // };
const buildOverrides = (form) => {
  const overrides = {};
  Object.entries(keyMap).forEach(([from, to]) => {
    const v = form?.[from];
    if (v !== "" && v != null) {
      // 숫자인 경우만 Number 처리
      overrides[to] = isNaN(Number(v)) ? v : Number(v);
    }
  });

  if (protectionRating) overrides["protectionRating"] = protectionRating;
  if (purchase) overrides["purchase"] = Number(purchase);
  if (serviceYears) overrides["serviceYears"] = Number(serviceYears);

  // category 구분해서 필수 키 보장
  if (catKey === "lighting") {
    overrides["lampType"] = form?.lamp_type || "";
  }
  if (catKey === "weather") {
    overrides["mountType"] = form?.mount_type || "";
  }
  if (catKey === "sign") {
    overrides["material"] = form?.material || "";
    overrides["signColor"] = form?.sign_color || "";
    overrides["installationType"] = form?.installation_type || form?.mount_type || "";
  }

  return overrides;
};

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;
    if (!validate(formData)) return;

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const res = await api.post(`/equip/predict/${equipmentId}`, {
        values: buildOverrides(formData),
      });

      // axios는 res.data에 응답 JSON이 들어 있음
      setPrediction(res.data);
    } catch (err) {
      console.error(err);

      // axios 에러 처리 (서버 응답, 네트워크, 그 외 케이스 분리)
      if (err.response) {
        setError(`API 실패 (${err.response.status}) ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        setError("서버 응답 없음. 네트워크 상태를 확인하세요.");
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /** ===== 보고서 생성 ===== */
  const predictedValue = useMemo(() => {
    if (typeof prediction === "number") return prediction;
    return (
      prediction?.predictedMaintenanceCost ??
      prediction?.maintenance_cost ??
      prediction?.cost ??
      undefined
    );
  }, [prediction]);

  const handleReportGenerate = () => {
    if (predictedValue == null || Number.isNaN(Number(predictedValue))) {
      window.alert("먼저 예측을 실행해 주세요.");
      return;
    }
    const payload = {
      equipment_id: equipmentId,
      name: equipmentName,
      category_key: catKey,
      category: catKeyToLabel(catKey),
      sub_category: subCategory,
      manufacturer: manufacturer ?? "",
      protection_rating: protectionRating ?? "",
      purchase: numOrUndef(purchase),
      purchase_date: purchaseDate || undefined,
      service_years: numOrUndef(serviceYears),
      failure: numOrUndef(formData?.failure),
      runtime: numOrUndef(formData?.runtime),
      avg_life: numOrUndef(formData?.avg_life),
      repair_cost: numOrUndef(formData?.repair_cost),
      repair_time: numOrUndef(formData?.repair_time),
      labor_rate: numOrUndef(formData?.labor_rate),
      ...(catKey === "lighting" && {
        lamp_type: formData?.lamp_type || "",
        power_consumption: numOrUndef(formData?.power_consumption),
      }),
      ...(catKey === "weather" && {
        power_consumption: numOrUndef(formData?.power_consumption),
        mount_type: formData?.mount_type || "",
      }),
      ...(catKey === "sign" && {
        panel_width: numOrUndef(formData?.panel_width),
        panel_height: numOrUndef(formData?.panel_height),
        material: formData?.material || "",
        sign_color: formData?.sign_color || "",
        mount_type: formData?.mount_type || "",
      }),
      maintenance_cost: Number(predictedValue),
      prediction_raw: prediction,
    };
    navigate("/equipment/report/preview", { state: { category: catKey, payload } });
  };

  const handleCancel = () => navigate("/equipment");

  if (!formData) return <div style={{ padding: 24 }}>로딩 중…</div>;

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        {/* 헤더 */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.h1}>장비 유지보수 AI 분석 요청</h1>
            <div style={styles.badgeRow}>
              <span style={styles.chip}>{catKeyToLabel(catKey)}</span>
              {subCategory && <span style={styles.chip}>{subCategory}</span>}
              {equipmentName && <span style={styles.chip}>장비: {equipmentName}</span>}
            </div>
          </div>
          <div />
        </div>

        {/* 좌: 폼 */}
        <div style={styles.card}>
          <form style={styles.cardBody} onSubmit={onSubmit}>
            <div style={styles.gridForm}>
              {/* 고정 */}
              <div style={styles.label}>장비 대분류</div>
              <select disabled value={mainCategory} className="box">
                <option value="조명">조명</option>
                <option value="기상관측">기상관측</option>
                <option value="표지">표지</option>
              </select>

              <div style={styles.label}>장비 소분류</div>
              <select
                name="subCategory"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="box"
              >
                {subCategoryMap[mainCategory].map((sc) => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>

              <div style={{ gridColumn: "1 / -1" }}><hr style={styles.hr} /></div>

              {/* 공통 입력 */}
              <div style={styles.label}>고장 기록(회)</div>
              <div>
                <input type="number" className="box no-spin" {...bind("failure")} />
                {fieldErr.failure && <div style={styles.error}>{fieldErr.failure}</div>}
              </div>

              <div style={styles.label}>가동시간(월평균)</div>
              <div>
                <input type="number" className="box no-spin" {...bind("runtime")} />
                {fieldErr.runtime && <div style={styles.error}>{fieldErr.runtime}</div>}
              </div>

              <div style={styles.label}>평균 수명(시간)</div>
              <div>
                <input type="number" className="box no-spin" {...bind("avg_life")} />
                {fieldErr.avg_life && <div style={styles.error}>{fieldErr.avg_life}</div>}
              </div>

              <div style={styles.label}>최근 수리 비용</div>
              <div>
                <input type="number" className="box no-spin" {...bind("repair_cost")} />
                {fieldErr.repair_cost && <div style={styles.error}>{fieldErr.repair_cost}</div>}
              </div>

              <div style={styles.label}>최근 수리 시간</div>
              <div>
                <input type="number" className="box no-spin" {...bind("repair_time")} />
                {fieldErr.repair_time && <div style={styles.error}>{fieldErr.repair_time}</div>}
              </div>

              <div style={styles.label}>시간당 인건비</div>
              <div>
                <input type="number" className="box no-spin" {...bind("labor_rate")} />
                {fieldErr.labor_rate && <div style={styles.error}>{fieldErr.labor_rate}</div>}
              </div>

              <div style={{ gridColumn: "1 / -1" }}><hr style={styles.hr} /></div>

              {/* 카테고리별 */}
              {mainCategory === "조명" && (
                <>
                  <div style={styles.label}>램프 유형</div>
                  <select className="box" {...bind("lamp_type")}>
                    {dropdownOptions.lamp_type.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                  <div style={styles.label}>소비 전력(W)</div>
                  <div>
                    <input type="number" className="box no-spin" {...bind("power_consumption")} />
                    {fieldErr.power_consumption && <div style={styles.error}>{fieldErr.power_consumption}</div>}
                  </div>
                </>
              )}

              {mainCategory === "기상관측" && (
                <>
                  <div style={styles.label}>소비 전력(W)</div>
                  <div>
                    <input type="number" className="box no-spin" {...bind("power_consumption")} />
                    {fieldErr.power_consumption && <div style={styles.error}>{fieldErr.power_consumption}</div>}
                  </div>

                  <div style={styles.label}>설치 형태</div>
                  <select className="box" {...bind("mount_type")}>
                    {dropdownOptions.mount_type.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </>
              )}

              {mainCategory === "표지" && (
                <>
                  <div style={styles.label}>판넬 너비(mm)</div>
                  <div>
                    <input type="number" className="box no-spin" {...bind("panel_width")} />
                    {fieldErr.panel_width && <div style={styles.error}>{fieldErr.panel_width}</div>}
                  </div>

                  <div style={styles.label}>판넬 높이(mm)</div>
                  <div>
                    <input type="number" className="box no-spin" {...bind("panel_height")} />
                    {fieldErr.panel_height && <div style={styles.error}>{fieldErr.panel_height}</div>}
                  </div>

                  <div style={styles.label}>재질</div>
                  <select className="box" {...bind("material")}>
                    {dropdownOptions.material.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                  <div style={styles.label}>표지판 색상</div>
                  <select className="box" {...bind("sign_color")}>
                    {dropdownOptions.sign_color.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                  <div style={styles.label}>설치 형태</div>
                  <select className="box" {...bind("mount_type")}>
                    {dropdownOptions.mount_type.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <div style={styles.btnRow}>
              <button type="button" style={{ ...styles.btn, ...styles.btnGhost }} onClick={handleCancel}>취소</button>
              <button type="submit" style={styles.btn} disabled={isLoading}>{isLoading ? "분석 중..." : "예측 시작"}</button>
            </div>
          </form>
        </div>

        {/* 우: 요약 & 결과 */}
        <div style={styles.side}>
          <div style={{ ...styles.card, marginBottom: 16 }}>
            <div style={styles.cardBody}>
              <div style={styles.sideTitle}>장비 요약</div>
              <div style={styles.sideKV}>
                <div>장비명</div><div>{equipmentName || "-"}</div>
                <div>제조사</div><div>{manufacturer || "-"}</div>
                <div>보호등급</div><div>{protectionRating || "-"}</div>
                <div>내용연수</div><div>{serviceYears ?? "-"}</div>
              </div>
            </div>
          </div>

          {error && (
            <div style={{ ...styles.card, border: "1px solid #fecaca", background: "#fff1f2", marginBottom: 16 }}>
              <div style={styles.cardBody}>
                <div style={{ ...styles.sideTitle, color: "#b91c1c" }}>에러</div>
                <div style={{ color: "#7f1d1d", fontSize: 13 }}>{error}</div>
              </div>
            </div>
          )}

          <div style={styles.card}>
            <div style={styles.cardBody}>
              <div style={styles.sideTitle}>예측 결과</div>
              <div style={{ marginTop: 6 }}>
                <div>예측 유지보수 비용</div>
                <div style={styles.resultBig}>
                  {(() => {
                    const v =
                      typeof prediction === "number"
                        ? prediction
                        : (prediction?.predictedMaintenanceCost ?? prediction?.maintenance_cost ?? prediction?.cost);
                    return Number.isFinite(v)
                      ? `${Math.round(v).toLocaleString()} ${prediction?.currency || "KRW"}`
                      : "-";
                  })()}
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                모델 버전: <strong>{prediction?.modelVersion || "-"}</strong>
              </div>
              <div style={styles.btnRow}>
                <button
                  type="button"
                  style={{ ...styles.btn, background: "#198754", borderColor: "#198754" }}
                  onClick={handleReportGenerate}
                >
                  📊 보고서 생성
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* // 우 패널 */}
      </div>
    </div>
  );
}