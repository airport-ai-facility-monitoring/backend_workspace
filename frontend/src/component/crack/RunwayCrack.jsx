import React, { useEffect, useMemo, useState } from "react";
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
  Chip,
  Alert,
  Stack,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import api from "../../config/api";

/** 유틸 */
const fmtDate = (d) => {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return d;
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return d;
  }
};

const RunwayCrack = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchList = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await api.get("/runwaycracks");
      setData(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr("손상 내역을 불러오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  /** 최신 발견일 순 정렬된 뷰 데이터 */
  const rows = useMemo(() => {
    return [...data].sort((a, b) => {
      const da = new Date(a.detectedDate).getTime() || 0;
      const db = new Date(b.detectedDate).getTime() || 0;
      return db - da;
    });
  }, [data]);

  /** 헤더 날짜(가장 최신 발견일 표시) */
  const latestDate = useMemo(() => {
    if (!rows.length) return "-";
    return fmtDate(rows[0].detectedDate);
  }, [rows]);

  const handleOpenReport = async (crackId) => {
    try {
      const { data } = await api.get(`/runwaycrackreports/by-crack/${crackId}`);
      navigate(`report/${data.reportId}`);
    } catch {
      alert("해당 손상의 보고서를 찾을 수 없습니다.");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f3f6fe" }}>
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
              gap: 2,
            }}
          >
            <Typography variant="h6" fontWeight={800}>
              노면 손상 내역
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ display: "flex", flexDirection: "column", width: 210 }}>
                <Typography variant="caption" color="text.secondary">
                  최신 발견일
                </Typography>
                <Typography variant="body1">{latestDate}</Typography>
                <Divider sx={{ mt: 1, bgcolor: "#1348fc" }} />
              </Box>
              <Button variant="outlined" onClick={fetchList}>
                새로고침
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Box sx={{ mx: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6">노면 손상 결과 진행도</Typography>
          </Box>

          {err && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {err}
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ maxHeight: 560 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" width={64}>
                    #
                  </TableCell>
                  <TableCell align="center" width={120}>
                    상태
                  </TableCell>
                  <TableCell align="center" width={140}>
                    현장 (CCTV ID)
                  </TableCell>
                  <TableCell align="center" width={160}>
                    파손 길이 (cm)
                  </TableCell>
                  <TableCell align="center" width={160}>
                    파손 면적 (cm²)
                  </TableCell>
                  <TableCell align="center" width={120}>
                    사진
                  </TableCell>
                  <TableCell align="center" width={160}>
                    발견 날짜
                  </TableCell>
                  <TableCell align="center" width={140}>
                    작업
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : rows.length > 0 ? (
                  rows.map((row, index) => (
                    <TableRow
                      key={row.rcId}
                      hover
                      sx={{
                        "&:nth-of-type(even)": { bgcolor: "#fafbff" },
                        cursor: "default",
                      }}
                    >
                      <TableCell align="center">{index + 1}</TableCell>

                      {/* 상태 */}
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={row.reportState ? "보고서 완료" : "확인 전"}
                          color={row.reportState ? "success" : "default"}
                          variant={row.reportState ? "filled" : "outlined"}
                        />
                      </TableCell>

                      <TableCell align="center">{row.cctvId ?? "-"}</TableCell>

                      {/* 단위: cm, cm² */}
                      <TableCell align="center">
                        {row.lengthCm != null ? `${row.lengthCm} cm` : "-"}
                      </TableCell>
                      <TableCell align="center">
                        {row.areaCm2 != null ? `${row.areaCm2} cm²` : "-"}
                      </TableCell>

                      {/* 썸네일 */}
                      <TableCell align="center">
                        {row.imageUrl ? (
                          <img
                            src={row.imageUrl}
                            alt="이상 이미지"
                            width={60}
                            height={40}
                            style={{ objectFit: "cover", borderRadius: 6 }}
                            onClick={() =>
                              row.reportState
                                ? handleOpenReport(row.rcId)
                                : navigate(`predict/${row.rcId}`, {
                                    state: { crackInfo: row },
                                  })
                            }
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell align="center">
                        {fmtDate(row.detectedDate)}
                      </TableCell>

                      <TableCell align="center">
                        {row.reportState ? (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleOpenReport(row.rcId)}
                          >
                            보고서 보기
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() =>
                              navigate(`predict/${row.rcId}`, {
                                state: { crackInfo: row },
                              })
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
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        아직 수집된 손상 데이터가 없습니다.
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        감지 후 이 화면에서 상세 분석을 진행하세요.
                      </Typography>
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