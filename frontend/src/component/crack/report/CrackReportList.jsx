import React, { useEffect, useMemo, useState } from "react";
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
  Button,
  Stack,
  Chip,
  Divider,
  Skeleton,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import api from "../../../config/api";

export default function CrackReportList() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // 검색/필터 상태
  const [q, setQ] = useState("");               // 제목 검색
  const [dateFrom, setDateFrom] = useState(""); // yyyy-mm-dd
  const [dateTo, setDateTo] = useState("");     // yyyy-mm-dd

  // 마스킹
  const maskEmployeeId = (employeeId) => {
    if (!employeeId && employeeId !== 0) return "-";
    const strId = String(employeeId);
    if (strId.length <= 4) return "*".repeat(strId.length);
    return "****" + strId.substring(4);
  };

  const fmtDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "-";
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
      dt.getDate()
    ).padStart(2, "0")}`;
  };

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

  useEffect(() => {
    fetchReports();
  }, []);

  // 최신 작성일 기준 정렬
  const sorted = useMemo(() => {
    return [...reports].sort((a, b) => {
      const da = new Date(a.writingDate || 0).getTime();
      const db = new Date(b.writingDate || 0).getTime();
      return db - da;
    });
  }, [reports]);

  // 디바운스된 검색어
  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 250);
    return () => clearTimeout(t);
  }, [q]);

  // 필터링 (제목 + 날짜)
  const filtered = useMemo(() => {
    return sorted.filter((r) => {
      if (debouncedQ) {
        const title = (r.title || "").toLowerCase();
        if (!title.includes(debouncedQ.toLowerCase())) return false;
      }
      if (dateFrom) {
        const d = new Date(r.writingDate || 0).getTime();
        const from = new Date(dateFrom + "T00:00:00").getTime();
        if (d < from) return false;
      }
      if (dateTo) {
        const d = new Date(r.writingDate || 0).getTime();
        const to = new Date(dateTo + "T23:59:59").getTime();
        if (d > to) return false;
      }
      return true;
    });
  }, [sorted, debouncedQ, dateFrom, dateTo]);

  const clearFilters = () => {
    setQ("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f6f7fb", minHeight: "100vh" }}>
      {/* 헤더/툴바 */}
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          p: 2,
          border: "1px solid",
          borderColor: "#e5e7eb",
          bgcolor: "#fff",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827" }}>
              활주로 파손 보고서 목록
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
              공항 시설관리팀 내부 문서입니다.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            <Chip
              label={`총 ${reports.length}건 / 표시 ${filtered.length}건`}
              size="small"
              sx={{ bgcolor: "#f3f4f6", borderRadius: "9999px", fontWeight: 600 }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchReports}
              disabled={loading}
              sx={{ borderColor: "#e5e7eb", color: "#374151" }}
            >
              새로고침
            </Button>
          </Stack>
        </Stack>

        {/* 검색/필터 바 */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ mt: 2 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="제목 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: q ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setQ("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
          <TextField
            size="small"
            type="date"
            label="작성일(시작)"
            InputLabelProps={{ shrink: true }}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            sx={{ minWidth: 180 }}
          />
          <TextField
            size="small"
            type="date"
            label="작성일(종료)"
            InputLabelProps={{ shrink: true }}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            sx={{ minWidth: 180 }}
          />

          <Tooltip title="필터 초기화">
            <span>
              <Button
                variant="text"
                size="small"
                onClick={clearFilters}
                disabled={!q && !dateFrom && !dateTo}
              >
                초기화
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Paper>

      {/* 표 */}
      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "#e5e7eb", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 560 }}>
          <Table stickyHeader size="small" aria-label="crack-report-table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#fafafa" }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: "#fafafa" }}>제목</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#fafafa" }}>작성일자</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#fafafa" }}>작성자 ID</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: "#fafafa" }}>상세보기</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell align="center"><Skeleton variant="text" width={14} /></TableCell>
                    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" width={60} sx={{ mx: "auto" }} /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" width={80} sx={{ mx: "auto" }} /></TableCell>
                    <TableCell align="center"><Skeleton variant="rounded" width={72} height={28} sx={{ mx: "auto" }} /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ color: "#6b7280", mb: 1.5 }}>
                      조건에 맞는 보고서가 없습니다.
                    </Typography>
                    <Divider sx={{ width: 200, mx: "auto", mb: 1 }} />
                    <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                      검색어/날짜 범위를 조정해 보세요.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((report, idx) => (
                  <TableRow
                    key={report.rcReportid || `${report.title}-${idx}`}
                    hover
                    sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f9fafb" } }}
                    onClick={() => navigate(`/crack/report/${report.rcReportid}`)}
                  >
                    <TableCell align="center">{idx + 1}</TableCell>
                    <TableCell sx={{ maxWidth: 560 }}>
                      <Typography noWrap title={report.title || "제목 없음"} sx={{ fontWeight: 600, color: "#111827" }}>
                        {report.title || "제목 없음"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{fmtDate(report.writingDate)}</TableCell>
                    <TableCell align="center">{maskEmployeeId(report.employeeId)}</TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/crack/report/${report.rcReportid}`)}
                        sx={{ textTransform: "none", boxShadow: "none", borderRadius: "10px", fontWeight: 600 }}
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