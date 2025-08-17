// src/pages/equipment/EquipmentsEdit.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, MenuItem, Button, Card, CardContent, Grid, Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";

export default function EquipmentsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/equipments/${id}`);
        const d = res.data;
        setForm({
          id: d.equipment.equipmentId,
          equipmentType: d.equipment.equipmentType || "",
          name: d.equipment.equipmentName || "",
          manufacturer: d.equipment.manufacturer || "",
          price: d.equipment.purchase ?? "",
          purchaseDate: (d.equipment.purchaseDate || "").split("T")[0],
          ipRating: d.equipment.protectionRating || "",
          lifespan: d.equipment.serviceYears ?? "",
        });
      } catch (e) {
        console.error(e);
        setErr("장비 정보를 불러올 수 없습니다.");
      }
    })();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSave = async () => {
    setErr(null);
    if (!form.name || !form.equipmentType) {
      setErr("필수 항목을 입력하세요. (장비명, 카테고리)");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        equipmentId: form.id,
        equipmentName: form.name,
        equipmentType: form.equipmentType,
        manufacturer: form.manufacturer,
        protectionRating: form.ipRating,
        purchase: parseInt(form.price, 10) || 0,
        // purchaseDate: form.purchaseDate, // 그대로 전송(서버가 yyyy-MM-dd 처리)
        purchaseDate: form.purchaseDate 
       ? `${form.purchaseDate}T09:00:00`: null,
        serviceYears: parseInt(form.lifespan, 10) || 0,
      };
      await api.put(`/equipments/${id}`, payload);
      alert("장비 정보가 수정되었습니다.");
      navigate(`/equipment/${id}`); // 상세로 복귀
    } catch (e) {
      console.error(e);
      setErr("수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <Typography sx={{ mt: 3, textAlign: "center" }}>로딩 중...</Typography>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 3, mb: 6 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        장비 수정
      </Typography>
      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="장비명" name="name" value={form.name} onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth select label="카테고리" name="equipmentType"
                value={form.equipmentType} onChange={onChange}
              >
                <MenuItem value="조명">조명</MenuItem>
                <MenuItem value="기상">기상</MenuItem>
                <MenuItem value="표지">표지</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth select label="제조사" name="manufacturer"
                value={form.manufacturer} onChange={onChange}
              >
                <MenuItem value="Samsung">Samsung</MenuItem>
                <MenuItem value="Honeywell">Honeywell</MenuItem>
                <MenuItem value="GE">GE</MenuItem>
                <MenuItem value="LSElectric">LSElectric</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="구매 금액(원)" name="price" type="number"
                value={form.price} onChange={onChange}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="구매일" name="purchaseDate" type="date"
                value={form.purchaseDate} onChange={onChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth select label="보호등급(IP)" name="ipRating"
                value={form.ipRating} onChange={onChange}
              >
                <MenuItem value="IP65">IP65</MenuItem>
                <MenuItem value="IP66">IP66</MenuItem>
                <MenuItem value="IP67">IP67</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="내용연수(년)" name="lifespan" type="number"
                value={form.lifespan} onChange={onChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>취소</Button>
            <Button variant="contained" disabled={saving} onClick={onSave}>
              {saving ? "저장 중..." : "저장"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}