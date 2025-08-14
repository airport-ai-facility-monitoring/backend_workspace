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
  const fetchAndSaveData = async () => {
    try {
      setLoading(true);

      // 1. 감지 데이터 가져오기
      const res = await api.get("/api/runwaycracksDetect", {
        params: { mpp: 0.01, stride: 2 },
      });

      console.log("감지결과:", res.data);

      // 2. 프론트 표시용 변환
      const newItems = res.data.saved.map(item => ({
        rcId: item.timestamp,
        imageUrl: item.image_path ? `${item.image_path}` : null,
        cctvId: item.track_ids[0] || null, // 첫 번째 ID만 저장 (Long 변환 가능)
        lengthCm: parseFloat((item.length_m ).toFixed(1)),
        areaCm2: parseFloat((item.area_m2).toFixed(1)),
        detectedDate: item.timestamp,
        reportState: false,
      }));
  
      // 3. DB 저장 (백엔드에서 필요한 필드만 전송)
      const savePromises = newItems.map(item =>
        api.post("/runwaycracks", {
          imageUrl: item.imageUrl || "", // null 방지
          cctvId: Number(item.cctvId) || 0, // 숫자로 변환
          lengthCm: Number(item.lengthCm) || 0,
          areaCm2: Number(item.areaCm2) || 0
        })
      );


      await Promise.all(savePromises);

      // 4. 저장 후 전체 목록 재조회
      const listRes = await api.get("/runwaycracks");
      setData(listRes.data);

    } catch (err) {
      console.error("데이터 처리 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAndSaveData();
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
                  <TableCell align="center">파손 길이 (m)</TableCell>
                  <TableCell align="center">파손 면적 (m²)</TableCell>
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
                      <TableCell align="center">{row.lengthCm ?? "-"}</TableCell>
                      <TableCell align="center">{row.areaCm2 ?? "-"}</TableCell>
                      <TableCell align="center">
                        {row.imageUrl ? (
                          <img
                            src={ "https://airportfrontendstorage.blob.core.windows.net/videos/20250814-082611.jpg"} //row.imageUrl}
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