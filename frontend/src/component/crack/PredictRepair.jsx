import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AssessmentIcon from "@mui/icons-material/Assessment";
import api from "../../config/api";

/** 포맷 유틸 */
const fmtNum = (n, digits = 1) =>
  Number.isFinite(Number(n)) ? Number(Number(n).toFixed(digits)).toLocaleString() : "-";
const cmToM = (cm) =>
  Number.isFinite(Number(cm)) ? fmtNum(Number(cm) / 100, 2) : "-";
const cm2ToM2 = (cm2) =>
  Number.isFinite(Number(cm2)) ? fmtNum(Number(cm2) / 10000, 2) : "-";

const PredictRepair = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { crackInfo } = location.state || {};

  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [inputs, setInputs] = useState({
    pavement_type_concrete: 0,
    epoxy_used: 0,
    wiremesh_used: 0,
    joint_seal_used: 0,
    rebar_used: 0,
    polymer_used: 0,
    sealing_used: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: parseInt(value, 10),
    }));
  };

  const handlePredict = async () => {
    if (!crackInfo) {
      alert("손상 정보를 찾을 수 없습니다.");
      return;
    }
    const payload = {
      lengthCm: crackInfo.lengthCm ?? 10.0,
      areaCm2: crackInfo.areaCm2 ?? 10.0,
      pavementTypeConcrete: inputs.pavement_type_concrete,
      epoxyUsed: inputs.epoxy_used,
      wiremeshUsed: inputs.wiremesh_used,
      jointSealUsed: inputs.joint_seal_used,
      rebarUsed: inputs.rebar_used,
      polymerUsed: inputs.polymer_used,
      sealingUsed: inputs.sealing_used,
    };

    try {
      setLoading(true);
      const res = await api.post(`/runwaycrackreports/predict/${id}`, payload);
      setPredictionResult(res.data);
    } catch (err) {
      console.error("[PREDICT] error:", err);
      alert("예측 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleReportGenerate = async () => {
    if (!predictionResult) {
      alert("먼저 예측을 시작하여 예측 결과를 받아야 합니다.");
      return;
    }
    try {
      setReportLoading(true);
      const payload = {
        pavementTypeConcrete: inputs.pavement_type_concrete,
        epoxyUsed: inputs.epoxy_used,
        wiremeshUsed: inputs.wiremesh_used,
        jointSealUsed: inputs.joint_seal_used,
        rebarUsed: inputs.rebar_used,
        polymerUsed: inputs.polymer_used,
        sealingUsed: inputs.sealing_used,
        predictedCost: predictionResult.cost,
        predictedDuration: predictionResult.duration,
      };
      const res = await api.post(`/runwaycrackreports/analyze/${id}`, payload);
      const newReportId = res.data.rcReportId; // 서버에서 rcReportId 반환
      alert("보고서가 성공적으로 생성되었습니다.");
      navigate(`/crack/report/${newReportId}`);
    } catch (err) {
      console.error("[REPORT] error:", err);
      alert("보고서 생성 중 오류가 발생했습니다.");
    } finally {
      setReportLoading(false);
    }
  };

  const handleDeleteCrack = async () => {
    if (!window.confirm("정말 이 손상 내역을 삭제하시겠습니까?")) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/runwaycracks/${id}`);
      alert("손상 내역이 삭제되었습니다.");
      navigate("/crack");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        alert("해당 손상의 보고서가 먼저 삭제되어야 합니다.");
      } else if (status === 404) {
        alert("이미 삭제되었거나 존재하지 않는 손상입니다.");
        navigate("/crack");
      } else {
        alert("삭제 중 오류가 발생했습니다.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!crackInfo) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">데이터를 찾을 수 없습니다.</Typography>
        <Button
          startIcon={<ArrowBackIosNewIcon />}
          onClick={() => window.history.back()}
          sx={{ mt: 2 }}
        >
          뒤로 가기
        </Button>
      </Box>
    );
  }

  const statusChip = (
    <Chip
      size="small"
      label={crackInfo.reportState ? "보고서 완료" : "확인 전"}
      color={crackInfo.reportState ? "success" : "default"}
      variant={crackInfo.reportState ? "filled" : "outlined"}
    />
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f6fe" }}>
      <Box sx={{ maxWidth: "1280px", mx: "auto", p: { xs: 2, md: 3 } }}>
        {/* Breadcrumb + 헤더 */}
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 1, flexWrap: "wrap" }}>
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
          <NavigateNextIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="primary" fontWeight="bold">
            상세 분석
          </Typography>
        </Stack>

        <Paper
          sx={{
            p: 2,
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            border: "1px solid #e5e7eb",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" fontWeight={800}>
              활주로 손상 상세
            </Typography>
            {statusChip}
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIosNewIcon />}
              onClick={() => navigate("/crack")}
            >
              뒤로
            </Button>

            <Tooltip
              title={
                crackInfo.reportState
                  ? "보고서가 생성되어 손상 삭제가 비활성화되었습니다. 먼저 보고서를 삭제하세요."
                  : ""
              }
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  disabled={crackInfo.reportState || deleteLoading}
                  onClick={handleDeleteCrack}
                >
                  {deleteLoading ? <CircularProgress size={18} /> : "손상 삭제"}
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Paper>

        {/* 본문 */}
        <Grid container spacing={3}>
          {/* 좌측: 기본 손상 정보 */}
          <Grid item xs={12} lg={6}>
            <Paper
              sx={{
                p: 3,
                minHeight: 520,
                display: "flex",
                flexDirection: "column",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography variant="h6" gutterBottom>
                기본 손상 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1.5} sx={{ flex: 1 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    CCTV ID
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {crackInfo.cctvId ?? "-"}
                  </Typography>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      파손 길이
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {fmtNum(crackInfo.lengthCm)} cm
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        ({cmToM(crackInfo.lengthCm)} m)
                      </Typography>
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      파손 면적
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {fmtNum(crackInfo.areaCm2)} cm²
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        ({cm2ToM2(crackInfo.areaCm2)} m²)
                      </Typography>
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    발견 날짜
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {crackInfo.detectedDate ?? "-"}
                  </Typography>
                </Box>

                {crackInfo.imageUrl && (
                  <Box sx={{ mt: 1, textAlign: "center" }}>
                    <img
                      src={crackInfo.imageUrl}
                      alt="손상 이미지"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        maxHeight: 320,
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* 우측: 추가 입력 + 예측/보고서 */}
          <Grid item xs={12} lg={6}>
            <Paper
              sx={{
                p: 3,
                minHeight: 520,
                display: "flex",
                flexDirection: "column",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography variant="h6" gutterBottom>
                추가 수리 정보 입력
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {/* 포장재(콘크리트) */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    포장재 종류 (콘크리트)
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="pavement_type_concrete"
                      value={inputs.pavement_type_concrete}
                      onChange={handleInputChange}
                      sx={{ height: 44 }}
                    >
                      <MenuItem value={0}>❌ 사용 안 함</MenuItem>
                      <MenuItem value={1}>✅ 사용</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* 재료/공법 */}
                {[
                  ["epoxy_used", "에폭시"],
                  ["wiremesh_used", "와이어메시"],
                  ["joint_seal_used", "줄눈 실링"],
                  ["rebar_used", "철근"],
                  ["polymer_used", "폴리머"],
                  ["sealing_used", "실링"],
                ].map(([key, label]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {label}
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        name={key}
                        value={inputs[key]}
                        onChange={handleInputChange}
                        sx={{ height: 44 }}
                      >
                        <MenuItem value={0}>❌ 사용 안 함</MenuItem>
                        <MenuItem value={1}>✅ 사용</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>

              {/* 액션 */}
              <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handlePredict}
                  disabled={loading}
                  sx={{ minWidth: 120, height: 42 }}
                >
                  {loading ? <CircularProgress size={22} /> : "예측 시작"}
                </Button>
              </Stack>

              {/* 예측 결과 박스 */}
              {predictionResult && (
                <Paper
                  elevation={0}
                  sx={{
                    mt: 3,
                    p: 2.5,
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <AssessmentIcon fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      예측 결과
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        예상 수리 비용
                      </Typography>
                      <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700 }}>
                        {Number.isFinite(predictionResult?.cost)
                          ? `${fmtNum(predictionResult.cost, 1)} 원`
                          : "- 원"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        예상 수리 기간
                      </Typography>
                      <Typography variant="h6" sx={{ color: "secondary.main", fontWeight: 700 }}>
                        {Number.isFinite(predictionResult?.duration)
                          ? `${fmtNum(predictionResult.duration, 1)} 일`
                          : "- 일"}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Stack alignItems="center" sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={handleReportGenerate}
                      disabled={reportLoading}
                      sx={{ minWidth: 160, height: 44, fontWeight: 700 }}
                    >
                      {reportLoading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          생성중...
                        </>
                      ) : (
                        "📊 보고서 생성"
                      )}
                    </Button>
                  </Stack>
                </Paper>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PredictRepair;