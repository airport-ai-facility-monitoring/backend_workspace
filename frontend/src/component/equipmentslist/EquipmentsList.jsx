import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom"; // ✅ 페이지 이동

// 더미 데이터
const dummyData = [
  { id: 1, category: "조명(시각유도)", name: "hellod", registeredAt: "2025-07-18 17:06" },
  { id: 2, category: "기상관측", name: "ddddfo", registeredAt: "2025-07-17 12:00" },
  { id: 3, category: "표지·표시", name: "토잉카", registeredAt: "2025-07-17 06:35" },
  { id: 4, category: "표지·표시", name: "dss car", registeredAt: "2025-07-16 17:06" },
];

const EquipmentsList = () => {
  const [equipmentList] = useState(dummyData);
  const [filterCategory, setFilterCategory] = useState("전체");

  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  // 카테고리 필터링
  const filteredList =
    filterCategory === "전체"
      ? equipmentList
      : equipmentList.filter((item) => item.category.includes(filterCategory));

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
            <MenuItem value="기상관측">기상관측</MenuItem>
            <MenuItem value="표지·표시">표지·표시</MenuItem>
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
                  {/* ✅ 상세보기 버튼 클릭 시 해당 id로 이동 */}
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
