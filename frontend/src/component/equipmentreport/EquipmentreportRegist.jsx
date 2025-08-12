import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// ===== 상단 설정(기존 유지) =====
const subCategoryMap = {
  '조명': ['REL', 'RCL', 'TDZL', 'REIL'],
  '기상관측': ['Anemometer', 'Windvane', 'Visibilitysensor', 'RVRsensor'],
  '표지': ['RDRS', 'TEL', 'TS'],
};

const initialFormData = {
  '조명': {
    failure: 1, repair_cost: 150000, repair_time: 25, labor_rate: 30000,
    runtime: 150, avg_life: 5000, lamp_type: 'LED', power_consumption: 50
  },
  '기상관측': {
    failure: 1, repair_cost: 550000, repair_time: 40, labor_rate: 50000,
    runtime: 650, avg_life: 90000, power_consumption: 5, mount_type: 'pole'
  },
  '표지': {
    failure: 0, repair_cost: 300000, repair_time: 25, labor_rate: 35000,
    runtime: 690, avg_life: 100000, panel_width: 15, panel_height: 20,
    material: 'Polycarbonate', sign_color: 'Yellow', mount_type: 'surface'
  },
};

const categoryNameMap = { lighting: '조명', weather: '기상관측', sign: '표지' };

const styles = {
  container: { backgroundColor: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '50px', fontFamily: 'sans-serif' },
  form: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '600px' },
  title: { textAlign: 'center', color: '#333', marginBottom: '30px', fontWeight: 'bold', borderBottom: '2px solid #ddd', paddingBottom: '10px' },
  formRow: { marginBottom: '15px', display: 'flex', alignItems: 'center' },
  label: { width: '180px', color: '#555', fontWeight: 'bold', fontSize: '14px' },
  input: { flex: 1, padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f8f9fa', fontSize: '14px', color: '#333' },
  select: { flex: 1, padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f8f9fa', fontSize: '14px', color: '#333' },
  buttonContainer: { marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  button: { padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  submitButton: { backgroundColor: '#343a40', color: 'white' },
  cancelButton: { backgroundColor: '#6c757d', color: 'white' },
  resultContainer: { marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' },
  resultTitle: { color: '#333', fontWeight: 'bold', marginBottom: '15px' },
  resultText: { color: '#555', marginBottom: '10px', lineHeight: '1.6' },
  hr: { border: 0, borderTop: '1px solid #eee', margin: '25px 0' },
  card: { marginTop: '20px', padding: '16px', border: '1px solid #e3f2fd', backgroundColor: '#f8f9ff', borderRadius: '8px' },
  cardRow: { marginBottom: '10px' },
  cardLabel: { color: '#666', fontSize: '13px' },
  cardValue: { fontWeight: 'bold', fontSize: '18px', color: '#0d6efd' },
  center: { textAlign: 'center' },
};

const dropdownOptions = {
  lamp_type: ['LED', 'Halogen', 'Fluorescent'],
  mount_type: ['pole', 'mast', 'surface', 'tripod'],
  material: ['Aluminum', 'Stainless Steel', 'Polycarbonate'],
  sign_color: ['White', 'Yellow', 'Black', 'Red'],
};

// camelCase로 변환해서 예측에 보낼 매핑
const keyMap = {
  failure: 'failure',
  runtime: 'runtime',
  avg_life: 'avgLife',
  repair_cost: 'repairCost',
  repair_time: 'repairTime',
  labor_rate: 'laborRate',
  power_consumption: 'powerConsumption',
  panel_width: 'panelWidth',
  panel_height: 'panelHeight',
  // lamp_type, mount_type, material, sign_color는 예측에는 미전송(라벨→코드 변환 필요)
};

const EquipmentReportRegist = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 목록/상세에서 받은 값
  const {
    equipmentId,   // ✅ 필수
    equipmentName,
    manufacturer,
    purchase,
    protectionRating,
    serviceYears,
  } = location.state || {};

  const mainCategory = categoryNameMap[category] || '조명';

  const [subCategory, setSubCategory] = useState(null);
  const [formData, setFormData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 예측 결과(/equipments/{id}/predict)
  const [prediction, setPrediction] = useState(null);

  // ===== 초기 폼 세팅 =====
  useEffect(() => {
    const subCategoryList = subCategoryMap[mainCategory];
    const initialData = initialFormData[mainCategory];
    if (subCategoryList && initialData) {
      setSubCategory(subCategoryList[0]);
      setFormData(initialData);
    }
    setPrediction(null);
    setError(null);
  }, [mainCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (!formData) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // === 예측 호출 ===
  const BASE = 'https://supreme-carnival-x7wr65q5gp43vgp9-8088.app.github.dev'; // ⚠️ 너의 스프링 백엔드 주소로
  const getPredictUrl = () => {
    if (!equipmentId) throw new Error('equipmentId가 없습니다. 장비 상세에서 equipmentId를 넘겨주세요.');
    return `${BASE}/equipments/${equipmentId}/predict`;
  };

  const buildOverrides = (form) => {
    const overrides = {};
    Object.entries(keyMap).forEach(([from, to]) => {
      const v = form?.[from];
      if (v !== '' && v !== null && v !== undefined && !Number.isNaN(Number(v))) {
        overrides[to] = Number(v);
      }
    });
    return overrides;
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const url = getPredictUrl();
      const overrides = buildOverrides(formData);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: overrides }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API 요청 실패: ${res.status} ${txt}`);
      }
      const data = await res.json();
      setPrediction(data); // { predictedMaintenanceCost, currency, ... }
    } catch (err) {
      setError(err.message);
      console.error('예측 호출 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

// 카테고리 라우트파라미터 -> 프리뷰용 카테고리 키
const routeCatToKey = (routeCat) => {
  // 예: /equipment/report/regist/:category  에서 category === 'lighting'|'weather'|'sign'
  // 혹은 네 라우팅이 'lighting|weather|sign'이 아니라면 여기에 매핑 추가
  if (['lighting','weather','sign'].includes(routeCat)) return routeCat;
  // 혹시 '조명','기상관측','표지'로 오는 경우 대비
  if (routeCat === '조명') return 'lighting';
  if (routeCat === '기상관측') return 'weather';
  if (routeCat === '표지') return 'sign';
  return 'lighting';
};

// 프리뷰 페이로드 안의 표시용 라벨
const catKeyToLabel = (k) => ({ lighting:'조명', weather:'기상관측', sign:'표지' }[k] || '조명');

const num = (v) => (v === '' || v == null ? undefined : Number(v));

  // === 보고서 생성(LLM) ===
  const getAnalyzeUrl = () => {
    if (!equipmentId) throw new Error('equipmentId 없음');
    return `${BASE}/equipmentReports/analyze/${equipmentId}`;
  };

const handleReportGenerate = () => {
    if (!prediction) { setError('먼저 예측을 실행하세요.'); return; }

    // 1) 현재 페이지 컨텍스트에서 값 수집
    // - location.state 에서 받은 기본 정보들 (네 컴포넌트에 있는 변수명에 맞춰 조정)
    const {
      manufacturer,
      purchase,
      protectionRating,
      serviceYears,
      purchaseDate, // 있으면 사용
    } = (location?.state || {});

    // - 폼에서 입력한 값들(formData)
    //   (네 컴포넌트에 이미 formData: { failure, runtime, avg_life, repair_cost, ... }가 있음)
    const {
      failure,
      runtime,
      avg_life,
      repair_cost,
      repair_time,
      labor_rate,
      power_consumption,
      lamp_type,
      panel_width,
      panel_height,
      material,
      sign_color,
      mount_type,
    } = (formData || {});

    // 2) 카테고리 판단
    const catKey = routeCatToKey(category);          // 'lighting' | 'weather' | 'sign'
    const catLabel = catKeyToLabel(catKey);          // '조명'|'기상관측'|'표지'

    // 3) 예측값 뽑기 (객체/숫자 둘 다 대응)
    const predicted =
      typeof prediction === 'number'
        ? prediction
        : (prediction?.predictedMaintenanceCost ??
          prediction?.maintenance_cost ??
          prediction?.cost);

    // 4) 공통(스네이크) 페이로드 구성
    const payload = {
      category: catLabel,                                   // 표시용 한글 라벨
      manufacturer: manufacturer ?? '',                     // 문자열
      purchase: num(purchase),                              // 숫자
      purchase_date: purchaseDate || undefined,             // 선택
      failure: num(failure),
      protection_rating: protectionRating ?? '',
      runtime: num(runtime),
      service_years: num(serviceYears),
      maintenance_cost: num(predicted),                     // ✅ 예측값
      repair_cost: num(repair_cost),
      repair_time: num(repair_time),
      labor_rate: num(labor_rate),
      avg_life: num(avg_life),
    };

    // 5) 카테고리별 추가 필드
    if (catKey === 'lighting') {
      payload.lamp_type = lamp_type || '';
      payload.power_consumption = num(power_consumption);
    } else if (catKey === 'weather') {
      payload.power_consumption = num(power_consumption);
      payload.mount_type = mount_type || '';
    } else if (catKey === 'sign') {
      payload.panel_width = num(panel_width);
      payload.panel_height = num(panel_height);
      payload.material = material || '';
      payload.sign_color = sign_color || '';
      payload.mount_type = mount_type || '';
    }

    // 6) 프리뷰 페이지로 이동 (미리보기 → 저장 확인)
    navigate('/equipment/report/preview', {
      state: { category: catKey, payload },
    });
  };

  const handleCancel = () => { navigate('/equipment/'); };

  if (!formData || !subCategory) {
    return <div style={{ padding: 24 }}>카테고리 정보를 불러오는 중...</div>;
  }

  // ===== 렌더 =====
  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handlePredict}>
        <h2 style={styles.title}>장비 유지보수 AI 분석 요청</h2>

        {/* 고정 정보 */}
        <div style={styles.formRow}>
          <label style={styles.label}>장비 대분류</label>
          <select style={styles.select} value={mainCategory} disabled>
            <option value="조명">조명</option>
            <option value="기상관측">기상관측</option>
            <option value="표지">표지</option>
          </select>
        </div>

        <div style={styles.formRow}>
          <label style={styles.label}>장비 소분류</label>
          <select style={styles.select} value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
            {subCategoryMap[mainCategory].map(sc => (<option key={sc} value={sc}>{sc}</option>))}
          </select>
        </div>

        <hr style={styles.hr} />

        {/* 공통 입력 */}
        <>
          <div style={styles.formRow}><label style={styles.label}>고장 기록(회)</label><input style={styles.input} type="number" name="failure" value={formData.failure} onChange={handleInputChange} /></div>
          <div style={styles.formRow}><label style={styles.label}>가동시간(월평균)</label><input style={styles.input} type="number" name="runtime" value={formData.runtime} onChange={handleInputChange} /></div>
          <div style={styles.formRow}><label style={styles.label}>평균 수명(시간)</label><input style={styles.input} type="number" name="avg_life" value={formData.avg_life} onChange={handleInputChange} /></div>
          <div style={styles.formRow}><label style={styles.label}>수리 비용</label><input style={styles.input} type="number" name="repair_cost" value={formData.repair_cost} onChange={handleInputChange} /></div>
          <div style={styles.formRow}><label style={styles.label}>수리 시간</label><input style={styles.input} type="number" name="repair_time" value={formData.repair_time} onChange={handleInputChange} /></div>
          <div style={styles.formRow}><label style={styles.label}>시간당 인건비</label><input style={styles.input} type="number" name="labor_rate" value={formData.labor_rate} onChange={handleInputChange} /></div>
        </>

        <hr style={styles.hr} />

        {/* 카테고리별 입력 */}
        {mainCategory === '조명' && (
          <>
            <div style={styles.formRow}>
              <label style={styles.label}>램프 유형</label>
              <select style={styles.select} name="lamp_type" value={formData.lamp_type || ''} onChange={handleInputChange}>
                {dropdownOptions.lamp_type.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>
            <div style={styles.formRow}><label style={styles.label}>소비 전력(W)</label><input style={styles.input} type="number" name="power_consumption" value={formData.power_consumption || ''} onChange={handleInputChange} /></div>
          </>
        )}

        {mainCategory === '기상관측' && (
          <>
            <div style={styles.formRow}><label style={styles.label}>소비 전력(W)</label><input style={styles.input} type="number" name="power_consumption" value={formData.power_consumption || ''} onChange={handleInputChange} /></div>
            <div style={styles.formRow}>
              <label style={styles.label}>설치 형태</label>
              <select style={styles.select} name="mount_type" value={formData.mount_type || ''} onChange={handleInputChange}>
                {dropdownOptions.mount_type.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>
          </>
        )}

        {mainCategory === '표지' && (
          <>
            <div style={styles.formRow}><label style={styles.label}>판넬 너비(mm)</label><input style={styles.input} type="number" name="panel_width" value={formData.panel_width || ''} onChange={handleInputChange} /></div>
            <div style={styles.formRow}><label style={styles.label}>판넬 높이(mm)</label><input style={styles.input} type="number" name="panel_height" value={formData.panel_height || ''} onChange={handleInputChange} /></div>
            <div style={styles.formRow}>
              <label style={styles.label}>재질</label>
              <select style={styles.select} name="material" value={formData.material || ''} onChange={handleInputChange}>
                {dropdownOptions.material.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>표지판 색상</label>
              <select style={styles.select} name="sign_color" value={formData.sign_color || ''} onChange={handleInputChange}>
                {dropdownOptions.sign_color.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>설치 형태</label>
              <select style={styles.select} name="mount_type" value={formData.mount_type || ''} onChange={handleInputChange}>
                {dropdownOptions.mount_type.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>
          </>
        )}

        {/* 버튼 영역: 예측 시작 / 취소 */}
        <div style={styles.buttonContainer}>
          <button type="submit" style={{ ...styles.button, ...styles.submitButton }} disabled={isLoading}>
            {isLoading ? '분석 중...' : '예측 시작'}
          </button>
          <button type="button" style={{ ...styles.button, ...styles.cancelButton }} onClick={handleCancel}>취소</button>
        </div>
      </form>

      {/* 에러 */}
      {error && (
        <div style={{ ...styles.resultContainer, borderColor: 'red', maxWidth: 600 }}>
          <h3 style={{ ...styles.resultTitle, color: 'red' }}>에러 발생</h3>
          <p style={styles.resultText}>{error}</p>
        </div>
      )}

      {/* 예측 결과 카드 + 보고서 생성 버튼 */}
      {prediction && (
        <div style={{ ...styles.resultContainer, maxWidth: 600 }}>
          <h3 style={styles.resultTitle}>예측 결과</h3>
          <div style={styles.card}>
            <div style={styles.cardRow}>
              <div style={styles.cardLabel}>예측 유지보수 비용</div>
              <div style={styles.cardValue}>
                {Number.isFinite(prediction?.predictedMaintenanceCost)
                  ? `${Math.round(prediction.predictedMaintenanceCost).toLocaleString()} ${prediction?.currency || 'KRW'}`
                  : '-'}
              </div>
            </div>
            <div style={styles.cardRow}>
              <div style={styles.cardLabel}>모델 버전</div>
              <div style={{ fontWeight: 'bold' }}>{prediction?.modelVersion || '-'}</div>
            </div>
          </div>

          <div style={{ ...styles.buttonContainer, justifyContent: 'center' }}>
            <button
              type="button"
              style={{ ...styles.button, backgroundColor: '#198754', color: '#fff', minWidth: 150 }}
              onClick={handleReportGenerate}
              disabled={isLoading}
            >
              {isLoading ? '생성 중...' : '📊 보고서 생성'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentReportRegist;
