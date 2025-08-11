import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";

const EquipmentsDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [equipment, setEquipment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableEquipment, setEditableEquipment] = useState(null);

  useEffect(() => {
    const fetchEquipmentDetail = async () => {
      try {
        const response = await api.get(`/equipments/${id}`);
        const data = response.data;
        const fetchedEquipment = {
          id: data.equipment.equipmentId,
          category: data.equipment.category, 
          name: data.equipment.equipmentName,
          manufacturer: data.equipment.manufacturer,
          price: data.equipment.purchase,
          purchaseDate: data.equipment.purchaseDate,
          ipRating: data.equipment.protectionRating,
          lifespan: data.equipment.serviceYears,
          lightingDetail: data.lightingDetail,
          weatherDetail: data.weatherDetail,
          signDetail: data.signDetail,
        };
        setEquipment(fetchedEquipment);
        setEditableEquipment(fetchedEquipment);
      } catch (error) {
        console.error("Failed to fetch equipment detail:", error);
        setEquipment(null);
        setEditableEquipment(null);
      }
    };

    fetchEquipmentDetail();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("정말로 이 장비를 삭제하시겠습니까?")) {
      try {
        await api.delete(`/equipments/${id}`);
        alert("장비가 성공적으로 삭제되었습니다.");
        navigate("/equipment");
      } catch (error) {
        console.error("Failed to delete equipment:", error);
        alert("장비 삭제에 실패했습니다.");
      }
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditableEquipment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const updatePayload = {
        equipmentId: editableEquipment.id,
        equipmentName: editableEquipment.name,
        category: editableEquipment.category,
        manufacturer: editableEquipment.manufacturer,
        protectionRating: editableEquipment.ipRating,
        purchase: parseInt(editableEquipment.price, 10) || 0,
        purchaseDate: editableEquipment.purchaseDate,
        serviceYears: parseInt(editableEquipment.lifespan, 10) || 0,
        state: equipment.state,
        failure: equipment.failure,
        runtime: equipment.runtime,
        repairCost: equipment.repairCost,
        repairTime: equipment.repairTime,
        laborRate: equipment.laborRate,
        avgLife: equipment.avgLife,
        maintenanceCost: equipment.maintenanceCost,
      };

      await api.put(`/equipments/${id}`, updatePayload);
      alert("장비 정보가 성공적으로 수정되었습니다.");
      setIsEditing(false);
      setEquipment(editableEquipment);
    } catch (error) {
      console.error("Failed to update equipment:", error);
      alert("장비 정보 수정에 실패했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableEquipment(equipment);
  };

  if (!equipment || !editableEquipment) {
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
        <TextField
          name="category"
          value={isEditing ? editableEquipment.category : equipment.category}
          onChange={handleFieldChange}
          InputProps={{ readOnly: !isEditing }}
          size="small"
          select={isEditing}
        >
          <MenuItem value="조명">조명</MenuItem>
          <MenuItem value="기상">기상</MenuItem>
          <MenuItem value="표지판">표지판</MenuItem>
        </TextField>

        <Typography sx={{ alignSelf: "center" }}>장비명</Typography>
        <TextField
          name="name"
          value={isEditing ? editableEquipment.name : equipment.name}
          onChange={handleFieldChange}
          InputProps={{ readOnly: !isEditing }}
          size="small"
        />

        <Typography sx={{ alignSelf: "center" }}>제조사</Typography>
        <TextField
          name="manufacturer"
          value={isEditing ? editableEquipment.manufacturer : equipment.manufacturer}
          onChange={handleFieldChange}
          InputProps={{ readOnly: !isEditing }}
          size="small"
          select={isEditing}
        >
          <MenuItem value="Samsung">Samsung</MenuItem>
          <MenuItem value="Honeywell">Honeywell</MenuItem>
          <MenuItem value="GE">GE</MenuItem>
          <MenuItem value="LSElectric">LSElectric</MenuItem>
        </TextField>

        <Typography sx={{ alignSelf: "center" }}>구매 금액(원)</Typography>
        <TextField
          name="price"
          value={isEditing ? editableEquipment.price : equipment.price?.toLocaleString()}
          onChange={handleFieldChange}
          InputProps={{ readOnly: !isEditing }}
          size="small"
        />

        <Typography sx={{ alignSelf: "center" }}>구매일</Typography>
        <TextField
          name="purchaseDate"
          value={isEditing ? editableEquipment.purchaseDate : equipment.purchaseDate}
          onChange={handleFieldChange}
          InputProps={{ readOnly: !isEditing }}
          type="date"
          InputLabelProps={{ shrink: true }}
          size="small"
        />

        <Typography sx={{ alignSelf: "center" }}>보호등급(IP)</Typography>
        <TextField
          name="ipRating"
          value={isEditing ? editableEquipment.ipRating : equipment.ipRating}
          onChange={handleFieldChange}
          InputProps={{ readOnly: !isEditing }}
          size="small"
          select={isEditing}
        >
          <MenuItem value="IP65">IP65</MenuItem>
          <MenuItem value="IP66">IP66</MenuItem>
          <MenuItem value="IP67">IP67</MenuItem>
        </TextField>

        <Typography sx={{ alignSelf: "center" }}>내용연수(년)</Typography>
        <TextField
          name="lifespan"
          value={isEditing ? editableEquipment.lifespan : equipment.lifespan}
          onChange={handleFieldChange}
          InputProps={{ readOnly: !isEditing }}
          size="small"
        />
      </Box>

      {/* 버튼 */}
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
          onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
        >
          {isEditing ? "저장" : "수정"}
        </Button>
        {isEditing && (
          <Button
            variant="contained"
            sx={{ backgroundColor: "#000", color: "#fff", "&:hover": { backgroundColor: "#333" } }}
            onClick={handleCancelEdit}
          >
            취소
          </Button>
        )}
        {!isEditing && (
          <Button
            variant="contained"
            sx={{ backgroundColor: "#000", color: "#fff", "&:hover": { backgroundColor: "#333" } }}
            onClick={handleDelete}
          >
            삭제
          </Button>
        )}
        <Button
          variant="contained"
          sx={{ backgroundColor: "#000", color: "#fff", "&:hover": { backgroundColor: "#333" } }}
          onClick={() => navigate(-1)}
        >
          뒤로
        </Button>
      </Box>
    </Box>
  );
};

export default EquipmentsDetail;
