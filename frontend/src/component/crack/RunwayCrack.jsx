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

// 🚀 1. 페이지 진입 시 더미 데이터 추가 및 리스트 요청
useEffect(() => {
  const fetchDataAndInsertDummy = async () => {
    try {
      setLoading(true);

      // 백엔드 API로 보낼 더미 데이터 정의
      const dummyData = [{
        imageUrl: "https://via.placeholder.com/150",
        cctvId: 201,
        length: 30,
        area: 150,
        detectedDate: "2025-07-18",
        reportState: false,
      }, {
        imageUrl: "https://via.placeholder.com/150",
        cctvId: 202,
        length: 50,
        area: 250,
        detectedDate: "2025-07-17",
        reportState: true,
      }];

      // 1. 더미 데이터들을 서버에 POST 요청으로 보냅니다.
      const postPromises = dummyData.map(data => api.post("/runwaycracks", data));
      await Promise.all(postPromises);
      
      // 2. POST 요청이 완료되면, 전체 데이터를 GET 요청으로 다시 가져옵니다.
      const res = await api.get("/runwaycracks");
      setData(res.data);
    } catch (err) {
      console.error("데이터 처리 중 오류 발생:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDataAndInsertDummy();
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
                  <TableCell align="center">상태</TableCell>
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
                      <TableCell align="center">
                        {row.reportState ? "보고서 완료" : "확인 전"}
                      </TableCell>
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
                        {row.reportState ? (
                          <Button
                            variant="contained"
                            color="success" // 보고서 완료 시 초록색
                            size="small"
                            onClick={() => navigate(`report/${row.rcId}`)}
                          >
                            보고서 보기
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary" // 기본 상태일 때 파란색
                            size="small"
                            onClick={() =>
                              navigate(`predict/${row.rcId}`, { state: { crackInfo: row } })
                            }
                          >
                            상세 분석
                          </Button>
                        )}
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