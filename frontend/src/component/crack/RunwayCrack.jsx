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
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import api from "../../config/api"; // api 모듈 import

const RunwayCrack = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [generatedIds, setGeneratedIds] = useState([]);

  // 🚀 1. 페이지 진입 시 이상 리스트 요청
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/runwaycracks");
        setData(res.data);
      } catch (err) {
        console.error("데이터 로딩 실패", err);
      }
    };

    fetchData();
  }, []);

  // 🚀 2. 보고서 생성 요청
  const handleReportGenerate = async (id) => {
    try {
      setLoadingId(id);
      await api.post("/runwaycracks/report", { id });

      setGeneratedIds((prev) => [...prev, id]);
    } catch (err) {
      console.error("보고서 생성 실패", err);
      alert("보고서 생성 중 오류 발생");
    } finally {
      setLoadingId(null);
    }
  };

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
          <Typography variant="h6" sx={{ mb: 1 }}>
            노선 손상 결과 진행도
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">상태</TableCell>
                  <TableCell align="center">현장</TableCell>
                  <TableCell align="center">채널</TableCell>
                  <TableCell align="center">이상</TableCell>
                  <TableCell align="center">시간</TableCell>
                  <TableCell align="center">사진</TableCell>
                  <TableCell align="center">보고서</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center">{row.site}</TableCell>
                    <TableCell align="center">{row.channel}</TableCell>
                    <TableCell align="center">{row.anomaly}</TableCell>
                    <TableCell align="center">
                      {row.date}
                      <br />
                      {row.time}
                    </TableCell>
                    <TableCell align="center">
                      <img
                        src={row.imageUrl}
                        alt="이상 이미지"
                        width={60}
                        height={40}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {generatedIds.includes(row.id) ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/report/${row.id}`)}
                        >
                          보고서 보기
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          disabled={loadingId === row.id}
                          onClick={() => handleReportGenerate(row.id)}
                        >
                          {loadingId === row.id ? "생성 중..." : "보고서 생성"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default RunwayCrack;