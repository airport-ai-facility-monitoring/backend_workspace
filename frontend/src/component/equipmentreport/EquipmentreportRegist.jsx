import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

// 각 카테고리별 초기 데이터 (스크린샷 기반)
const initialData = {
  '조명': {
    serialNumber: '1',
    failureRecord: '1',
    avgMonthlyUptime: '150',
    repairCost: '150000',
    repairTime: '25',
    laborCost: '30000',
    avgLifespan: '5000',
    lampType: 'LED',
    powerConsumption: '50',
  },
  '기상관측': {
    serialNumber: '2',
    failureRecord: '1',
    avgMonthlyUptime: '650',
    repairCost: '550000',
    repairTime: '40',
    laborCost: '50000',
    avgLifespan: '90000',
    installType: 'pole',
    powerConsumption: '0.05',
  },
  '표지-표시': {
    serialNumber: '3',
    failureRecord: '0',
    avgMonthlyUptime: '690',
    repairCost: '300000',
    repairTime: '25',
    laborCost: '35000',
    avgLifespan: '100000',
    panelWidth: '15',
    panelHeight: '20',
    material: 'Polycarbonate',
    signColor: 'Yellow',
    installMethod: 'Surface',
  },
};

// 스타일 객체
const styles = {
  container: {
    backgroundColor: '#f0f2f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px',
    fontFamily: 'sans-serif',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
  },
  formRow: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    width: '150px',
    color: '#555',
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa',
    fontSize: '14px',
    color: '#333',
  },
  select: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa',
    fontSize: '14px',
    color: '#333',
  },
  buttonContainer: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  submitButton: {
    backgroundColor: '#343a40',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
  }
};


const RepairRequestForm = () => {
  const [category, setCategory] = useState('조명');
  const [formData, setFormData] = useState(initialData[category]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    setFormData(initialData[newCategory]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('제출된 데이터:', { category, ...formData });
    alert(`'${category}' 카테고리의 수리 요청이 제출되었습니다.\n\n` + JSON.stringify(formData, null, 2));
  };

  // ✨ 취소 버튼 클릭 시 /equipmentreport 경로로 이동하도록 수정된 핸들러
  const handleCancel = () => {
    // window.location.href를 사용하여 페이지를 이동시킵니다.
   window.location.href = '/equipmentreport';
  };

  const renderCommonFields = () => (
    <>
      <div style={styles.formRow}>
        <label style={styles.label}>일련번호</label>
        <input style={styles.input} type="text" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} />
      </div>
      <div style={styles.formRow}>
        <label style={styles.label}>고장기록</label>
        <input style={styles.input} type="text" name="failureRecord" value={formData.failureRecord} onChange={handleInputChange} />
      </div>
      <div style={styles.formRow}>
        <label style={styles.label}>가동시간(월 평균)</label>
        <input style={styles.input} type="text" name="avgMonthlyUptime" value={formData.avgMonthlyUptime} onChange={handleInputChange} />
      </div>
      <div style={styles.formRow}>
        <label style={styles.label}>수리비용</label>
        <input style={styles.input} type="text" name="repairCost" value={formData.repairCost} onChange={handleInputChange} />
      </div>
      <div style={styles.formRow}>
        <label style={styles.label}>수리 시간</label>
        <input style={styles.input} type="text" name="repairTime" value={formData.repairTime} onChange={handleInputChange} />
      </div>
      <div style={styles.formRow}>
        <label style={styles.label}>정비시 인건비</label>
        <input style={styles.input} type="text" name="laborCost" value={formData.laborCost} onChange={handleInputChange} />
      </div>
      <div style={styles.formRow}>
        <label style={styles.label}>장비 평균수명</label>
        <input style={styles.input} type="text" name="avgLifespan" value={formData.avgLifespan} onChange={handleInputChange} />
      </div>
    </>
  );

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>수리 장비 요청</h2>

        <div style={styles.formRow}>
          <label style={styles.label}>카테고리</label>
          <select style={styles.select} value={category} onChange={handleCategoryChange}>
            <option value="조명">조명</option>
            <option value="기상관측">기상관측</option>
            <option value="표지-표시">표지-표시</option>
          </select>
        </div>

        {renderCommonFields()}

        {category === '조명' && (
          <>
            <div style={styles.formRow}>
              <label style={styles.label}>램프 유형</label>
               <select style={styles.select} name="lampType" value={formData.lampType || ''} onChange={handleInputChange}>
                <option value="LED">LED</option>
                <option value="Halogen">Halogen</option>
                <option value="Fluorescent">Fluorescent</option>
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>소비 전력</label>
              <input style={styles.input} type="text" name="powerConsumption" value={formData.powerConsumption || ''} onChange={handleInputChange} />
            </div>
          </>
        )}

        {category === '기상관측' && (
          <>
            <div style={styles.formRow}>
              <label style={styles.label}>설치 형태</label>
              <select style={styles.select} name="installType" value={formData.installType || ''} onChange={handleInputChange}>
                <option value="Pole">Pole</option>
                <option value="Mast">Mast</option>
                <option value="Surface">Surface</option>
                <option value="Tripod">Tripod</option>
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>소비 전력</label>
              <input style={styles.input} type="text" name="powerConsumption" value={formData.powerConsumption || ''} onChange={handleInputChange} />
            </div>
          </>
        )}

        {category === '표지-표시' && (
          <>
            <div style={styles.formRow}>
              <label style={styles.label}>판넬 크기(가로)</label>
              <input style={styles.input} type="text" name="panelWidth" value={formData.panelWidth || ''} onChange={handleInputChange} />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>판넬 크기(세로)</label>
              <input style={styles.input} type="text" name="panelHeight" value={formData.panelHeight || ''} onChange={handleInputChange} />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>구성 재질</label>
              <select style={styles.select} name="material" value={formData.material || ''} onChange={handleInputChange}>
                <option value="Aluminum">Aluminum</option>
                <option value="Stainless Steel">Stainless Steel</option>
                <option value="Polycarbonate">Polycarbonate</option>
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>표지판 색상</label>
              <select style={styles.select} name="signColor" value={formData.signColor || ''} onChange={handleInputChange}>
                <option value="White">White</option>
                <option value="Yellow">Yellow</option>
                <option value="Red">Red</option>
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>설치 방식</label>
              <select style={styles.select} name="installMethod" value={formData.installMethod || ''} onChange={handleInputChange}>
                <option value="Pole">Pole</option>
                <option value="Mast">Mast</option>
                <option value="Surface">Surface</option>
                <option value="Tripod">Tripod</option>
              </select>
            </div>
          </>
        )}

        <div style={styles.buttonContainer}>
          <button type="submit" style={{...styles.button, ...styles.submitButton}}>요청</button>
          <button type="button" style={{...styles.button, ...styles.cancelButton}} onClick={handleCancel}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default RepairRequestForm;