import React, { useState } from "react";
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

const EquipmentsRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    equipmentType: "",
    name: "",
    manufacturer: "",
    price: "",
    purchaseDate: "",
    ipRating: "",
    lifespan: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    let endpoint = "";
    let details = {};

    switch (form.equipmentType) {
      case "조명":
        endpoint = "/equipments/lighting";
        // TODO: 조명 장비 상세 정보 필드 추가 필요
        details = { lightingDetail: {} }; 
        break;
      case "기상":
        endpoint = "/equipments/weather";
        // TODO: 기상 장비 상세 정보 필드 추가 필요
        details = { weatherDetail: {} };
        break;
      case "표시-표지":
        endpoint = "/equipments/sign";
        // TODO: 표시-표지 장비 상세 정보 필드 추가 필요
        details = { signDetail: {} };
        break;
      default:
        console.error("Invalid category selected");
        return;
    }

    const equipmentData = {
      equipment: {
        equipmentName: form.name,
        equipmentType: form.equipmentType,
        manufacturer: form.manufacturer,
        protectionRating: form.ipRating,
        purchase: parseInt(form.price, 10) || 0,
       purchaseDate: form.purchaseDate 
       ? `${form.purchaseDate}T09:00:00`: null,
        serviceYears: parseInt(form.lifespan, 10) || 0,
        // 기본값 필드들 (백엔드 Not-Null 제약조건 방지)
        state: 'normal',
        failure: 0,
        runtime: 0,
        repairCost: 0,
        repairTime: 0,
        laborRate: 0,
        avgLife: 0,
        maintenanceCost: 0,
      },
      ...details,
    };

    try {
      console.log(equipmentData)
      await api.post(endpoint, equipmentData);
      alert("장비가 성공적으로 등록되었습니다.");
      navigate("/equipment"); // 등록 완료 후 장비 리스트로 이동
    } catch (error) {
      console.error("Failed to register equipment:", error);
      alert("장비 등록에 실패했습니다.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        신규 장비 등록
      </Typography>

      <TextField
        select
        name="equipmentType"
        label="카테고리"
        fullWidth
        value={form.equipmentType}
        onChange={handleChange}
        sx={{ mt: 2 }}
      >
        <MenuItem value="조명">조명</MenuItem>
        <MenuItem value="기상">기상</MenuItem>
        <MenuItem value="표시-표지">표시-표지</MenuItem>
      </TextField>

      <TextField
        name="name"
        label="장비명"
        fullWidth
        value={form.name}
        onChange={handleChange}
        sx={{ mt: 2 }}
      />

      <TextField
        select
        name="manufacturer"
        label="제조사"
        fullWidth
        value={form.manufacturer}
        onChange={handleChange}
        sx={{ mt: 2 }}
      >
        <MenuItem value="Samsung">Samsung</MenuItem>
        <MenuItem value="Honeywell">Honeywell</MenuItem>
        <MenuItem value="GE">GE</MenuItem>
        <MenuItem value="LSElectric">LSElectric</MenuItem>
      </TextField>

      <TextField
        name="price"
        label="구매 금액(원)"
        fullWidth
        value={form.price}
        onChange={handleChange}
        sx={{ mt: 2 }}
      />

      <TextField
        name="purchaseDate"
        label="구매일"
        type="date"
        InputLabelProps={{ shrink: true }}
        fullWidth
        value={form.purchaseDate}
        onChange={handleChange}
        sx={{ mt: 2 }}
      />

      <TextField
        select
        name="ipRating"
        label="보호등급(IP)"
        fullWidth
        value={form.ipRating}
        onChange={handleChange}
        sx={{ mt: 2 }}
      >
        <MenuItem value="IP65">IP65</MenuItem>
        <MenuItem value="IP66">IP66</MenuItem>
        <MenuItem value="IP67">IP67</MenuItem>
      </TextField>

      <TextField
        name="lifespan"
        label="내용연수(년)"
        fullWidth
        value={form.lifespan}
        onChange={handleChange}
        sx={{ mt: 2 }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          등록
        </Button>
        <Button onClick={() => navigate(-1)}>취소</Button>
      </Box>
    </Box>
  );
};

export default EquipmentsRegister;
