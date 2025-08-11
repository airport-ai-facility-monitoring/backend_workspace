import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

const EquipmentsList = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [filterCategory, setFilterCategory] = useState("전체");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await api.get("/equipments");
        // DTO 구조에 맞게 equipmentList 상태 업데이트
        const formattedData = response.data.map(item => ({
          id: item.equipment.equipmentId,
          category: item.equipment.equipmentType,
          name: item.equipment.equipmentName,
          registeredAt: new Date(item.equipment.purchaseDate).toLocaleString(),
        }));
        setEquipmentList(formattedData);
      } catch (error) {
        console.error("Failed to fetch equipments:", error);
      }
    };

    fetchEquipments();
  }, []);

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const filteredList =
    filterCategory === "전체"
      ? equipmentList
      : equipmentList.filter((item) => item.category && item.category.includes(filterCategory));

  return (
    <Box sx={{ p: 4 }}>
      {/* 상단 필터 */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          장비 현황
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1">장비종류 선택</Typography>
          <Select size="small" value={filterCategory} onChange={handleFilterChange}>
            <MenuItem value="전체">전체</MenuItem>
            <MenuItem value="조명">조명</MenuItem>
            <MenuItem value="기상">기상</MenuItem>
            <MenuItem value="표지판">표지판</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* 장비 목록 테이블 */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>장비 종류</TableCell>
              <TableCell>장비명</TableCell>
              <TableCell>장비 등록 시간</TableCell>
              <TableCell align="center">상세</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList.map((equipment, index) => (
              <TableRow key={equipment.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Chip label={equipment.category} variant="outlined" size="small" />
                </TableCell>
                <TableCell>{equipment.name}</TableCell>
                <TableCell>{equipment.registeredAt}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/equipment/${equipment.id}`)}
                  >
                    상세보기
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 신규 등록 버튼 */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button variant="contained" onClick={() => navigate("/equipment/regist")}>
          신규장비등록
        </Button>
      </Box>
    </Box>
  );
};

export default EquipmentsList;
