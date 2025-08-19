import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Tooltip,
  Chip,
  Divider,
} from "@mui/material";

const Alert = () => {
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialAlerts = async () => {
      try {
        const response = await api.get("/alerts");
        setAlerts(response.data.slice(0, 30));
      } catch (error) {
        console.error("Error fetching initial alerts:", error);
      }
    };

    fetchInitialAlerts();
    const interval = setInterval(fetchInitialAlerts, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRequest = (alertLog) => {
    let message = "";
    if (alertLog.includes("FOD감지")) {
      message = "[FOD감지] FOD 전담 처리반을 호출 하였습니다.";
    } else if (alertLog.includes("조류 출현")) {
      message = "[조류 출현] 조류 전담 처리반을 호출 하였습니다.";
    } else if (alertLog.includes("동물 출현")) {
      message = "[동물 출현] 동물 처리 전담반을 호출하였습니다.";
    } else {
      message = "[처리 요청] 신호를 보냈습니다.";
    }
    // UI만 변경: alert 유지
    alert(message);
  };

  const handleAlertClick = (cctvId) => {
    if (cctvId) navigate(`/dashdetail/${cctvId}`);
  };

  // ── 스타일 토큰
  const shellSx = {
    minHeight: "100vh",
    bgcolor: "rgba(243,246,254,0.8)",
    py: 4,
    px: { xs: 2.5, md: 5 },
  };

  const cardSx = {
    borderRadius: 3,
    overflow: "hidden",
    boxShadow:
      "0 4px 16px rgba(17, 24, 39, 0.06), 0 2px 4px rgba(17, 24, 39, 0.04)",
  };

  const headCellSx = {
    fontWeight: 700,
    color: "#0f172a",
    bgcolor: "rgba(19,72,252,0.06)",
    borderBottom: "1px solid rgba(2, 6, 23, 0.08)",
  };

  const dateCellSx = {
    whiteSpace: "nowrap",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas",
    color: "text.secondary",
  };

  const detailTextSx = {
    cursor: "pointer",
    maxWidth: 760,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "&:hover": { color: "#1348fc" },
  };

  const tableSx = {
    "& .MuiTableRow-root:nth-of-type(even)":
      { backgroundColor: "rgba(2, 6, 23, 0.015)" }, // 줄무늬
    "& .MuiTableCell-root": { borderBottom: "1px solid rgba(2,6,23,0.06)" },
  };

  const containerSx = {
    maxHeight: "calc(100vh - 220px)",
    "&::-webkit-scrollbar": { height: 10, width: 10 },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(2,6,23,0.2)",
      borderRadius: 8,
    },
  };

  return (
    <Box sx={shellSx}>
      {/* 브레드크럼/헤더 */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: 12, color: "text.secondary" }}
        >
          Welcome
        </Typography>
        <Divider orientation="vertical" flexItem />
        <Typography
          variant="body2"
          sx={{ fontSize: 12, fontWeight: 700, color: "#1348fc" }}
        >
          Alert
        </Typography>
      </Box>

      {/* 카드 타이틀 */}
      <Paper sx={cardSx}>
        <Box
          sx={{
            px: 3,
            py: 2.25,
            bgcolor:
              "linear-gradient(180deg, rgba(19,72,252,0.06), rgba(19,72,252,0.02))",
            borderBottom: "1px solid rgba(2,6,23,0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Latest Activities
            </Typography>
            <Chip
              label={`${alerts.length}`}
              size="small"
              sx={{
                bgcolor: "rgba(19,72,252,0.1)",
                color: "#1348fc",
                fontWeight: 700,
              }}
            />
          </Box>
        </Box>

        {/* 표 */}
        <TableContainer sx={containerSx}>
          <Table stickyHeader size="small" sx={tableSx}>
            <TableHead>
              <TableRow
                sx={{
                  "& th": headCellSx,
                }}
              >
                <TableCell sx={{ width: { md: "28%", xs: "36%" } }}>
                  Date
                </TableCell>
                <TableCell>Detail</TableCell>
                <TableCell
                  align="center"
                  sx={{ width: { md: "14%", xs: "18%" } }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {alerts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} sx={{ py: 6, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      최근 알림이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {alerts.map((row, index) => {
                const isTargetAlert =
                  row.alertLog.includes("FOD감지") ||
                  row.alertLog.includes("조류 출현") ||
                  row.alertLog.includes("동물 출현");

                return (
                  <TableRow
                    key={row.alertId || index}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(19,72,252,0.06)",
                      },
                    }}
                  >
                    <TableCell component="th" scope="row" sx={dateCellSx}>
                      {new Date(row.alertDate).toLocaleString()}
                    </TableCell>

                    <TableCell
                      onClick={() => handleAlertClick(row.cctvId)}
                      sx={{ pr: 2 }}
                    >
                      <Tooltip title={row.alertLog} arrow placement="top-start">
                        <Typography variant="body2" sx={detailTextSx}>
                          {row.alertLog}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    <TableCell align="center">
                      {isTargetAlert && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleRequest(row.alertLog)}
                          sx={{
                            px: 1.75,
                            textTransform: "none",
                            borderRadius: 2,
                            boxShadow: "none",
                          }}
                        >
                          처리 요청
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Alert;