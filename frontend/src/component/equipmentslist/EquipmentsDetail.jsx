import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Chip, Divider, Card, CardContent, CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";

function fmtCurrency(n) {
  if (n === null || n === undefined || isNaN(n)) return "-";
  try { return Number(n).toLocaleString(); } catch { return String(n); }
}
function fmtDate(d) {
  if (!d) return "-";
  return d.includes("T") ? d.split("T")[0] : d;
}
const toReportParam = (t) => {
  switch (t) {
    case "조명": return "lighting";
    case "기상": return "weather";
    case "표지": return "sign";
    default: return "";
  }
};

export default function EquipmentsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/equipments/${id}`);
        const d = res.data;
        setEquipment({
          id: d.equipment.equipmentId,
          equipmentType: d.equipment.equipmentType,
          name: d.equipment.equipmentName,
          manufacturer: d.equipment.manufacturer,
          price: d.equipment.purchase,
          purchaseDate: d.equipment.purchaseDate, // ISO
          ipRating: d.equipment.protectionRating,
          lifespan: d.equipment.serviceYears,
          lightingDetail: d.lightingDetail,
          weatherDetail: d.weatherDetail,
          signDetail: d.signDetail,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 장비를 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/equipments/${id}`);
      alert("장비가 삭제되었습니다.");
      navigate("/equipment");
    } catch (e) {
      console.error(e);
      alert("장비 삭제에 실패했습니다.");
    }
  };

  const goReport = () => {
    if (!equipment) return;
    navigate(`/equipment/report/regist/${toReportParam(equipment.equipmentType)}`, {
      state: {
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        manufacturer: equipment.manufacturer,
        purchase: equipment.price,
        protectionRating: equipment.ipRating,
        serviceYears: equipment.lifespan,
      },
    });
  };

  if (loading) {
    return (
      <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!equipment) {
    return <Typography sx={{ mt: 4, textAlign: "center" }}>장비 정보를 불러올 수 없습니다.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", mt: 3, mb: 6 }}>
      {/* 헤더 */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>{equipment.name}</Typography>
          <Box sx={{ mt: 0.5, display: "flex", gap: 1, alignItems: "center" }}>
            <Chip label={equipment.equipmentType || "-"} size="small" />
            <Chip label={equipment.manufacturer || "-"} size="small" variant="outlined" />
            <Chip label={`IP ${equipment.ipRating || "-"}`} size="small" variant="outlined" />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate("/equipment")}>뒤로</Button>
          <Button variant="contained" onClick={() => navigate(`/equipment/${equipment.id}/edit`)}>수정</Button>
          <Button color="error" variant="outlined" onClick={handleDelete}>삭제</Button>
          <Button variant="contained" onClick={goReport}>분석요청</Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* 기본 정보만 표시 */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            기본 정보
          </Typography>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: "160px 1fr",
            rowGap: 1.5,
            columnGap: 2,
          }}>
            <Typography color="text.secondary">장비명</Typography>
            <Typography>{equipment.name || "-"}</Typography>

            <Typography color="text.secondary">카테고리</Typography>
            <Typography>{equipment.equipmentType || "-"}</Typography>

            <Typography color="text.secondary">제조사</Typography>
            <Typography>{equipment.manufacturer || "-"}</Typography>

            <Typography color="text.secondary">구매 금액(원)</Typography>
            <Typography>{fmtCurrency(equipment.price)}</Typography>

            <Typography color="text.secondary">구매일</Typography>
            <Typography>{fmtDate(equipment.purchaseDate)}</Typography>

            <Typography color="text.secondary">보호등급</Typography>
            <Typography>{equipment.ipRating || "-"}</Typography>

            <Typography color="text.secondary">내용연수(년)</Typography>
            <Typography>{equipment.lifespan ?? "-"}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
