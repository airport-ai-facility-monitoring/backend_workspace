import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// ... (상단 설정 및 스타일은 기존과 동일합니다)
const subCategoryMap = {
  '조명': ['REL', 'RCL', 'TDZL', 'REIL'],
  '기상관측': ['Anemometer', 'Windvane', 'Visibilitysensor', 'RVRsensor'],
  '표시-표지': ['RDRS', 'TEL', 'TS'],
};
const initialFormData = {
  '조명': { failure: 1, repair_cost: 150000, repair_time: 25, labor_rate: 30000, runtime: 150, avg_life: 5000, lamp_type: 'LED', power_consumption: 50 },
  '기상관측': { failure: 1, repair_cost: 550000, repair_time: 40, labor_rate: 50000, runtime: 650, avg_life: 90000, power_consumption: 5, mount_type: 'pole' },
  '표시-표지': { failure: 0, repair_cost: 300000, repair_time: 25, labor_rate: 35000, runtime: 690, avg_life: 100000, panel_width: 15, panel_height: 20, material: 'Polycarbonate', sign_color: 'Yellow', mount_type: 'surface' },
};
const categoryNameMap = {
  lighting: '조명',
  weather: '기상관측',
  sign: '표시-표지',
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

    const { equipmentName, manufacturer, purchase, protectionRating, serviceYears } = location.state || {};
    const mainCategory = categoryNameMap[category] || '조명';
    
    const [subCategory, setSubCategory] = useState(null);
    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const subCategoryList = subCategoryMap[mainCategory];
        const initialData = initialFormData[mainCategory];
        if (subCategoryList && initialData) {
            setSubCategory(subCategoryList[0]);
            setFormData(initialData);
        }
        setError(null);
    }, [mainCategory, location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (formData) {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const getApiUrl = () => {
        const baseUrl = 'https://shiny-space-cod-q775qq4rwxp6cx757-8088.app.github.dev/equipmentReports';
        switch (mainCategory) {
            case '조명': return `${baseUrl}/regist/lighting`;
            case '기상관측': return `${baseUrl}/regist/weather`;
            case '표시-표지': return `${baseUrl}/regist/sign`;
            default: return `${baseUrl}/analyze`;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const equipmentBaseData = {
            equipmentName: equipmentName || '',
            manufacturer: manufacturer || '',
            purchase: purchase !== undefined ? Number(purchase) : 0,
            protection_rating: protectionRating || '',
            service_years: serviceYears !== undefined ? Number(serviceYears) : 0,
        };
        const combinedData = { ...formData, ...equipmentBaseData, category: subCategory };
        const numericFields = ['purchase', 'failure', 'runtime', 'service_years', 'maintenance_cost', 'repair_cost', 'repair_time', 'labor_rate', 'avg_life', 'power_consumption', 'panel_width', 'panel_height'];
        const payload = Object.fromEntries(
            Object.entries(combinedData).map(([key, value]) => {
                if (numericFields.includes(key) && value !== null && value !== '') {
                    return [key, Number(value)];
                }
                return [key, value];
            })
        );

        const apiUrl = getApiUrl();
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API 요청 실패: ${response.status} ${errorText}`);
            }
            const result = await response.json();
            
            // --- ⬇️ 주요 수정 사항: localStorage에 새 보고서 저장 ⬇️ ---
            const initialOpinion = `[유지/폐기 결정]\n${result.decision}\n\n[상세 조치 내용]\n${result.action}`;
            const newReport = {
                id: result.id,
                type: mainCategory,
                name: payload.equipmentName,
                timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
                cost: result.cost,
                reportData: result,
                formData: payload,
                opinion: initialOpinion, // 편집 가능한 종합의견 필드 추가
            };

            const savedReports = JSON.parse(localStorage.getItem('reports') || '[]');
            const updatedReports = [...savedReports, newReport];
            localStorage.setItem('reports', JSON.stringify(updatedReports));
            // --- ⬆️ 주요 수정 사항 ⬆️ ---

            alert('분석이 완료되었습니다. 보고서 상세 페이지로 이동합니다.');
            navigate(`/equipment/report/${result.id}`, { state: { reportItem: newReport } });

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
    
    return (
      <div style={styles.container}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h2 style={styles.title}>장비 유지보수 AI 분석 요청</h2>
          <div style={styles.formRow}><label style={styles.label}>장비 대분류</label><select style={styles.select} value={mainCategory} disabled><option value="조명">조명</option><option value="기상관측">기상관측</option><option value="표시-표지">표시-표지</option></select></div>
          <div style={styles.formRow}><label style={styles.label}>장비 소분류</label><select style={styles.select} value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>{subCategoryMap[mainCategory].map(sc => ( <option key={sc} value={sc}>{sc}</option> ))}</select></div>
          <hr style={styles.hr} />
          <><div style={styles.formRow}><label style={styles.label}>고장 기록(회)</label><input style={styles.input} type="number" name="failure" value={formData.failure} onChange={handleInputChange} /></div><div style={styles.formRow}><label style={styles.label}>가동시간(월평균)</label><input style={styles.input} type="number" name="runtime" value={formData.runtime} onChange={handleInputChange} /></div><div style={styles.formRow}><label style={styles.label}>평균 수명(시간)</label><input style={styles.input} type="number" name="avg_life" value={formData.avg_life} onChange={handleInputChange} /></div><div style={styles.formRow}><label style={styles.label}>수리 비용</label><input style={styles.input} type="number" name="repair_cost" value={formData.repair_cost} onChange={handleInputChange} /></div><div style={styles.formRow}><label style={styles.label}>수리 시간</label><input style={styles.input} type="number" name="repair_time" value={formData.repair_time} onChange={handleInputChange} /></div><div style={styles.formRow}><label style={styles.label}>시간당 인건비</label><input style={styles.input} type="number" name="labor_rate" value={formData.labor_rate} onChange={handleInputChange} /></div></>
          <hr style={styles.hr} />
          {mainCategory === '조명' && ( <><div style={styles.formRow}><label style={styles.label}>램프 유형</label><select style={styles.select} name="lamp_type" value={formData.lamp_type || ''} onChange={handleInputChange}>{dropdownOptions.lamp_type.map(opt => ( <option key={opt} value={opt}>{opt}</option> ))}</select></div><div style={styles.formRow}><label style={styles.label}>소비 전력(W)</label><input style={styles.input} type="number" name="power_consumption" value={formData.power_consumption || ''} onChange={handleInputChange} /></div></> )}
          {mainCategory === '기상관측' && ( <><div style={styles.formRow}><label style={styles.label}>소비 전력(W)</label><input style={styles.input} type="number" name="power_consumption" value={formData.power_consumption || ''} onChange={handleInputChange} /></div><div style={styles.formRow}><label style={styles.label}>설치 형태</label><select style={styles.select} name="mount_type" value={formData.mount_type || ''} onChange={handleInputChange}>{dropdownOptions.mount_type.map(opt => ( <option key={opt} value={opt}>{opt}</option> ))}</select></div></> )}
          {mainCategory === '표시-표지' && ( <><div style={styles.formRow}><label style={styles.label}>판넬 너비(mm)</label><input style={styles.input} type="number" name="panel_width" value={formData.panel_width || ''} onChange={handleInputChange} /></div><div style={styles.formRow}><label style={styles.label}>판넬 높이(mm)</label><input style={styles.input} type="number" name="panel_height" value={formData.panel_height || ''} onChange={handleInputChange} /></div><div style={styles.formRow}><label style={styles.label}>재질</label><select style={styles.select} name="material" value={formData.material || ''} onChange={handleInputChange}>{dropdownOptions.material.map(opt => ( <option key={opt} value={opt}>{opt}</option> ))}</select></div><div style={styles.formRow}><label style={styles.label}>표지판 색상</label><select style={styles.select} name="sign_color" value={formData.sign_color || ''} onChange={handleInputChange}>{dropdownOptions.sign_color.map(opt => ( <option key={opt} value={opt}>{opt}</option> ))}</select></div><div style={styles.formRow}><label style={styles.label}>설치 형태</label><select style={styles.select} name="mount_type" value={formData.mount_type || ''} onChange={handleInputChange}>{dropdownOptions.mount_type.map(opt => ( <option key={opt} value={opt}>{opt}</option> ))}</select></div></> )}
          <div style={styles.buttonContainer}><button type="submit" style={{...styles.button, ...styles.submitButton}} disabled={isLoading}>{isLoading ? '분석 중...' : '분석 요청'}</button><button type="button" style={{...styles.button, ...styles.cancelButton}} onClick={handleCancel}>취소</button></div>
        </form>
        {error && ( <div style={{ ...styles.resultContainer, borderColor: 'red' }}><h3 style={{ ...styles.resultTitle, color: 'red' }}>에러 발생</h3><p style={styles.resultText}>{error}</p></div> )}
      </div>
    );
};

export default EquipmentReportRegist;
