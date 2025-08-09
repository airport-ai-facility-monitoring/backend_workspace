import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import api from "../../config/api"; // API 모듈은 남겨두고

const RunwayCrack = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚀 1. 페이지 진입 시 더미 데이터 추가 (임시)
  useEffect(() => {
    // 백엔드 API 대신 프론트엔드에서 직접 더미 데이터를 생성
    const dummyData = [{
      rcId: 1, // 고유 ID
      imageUrl: "https://via.placeholder.com/150",
      cctvId: 201,
      length: 30,
      area: 150,
      detectedDate: "2025-07-18",
    }];

    setLoading(true);

    // 실제 API 호출 로직은 주석 처리하여 남겨둠
    /*
    const fetchData = async () => {
      try {
        const res = await api.get("/runwaycracks");
        setData(res.data);
      } catch (err) {
        console.error("데이터 로딩 실패", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    */

    // 임시 더미 데이터 로직
    setTimeout(() => {
      setData(dummyData);
      setLoading(false);
    }, 500);

  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f3f6fe" }}>
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {/* Breadcrumb */}
        <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Welcome
          </Typography>
          <NavigateNextIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="primary" fontWeight="bold">
            Dashboard
          </Typography>
          <NavigateNextIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="primary" fontWeight="bold">
            Crack
          </Typography>
        </Box>
        {/* Summary Card */}
        <Paper sx={{ mx: 3, mb: 3, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">노선 손상 내역</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", width: 210 }}>
              <Typography variant="caption" color="text.secondary">
                날짜
              </Typography>
              <Typography variant="body1">2025.07.18</Typography>
              <Divider sx={{ mt: 1, bgcolor: "#1348fc" }} />
            </Box>
          </Box>
        </Paper>
        {/* Table */}
        <Box sx={{ mx: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6">노선 손상 결과 진행도</Typography>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">상태</TableCell>
                  <TableCell align="center">현장 (CCTV ID)</TableCell>
                  <TableCell align="center">파손 길이 (cm)</TableCell>
                  <TableCell align="center">파손 면적 (cm²)</TableCell>
                  <TableCell align="center">사진</TableCell>
                  <TableCell align="center">발견 날짜</TableCell>
                  <TableCell align="center">분석</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : data.length > 0 ? (
                  data.map((row, index) => (
                    <TableRow key={row.rcId}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">확인 전</TableCell>
                      <TableCell align="center">{row.cctvId}</TableCell>
                      <TableCell align="center">{row.length ?? "-"}</TableCell>
                      <TableCell align="center">{row.area ?? "-"}</TableCell>
                      <TableCell align="center">
                        {row.imageUrl ? (
                          <img
                            src={row.imageUrl}
                            alt="이상 이미지"
                            width={60}
                            height={40}
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="center">{row.detectedDate}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            navigate(`predict/${row.rcId}`, { state: { crackInfo: row } })
                          }
                        >
                          상세 분석
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default RunwayCrack;