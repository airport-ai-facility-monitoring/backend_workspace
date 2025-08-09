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
  InputLabel,
  FormControl,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import api from "../../config/api";

const PredictRepair = () => {
  const { rcId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { crackInfo } = location.state || {};

  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

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

    try {
      setLoading(true);
      const payload = {
        ...crackInfo,
        ...inputs,
      };

      // 🚀 예측 API 호출 (백엔드가 준비되면 이 부분을 활성화)
      // const res = await api.post(`/runwaycrackreports/predict/${rcId}`, payload);
      // setPredictionResult(res.data);

      // 임시 더미 예측 결과
      setTimeout(() => {
        setPredictionResult({
          predictedCost: 1500000,
          predictedDuration: 5,
        });
        setLoading(false);
      }, 1500);

    } catch (err) {
      console.error("예측 실패", err);
      alert("예측 중 오류 발생");
      setLoading(false);
    }
  };

  // 🚀 2. 보고서 생성 요청
  const handleReportGenerate = async () => {
    try {
      setReportLoading(true);
      await api.post(`/runwaycrackreports/analyze/${rcId}`);
      alert("보고서가 성공적으로 생성되었습니다.");
      // 보고서 페이지로 자동 이동
      navigate(`/crack/report/${rcId}`);
    } catch (err) {
      console.error("보고서 생성 실패", err);
      alert("보고서 생성 중 오류 발생");
    } finally {
      setReportLoading(false);
    }
  };

  if (!crackInfo) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">데이터를 찾을 수 없습니다.</Typography>
        <Button onClick={() => window.history.back()} sx={{ mt: 2 }}>뒤로 가기</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f6fe" }}>
      <Box sx={{ maxWidth: "1400px", mx: "auto", p: { xs: 2, md: 3 } }}>
        {/* Breadcrumb */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          py: 2, 
          gap: 0.5,
          flexWrap: "wrap"
        }}>
          <Typography variant="body2" color="text.secondary">Welcome</Typography>
          <NavigateNextIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="primary" fontWeight="bold">Dashboard</Typography>
          <NavigateNextIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="primary" fontWeight="bold">Crack</Typography>
          <NavigateNextIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="primary" fontWeight="bold">상세 분석</Typography>
        </Box>

        {/* 손상 정보 및 예측 폼 섹션 */}
        <Grid container spacing={3}>
          {/* 좌측: 기본 손상 정보 */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ 
              p: 3, 
              minHeight: "500px",
              display: "flex",
              flexDirection: "column"
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                기본 손상 정보
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    CCTV ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, fontWeight: 500 }}>
                    {crackInfo.cctvId}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    파손 길이
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, fontWeight: 500 }}>
                    {crackInfo.length ?? '-'} cm
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    파손 면적
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, fontWeight: 500 }}>
                    {crackInfo.area ?? '-'} cm²
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    발견 날짜
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, fontWeight: 500 }}>
                    {crackInfo.detectedDate}
                  </Typography>
                </Box>

                {crackInfo.imageUrl && (
                  <Box sx={{ textAlign: "center" }}>
                    <img 
                      src={crackInfo.imageUrl} 
                      alt="손상 이미지" 
                      style={{ 
                        maxWidth: '100%', 
                        height: 'auto', 
                        maxHeight: '300px',
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        objectFit: 'contain'
                      }} 
                    />
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* 우측: 추가 입력 폼 및 예측 결과 */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ 
              p: 3, 
              minHeight: "500px",
              display: "flex", 
              flexDirection: "column" 
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                추가 수리 정보 입력
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ flex: 1 }}>
                <Grid container spacing={3}>
                  {/* 각 필드를 개별 박스로 감싸서 여유 공간 확보 */}
                  <Grid item xs={12}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                        포장재 종류 (콘크리트)
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          name="pavement_type_concrete"
                          value={inputs.pavement_type_concrete}
                          onChange={handleInputChange}
                          displayEmpty
                          sx={{ height: '45px' }}
                        >
                          <MenuItem value={0}>❌ 사용 안 함</MenuItem>
                          <MenuItem value={1}>✅ 사용</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                        에폭시
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          name="epoxy_used"
                          value={inputs.epoxy_used}
                          onChange={handleInputChange}
                          displayEmpty
                          sx={{ height: '45px' }}
                        >
                          <MenuItem value={0}>❌ 사용 안 함</MenuItem>
                          <MenuItem value={1}>✅ 사용</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                        와이어메시
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          name="wiremesh_used"
                          value={inputs.wiremesh_used}
                          onChange={handleInputChange}
                          displayEmpty
                          sx={{ height: '45px' }}
                        >
                          <MenuItem value={0}>❌ 사용 안 함</MenuItem>
                          <MenuItem value={1}>✅ 사용</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                        줄눈 실링
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          name="joint_seal_used"
                          value={inputs.joint_seal_used}
                          onChange={handleInputChange}
                          displayEmpty
                          sx={{ height: '45px' }}
                        >
                          <MenuItem value={0}>❌ 사용 안 함</MenuItem>
                          <MenuItem value={1}>✅ 사용</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                        철근
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          name="rebar_used"
                          value={inputs.rebar_used}
                          onChange={handleInputChange}
                          displayEmpty
                          sx={{ height: '45px' }}
                        >
                          <MenuItem value={0}>❌ 사용 안 함</MenuItem>
                          <MenuItem value={1}>✅ 사용</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                        폴리머
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          name="polymer_used"
                          value={inputs.polymer_used}
                          onChange={handleInputChange}
                          displayEmpty
                          sx={{ height: '45px' }}
                        >
                          <MenuItem value={0}>❌ 사용 안 함</MenuItem>
                          <MenuItem value={1}>✅ 사용</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                        실링
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          name="sealing_used"
                          value={inputs.sealing_used}
                          onChange={handleInputChange}
                          displayEmpty
                          sx={{ height: '45px' }}
                        >
                          <MenuItem value={0}>❌ 사용 안 함</MenuItem>
                          <MenuItem value={1}>✅ 사용</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, textAlign: "right" }}>
                  <Button
                    variant="contained"
                    onClick={handlePredict}
                    disabled={loading}
                    sx={{ 
                      minWidth: "120px",
                      height: "40px"
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : "예측 시작"}
                  </Button>
                </Box>

                {predictionResult && (
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      mt: 3, 
                      p: 2.5, 
                      bgcolor: "#f8f9fa",
                      border: "1px solid #e3f2fd"
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: { xs: '1.1rem', md: '1.25rem' },
                        color: "primary.main",
                        mb: 1.5
                      }}
                    >
                      예측 결과
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        예상 수리 비용
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontSize: { xs: '1.1rem', md: '1.3rem' },
                          fontWeight: 600,
                          color: "primary.main"
                        }}
                      >
                        {predictionResult.predictedCost.toLocaleString()} 원
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        예상 수리 기간
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontSize: { xs: '1.1rem', md: '1.3rem' },
                          fontWeight: 600,
                          color: "secondary.main"
                        }}
                      >
                        {predictionResult.predictedDuration} 일
                      </Typography>
                    </Box>

                    {/* 보고서 생성 버튼 */}
                    <Box sx={{ mt: 3, textAlign: "center" }}>
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={handleReportGenerate}
                        disabled={reportLoading}
                        sx={{ 
                          minWidth: "150px",
                          height: "45px",
                          fontSize: "1rem",
                          fontWeight: 600
                        }}
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
                    </Box>
                  </Paper>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PredictRepair;