import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const EquipmentsDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [equipment, setEquipment] = useState(null);

  useEffect(() => {
    const dummy = {
      id: id,
      category: "REL",
      name: "LED 활주로등",
      manufacturer: "Samsung",
      price: 500000,
      purchaseDate: "2023-05-20",
      ipRating: "IP65",
      lifespan: 10,
    };
    setEquipment(dummy);
  }, [id]);

  if (!equipment) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>로딩 중...</Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      {/* 장비 정보 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "150px 1fr",
          rowGap: 2,
          columnGap: 2,
          mt: 2,
          backgroundColor: "#fff",
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography sx={{ alignSelf: "center" }}>카테고리</Typography>
        <TextField value={equipment.category} InputProps={{ readOnly: true }} size="small" />

        <Typography sx={{ alignSelf: "center" }}>장비명</Typography>
        <TextField value={equipment.name} InputProps={{ readOnly: true }} size="small" />

        <Typography sx={{ alignSelf: "center" }}>제조사</Typography>
        <TextField value={equipment.manufacturer} InputProps={{ readOnly: true }} size="small" />

        <Typography sx={{ alignSelf: "center" }}>구매 금액(원)</Typography>
        <TextField
          value={equipment.price?.toLocaleString()}
          InputProps={{ readOnly: true }}
          size="small"
        />

        <Typography sx={{ alignSelf: "center" }}>구매일</Typography>
        <TextField value={equipment.purchaseDate} InputProps={{ readOnly: true }} size="small" />

        <Typography sx={{ alignSelf: "center" }}>보호등급(IP)</Typography>
        <TextField value={equipment.ipRating} InputProps={{ readOnly: true }} size="small" />

        <Typography sx={{ alignSelf: "center" }}>내용연수(년)</Typography>
        <TextField value={equipment.lifespan} InputProps={{ readOnly: true }} size="small" />
      </Box>

      {/* 버튼 (피그마 스타일: 검정 배경, 흰색 텍스트) */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#000", color: "#fff", "&:hover": { backgroundColor: "#333" } }}
          onClick={() => console.log("수리요청", id)}
        >
          수리요청
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#000", color: "#fff", "&:hover": { backgroundColor: "#333" } }}
          onClick={() => navigate(`/equipment/edit/${id}`)}
        >
          수정
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#000", color: "#fff", "&:hover": { backgroundColor: "#333" } }}
          onClick={() => console.log("삭제", id)}
        >
          삭제
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#000", color: "#fff", "&:hover": { backgroundColor: "#333" } }}
          onClick={() => navigate(-1)}
        >
          취소
        </Button>
      </Box>
    </Box>
  );
};

export default EquipmentsDetail;
