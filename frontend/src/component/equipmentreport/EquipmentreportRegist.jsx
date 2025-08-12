import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// (subCategoryMap, initialFormData, categoryNameMap, styles 등 상단 설정은 기존과 동일)
const subCategoryMap = {
  '조명': ['REL', 'RCL', 'TDZL', 'REIL'],
  '기상관측': ['Anemometer', 'Windvane', 'Visibilitysensor', 'RVRsensor'],
  '표지': ['RDRS', 'TEL', 'TS'],
};
const initialFormData = {
  '조명': { failure: 1, repair_cost: 150000, repair_time: 25, labor_rate: 30000, runtime: 150, avg_life: 5000, lamp_type: 'LED', power_consumption: 50 },
  '기상관측': { failure: 1, repair_cost: 550000, repair_time: 40, labor_rate: 50000, runtime: 650, avg_life: 90000, power_consumption: 5, mount_type: 'pole' },
  '표지': { failure: 0, repair_cost: 300000, repair_time: 25, labor_rate: 35000, runtime: 690, avg_life: 100000, panel_width: 15, panel_height: 20, material: 'Polycarbonate', sign_color: 'Yellow', mount_type: 'surface' },
};
const categoryNameMap = {
  lighting: '조명',
  weather: '기상관측',
  sign: '표지',
};
const styles = {
    container: { backgroundColor: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px', fontFamily: 'sans-serif' },
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
};

const dropdownOptions = {
  lamp_type: ['LED', 'Halogen', 'Fluorescent'],
  mount_type: ['pole', 'mast', 'surface', 'tripod'],
  material: ['Aluminum', 'Stainless Steel', 'Polycarbonate'],
  sign_color: ['White', 'Yellow', 'Black', 'Red'],
};

const EquipmentReportRegist = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    equipmentId,      // ✅ 추가: 스프링에 보낼 장비 ID
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
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log("location.state:", location.state);
    const subCategoryList = subCategoryMap[mainCategory];
    const initialData = initialFormData[mainCategory];
    if (subCategoryList && initialData) {
      setSubCategory(subCategoryList[0]);
      setFormData(initialData);
    }
    setAnalysisResult(null);
    setError(null);
  }, [mainCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  // --- ⬇️ 주요 수정 사항 ⬇️ ---
  const getApiUrl = () => {
    if (!equipmentId) {
      throw new Error('equipmentId가 없습니다. 장비 상세에서 equipmentId를 넘겨주세요.');
    }
    // ⚠️ 실제 스프링 백엔드 주소/포트로 교체
    const base = 'https://glowing-space-fiesta-g4w47xwqjgj525qp-8088.app.github.dev';
    return `${base}/equipments/${equipmentId}/predict`;
  };
  // --- ⬆️ 주요 수정 사항 ⬆️ ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const apiUrl = getApiUrl();
      // ✅ 화면에서 입력한 숫자만 덮어쓰기
      const overrides = buildOverrides(formData);
      const response = await fetch(apiUrl, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ values: overrides }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 요청 실패: ${response.status} ${errorText}`);
      }
      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message);
      console.error('API 호출 중 에러 발생:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => { navigate('/equipment/report'); };
  
  if (!formData || !subCategory) {
    return <div>카테고리 정보를 불러오는 중...</div>;
  }

  const renderCommonFields = () => (
    <>
      <div style={styles.formRow}><label style={styles.label}>고장 기록(회)</label><input style={styles.input} type="number" name="failure" value={formData.failure} onChange={handleInputChange} /></div>
      <div style={styles.formRow}><label style={styles.label}>가동시간(월평균)</label><input style={styles.input} type="number" name="runtime" value={formData.runtime} onChange={handleInputChange} /></div>
      <div style={styles.formRow}><label style={styles.label}>평균 수명(시간)</label><input style={styles.input} type="number" name="avg_life" value={formData.avg_life} onChange={handleInputChange} /></div>
      <div style={styles.formRow}><label style={styles.label}>수리 비용</label><input style={styles.input} type="number" name="repair_cost" value={formData.repair_cost} onChange={handleInputChange} /></div>
      <div style={styles.formRow}><label style={styles.label}>수리 시간</label><input style={styles.input} type="number" name="repair_time" value={formData.repair_time} onChange={handleInputChange} /></div>
      <div style={styles.formRow}><label style={styles.label}>시간당 인건비</label><input style={styles.input} type="number" name="labor_rate" value={formData.labor_rate} onChange={handleInputChange} /></div>
    </>
  );

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
    // lamp_type, mount_type, material, sign_color는 일단 보내지 않음(라벨→코드 변환 필요)
  };

  function buildOverrides(form) {
    const overrides = {};
    Object.entries(keyMap).forEach(([from, to]) => {
      const v = form?.[from];
      if (v !== '' && v !== null && v !== undefined && !Number.isNaN(Number(v))) {
        overrides[to] = Number(v);
      }
    });
    return overrides;
  }

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>장비 유지보수 AI 분석 요청</h2>
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
            {subCategoryMap[mainCategory].map(sc => ( <option key={sc} value={sc}>{sc}</option> ))}
          </select>
        </div>
        <hr style={styles.hr} />
        {renderCommonFields()}
        <hr style={styles.hr} />
        
        {mainCategory === '조명' && (
          <>
            <div style={styles.formRow}>
              <label style={styles.label}>램프 유형</label>
              <select style={styles.select} name="lamp_type" value={formData.lamp_type || ''} onChange={handleInputChange}>
                {dropdownOptions.lamp_type.map(opt => ( <option key={opt} value={opt}>{opt}</option> ))}
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
                {dropdownOptions.mount_type.map(opt => ( <option key={opt} value={opt}>{opt}</option>))}
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
                {dropdownOptions.material.map(opt => ( <option key={opt} value={opt}>{opt}</option> ))}
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>표지판 색상</label>
              <select style={styles.select} name="sign_color" value={formData.sign_color || ''} onChange={handleInputChange}>
                {dropdownOptions.sign_color.map(opt => ( <option key={opt} value={opt}>{opt}</option> ))}
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>설치 형태</label>
              <select style={styles.select} name="mount_type" value={formData.mount_type || ''} onChange={handleInputChange}>
                {dropdownOptions.mount_type.map(opt => ( <option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>
          </>
        )}

        <div style={styles.buttonContainer}>
          <button type="submit" style={{...styles.button, ...styles.submitButton}} disabled={isLoading}>
            {isLoading ? '분석 중...' : '분석 요청'}
          </button>
          <button type="button" style={{...styles.button, ...styles.cancelButton}} onClick={handleCancel}>취소</button>
        </div>
      </form>

      {error && (
        <div style={{ ...styles.resultContainer, borderColor: 'red' }}>
          <h3 style={{ ...styles.resultTitle, color: 'red' }}>에러 발생</h3>
          <p style={styles.resultText}>{error}</p>
        </div>
      )}
      {analysisResult && (
        <div style={styles.resultContainer}>
          <h3 style={styles.resultTitle}>AI 분석 결과 (ID: {analysisResult.id})</h3>
          <p style={styles.resultText}><strong>예상 조치:</strong> {analysisResult.action}</p>
          <p style={styles.resultText}><strong>유지/폐기 결정:</strong> {analysisResult.decision}</p>
          <p style={styles.resultText}><strong>예상 총 비용:</strong> {Number(analysisResult.cost).toLocaleString()}원</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentReportRegist;