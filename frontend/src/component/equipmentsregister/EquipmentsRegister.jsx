import React, { useState } from "react";
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EquipmentsRegister = () => {
  const navigate = useNavigate();

  // ✅ 장비 등록 폼 상태
  const [form, setForm] = useState({
    category: "",
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

  // TODO: 백엔드 연동 필요
  const handleSubmit = () => {
    console.log("장비 등록 요청:", form);
    navigate("/equipment"); // 등록 완료 후 장비 리스트로 이동
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        신규 장비 등록
      </Typography>

      {/* 카테고리 선택 */}
      <TextField
        select
        name="category"
        label="카테고리"
        fullWidth
        value={form.category}
        onChange={handleChange}
        sx={{ mt: 2 }}
      >
        <MenuItem value="조명">조명</MenuItem>
        <MenuItem value="전기">기상관측</MenuItem>
        <MenuItem value="기계">표지-표시</MenuItem>
      </TextField>

      {/* 장비명 */}
      <TextField
        name="name"
        label="장비명"
        fullWidth
        value={form.name}
        onChange={handleChange}
        sx={{ mt: 2 }}
      />

      {/* 제조사 */}
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

      {/* 구매 금액 */}
      <TextField
        name="price"
        label="구매 금액(원)"
        fullWidth
        value={form.price}
        onChange={handleChange}
        sx={{ mt: 2 }}
      />

      {/* 구매일 */}
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

      {/* 보호등급 */}
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

      {/* 내용연수 */}
      <TextField
        name="lifespan"
        label="내용연수(년)"
        fullWidth
        value={form.lifespan}
        onChange={handleChange}
        sx={{ mt: 2 }}
      />

      {/* 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          등록
        </Button>
        <Button sx={{ ml: 1 }} onClick={() => navigate(-1)}>
          취소
        </Button>
      </Box>
    </Box>
  );
};

export default EquipmentsRegister;
