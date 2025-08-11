import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import api from "../../../config/api";

export default function CrackReportList() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // 간단한 마스킹 함수
  const maskEmployeeId = (employeeId) => {
    if (!employeeId) return "-";
    const strId = employeeId.toString();
    if (strId.length <= 4) return "*".repeat(strId.length);
    return "****" + strId.substring(4);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await api.get("/runwaycrackreports");
        setReports(res.data || []);
      } catch (err) {
        console.error("보고서 목록 불러오기 실패", err);
        alert("보고서 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <Box sx={{ p: 3, bgcolor: "#f3f6fe", minHeight: "100vh" }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
      >
        활주로 파손 보고서 목록
      </Typography>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">제목</TableCell>
                <TableCell align="center">작성일자</TableCell>
                <TableCell align="center">감지일자</TableCell>
                <TableCell align="center">CCTV ID</TableCell>
                <TableCell align="center">작성자 ID</TableCell>
                <TableCell align="center">상세보기</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report, idx) => (
                  <TableRow key={report.rcReportid || idx}>
                    <TableCell align="center">{idx + 1}</TableCell>
                    <TableCell align="center">{report.title || "제목 없음"}</TableCell>
                    <TableCell align="center">
                      {report.writingDate
                        ? new Date(report.writingDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      {report.detectedDate
                        ? new Date(report.detectedDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell align="center">{report.cctvId || "-"}</TableCell>
                    <TableCell align="center">{maskEmployeeId(report.employeeId)}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/crack/report/${report.rcReportid}`)}
                      >
                        상세보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}