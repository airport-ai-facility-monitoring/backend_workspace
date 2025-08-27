import React, { useState } from "react";
import Badge from "@mui/icons-material/Badge";
import Lock from "@mui/icons-material/Lock";
import RadarIcon from "@mui/icons-material/Radar";
import MapIcon from "@mui/icons-material/Map";
import AssessmentIcon from "@mui/icons-material/Assessment";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import api from "../../config/api";
import RECAPTCHA_SITE_KEY from "../../config/recaptchaConfig";

/** 기능 아이템: 중앙 정렬 박스 + 왼쪽 정렬 텍스트 (더 작게) */
const Feature = ({ icon: Icon, title, desc }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="flex-start"
    sx={{ justifyContent: "center" }}
  >
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        bgcolor: "rgba(255,255,255,0.14)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        mt: 0.2,
      }}
      aria-hidden
    >
      <Icon sx={{ color: "white", fontSize: 20 }} />
    </Box>
    <Box sx={{ maxWidth: 260, textAlign: "left" }}>
      <Typography sx={{ color: "white", fontWeight: 700, fontSize: 13 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.86)", fontSize: 11, mt: 0.25 }}>
        {desc}
      </Typography>
    </Box>
  </Stack>
);

export default function Login() {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openAbout, setOpenAbout] = useState(false);
  const [openDocs, setOpenDocs] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      if (!window.grecaptcha) throw new Error("reCAPTCHA 스크립트가 로드되지 않았습니다.");
      const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "login" });

      const res = await api.post("/users/login/jwt", { employeeId, password, recaptchaToken });
      const token = res.data.accessToken;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("employeeId", employeeId);
      navigate(res.data.role === "ADMIN" ? "/admin" : "/home");
    } catch (err) {
      console.error("로그인 실패:", err);

      if (err.response?.status === 403 || err.response?.status === 401) {
        // 세미 로그인 관련 메시지
        setError(err.response.data.error);
      } else {
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.";
        setError(msg);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(1200px 600px at 20% -10%, #3057ff 0%, rgba(33,72,192,0.85) 45%, #2148c0 70%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.9))",
          pointerEvents: "none",
        },
      }}
    >
      {/* ===== HERO (모두 중앙 정렬) ===== */}
      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 8 }, pb: { xs: 2, md: 3 }, position: "relative", zIndex: 1 }}>
        <Stack alignItems="center" spacing={2} sx={{ textAlign: "center" }}>
          <Chip
            label="AIRPORT OPERATIONS • AI POWERED"
            size="small"
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.55)",
              bgcolor: "rgba(255,255,255,0.08)",
              fontWeight: 700,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              color: "white",
              fontWeight: 900,
              letterSpacing: -0.6,
              lineHeight: 1.05,
              fontSize: { xs: 34, md: 48 },
            }}
          >
            PRINCESS AIRPORTS SERVICE
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.92)",
              fontSize: { xs: 15.5, md: 17 },
              lineHeight: 1.6,
              maxWidth: 900,
            }}
          >
            실시간 <b>활주로 이상 탐지</b>부터 <b>장비 유지보수 비용 예측</b>까지,
            공항 운영을 위한 <b>AI 통합 모니터링 대시보드</b>.
          </Typography>

          {/* 소개/기능 요약 버튼(모달) */}
          <Stack direction="row" spacing={1.2}>
            <Button
              size="small"
              onClick={() => setOpenAbout(true)}
              startIcon={<InfoOutlinedIcon />}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.6)",
                borderWidth: 1,
                borderStyle: "solid",
                bgcolor: "rgba(255,255,255,0.06)",
                minWidth: 112,        // ✅ 버튼 최소 너비
                px: 2,                // ✅ 좌우 패딩
                "& .MuiButton-startIcon": { mr: 0.6 }, // 아이콘-텍스트 간격
                borderRadius: 1.2,
                "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
              }}
            >
              서비스 소개
            </Button>

            <Button
              size="small"
              onClick={() => setOpenDocs(true)}
              startIcon={<PlayArrowIcon />}
              sx={{
                color: "#2148c0",
                bgcolor: "white",
                fontWeight: 800,
                minWidth: 112,        // ✅ 버튼 최소 너비
                pl: 1.8, pr: 2.6,     // ✅ 오른쪽 여백 조금 더
                "& .MuiButton-startIcon": { mr: 0.6 }, // 아이콘-텍스트 간격
                borderRadius: 1.2,
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              기능 요약
            </Button>
          </Stack>

          {/* 기능 하이라이트: 중앙 정렬 + 텍스트 왼쪽 정렬 (4개, 한 줄) */}
          <Grid
            container
            spacing={{ xs: 2, md: 2.4 }}
            sx={{ maxWidth: 1000, mx: "auto", mt: 1 }}
            justifyContent="center"
          >
            <Grid item xs={12} sm={6} md={3}>
              <Feature
                icon={RadarIcon}
                title="활주로 이상 객체 탐지"
                desc="실시간 이상 객체 탐지 및 분류ㆍ맞춤형 알림"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Feature
                icon={RadarIcon}
                title="활주로 노면 손상 탐지"
                desc="실시간 균열 탐지 및 수리기간ㆍ비용 예측"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Feature
                icon={AssessmentIcon}
                title="장비 유지보수 비용 예측"
                desc="유지보수 비용 예측ㆍ유사 장비 추천"
              />
            </Grid>

            {/* 공지/보고서 관리: 아이콘을 AssessmentIcon으로 통일 */}
            <Grid item xs={12} sm={6} md={3}>
              <Feature
                icon={AssessmentIcon}
                title="보고서 자동 생성"
                desc="LLM 기반 종합 보고서 생성"
              />
            </Grid>
          </Grid>
        </Stack>
      </Container>

      {/* ===== LOGIN (가운데 카드, 비율 유지 확장: 302→340px / 45→50px) ===== */}
      <Container maxWidth="lg" sx={{ pb: { xs: 5, md: 7 }, position: "relative", zIndex: 1 }}>
        <Stack alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 340,               // ⬆️ 약 12% 확장 (비율 유지)
              borderRadius: 2,
              p: 3,
              bgcolor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.25)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Stack spacing={2}>
              <Typography
                variant="subtitle1"
                align="center"
                sx={{ color: "white", fontWeight: 800, letterSpacing: 0.5 }}
              >
                로그인
              </Typography>

              <TextField
                fullWidth
                placeholder="EMPLOYEE ID NUMBER"
                variant="outlined"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                InputProps={{
                  startAdornment: <Badge sx={{ mr: 1, color: "white" }} />,
                }}
                autoComplete="username"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    height: 50,                   // ⬆️ 45 → 50
                    "& fieldset": { borderColor: "rgba(255,255,255,0.7)", borderRadius: 1 },
                    "&:hover fieldset": { borderColor: "white" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(255,255,255,0.9)",
                    opacity: 1,
                    fontSize: "0.9rem",
                  },
                }}
              />

              <TextField
                fullWidth
                placeholder="PASSWORD"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: "white" }} />,
                }}
                autoComplete="current-password"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    height: 50,                   // ⬆️ 45 → 50
                    "& fieldset": { borderColor: "rgba(255,255,255,0.7)", borderRadius: 1 },
                    "&:hover fieldset": { borderColor: "white" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(255,255,255,0.9)",
                    opacity: 1,
                    fontSize: "0.9rem",
                  },
                }}
              />

              {error && (
                <Typography color="error" variant="body2" align="center">
                  {error}
                </Typography>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={handleLogin}
                sx={{
                  height: 50,                     // ⬆️ 45 → 50
                  borderRadius: 1,
                  bgcolor: "white",
                  color: "#2148c0",
                  fontWeight: 700,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                LOGIN
              </Button>

              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate("/signup/privacy-consent")}
                sx={{
                  height: 50,                     // ⬆️ 45 → 50
                  borderRadius: 1,
                  bgcolor: "rgba(255,255,255,0.95)",
                  color: "#2148c0",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "white" },
                }}
              >
                SIGN UP
              </Button>

              <Box sx={{ textAlign: "right" }}>
                <Button
                  component={RouterLink}
                  to="/reset-password"
                  size="small"
                  sx={{
                    color: "white",
                    textDecoration: "underline",
                    "&:hover": { color: "#a8c1ff" },
                  }}
                >
                  비밀번호 재설정
                </Button>
              </Box>
            </Stack>
          </Box>

          <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 12, textAlign: "center" }}>
            © 2025 Princess Airports Service • Authorized Personnel Only • All activities are logged.
          </Typography>
        </Stack>
      </Container>

      {/* ===== MODALS ===== */}
      <Dialog open={openAbout} onClose={() => setOpenAbout(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>서비스 소개</DialogTitle>
        <DialogContent dividers sx={{ lineHeight: 1.7 }}>
          PRINCESS AIRPORTS SERVICE는 공항 운영·안전을 위한 AI 통합 플랫폼입니다.<br />
          한 화면에서 이상 탐지, 지도·히트맵 시각화, 노면 손상 분석과 수리 예측, 장비 유지보수 보고서까지 제공합니다.<br /><br />
          
          • 통합 모니터링 대시보드: 구역·시간대별 이상 패턴 시각화<br />
          • 공항 지도·히트맵: 공간 기반 탐지 결과 시각화<br />
          • 실시간 이상객체 탐지: FOD/조류/동물/작업자/차량/수신호/충돌위험 등 맞춤형 알림<br />
          • 실시간 날씨 확인: API 기반 기온·풍속·강수 등 조회<br />
          • 활주로 노면 손상 탐지: 실시간 균열 탐지 및 수리기간·수리비용 예측<br />
          • 장비 유지보수: 입력값 기반 비용 예측, 교체 권고 및 대체 품목 제안<br />
          • 보고서 자동 생성: 노면 손상·장비 유지보수 종합 보고서 생성<br />
          • 공지/기록 관리: 파일 업로드, 이력 관리, 권한 기반 접근 제어<br /><br />
          
          <strong>[AI 기능]</strong><br />
          - 활주로 이상 객체 탐지·분류(이미지/영상): 딥러닝 기반 실시간 탐지·분류, 객체 유형별 경고 및 관련 부서 호출 권고, 인가 인원/작업 시간 위반 시 즉시 알림<br />
          - 노면 손상 자동 탐지 &amp; 보고(이미지/영상·회귀·LLM): 드론/CCTV 영상에서 균열 분할 → 길이·면적 산출 → 수리기간·비용 예측 → LLM 기반 이상 탐지 보고서 자동 생성<br />
          - 장비 유지보수 비용 예측 &amp; 권고(회귀·LLM): 장비 정보·추가 변수 입력 → 유지보수 비용 예측 → 유사/대체 품목 제안 → LLM 기반 조치 권고(유지·폐기·신규 매입) 보고서 작성
          </DialogContent>
      </Dialog>

      <Dialog open={openDocs} onClose={() => setOpenDocs(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>기능 요약</DialogTitle>
        <DialogContent dividers sx={{ lineHeight: 1.7 }}>
          • 통합 모니터링 대시보드: 구역·시간대별 이상 패턴 시각화<br />
          • 실시간 이상객체 탐지: FOD/조류/동물/작업자/차량 유형 등 맞춤형 알림<br />
          • 실시간 날씨 확인 : API를 통한 실시간 날씨(기온,풍속,강수 등) 확인<br />
          • 활주로 노면 손상 탐지: 실시간 활주로 균열 탐지 및 수리기간/수리비용 예측<br />
          • 장비 유지보수: 입력값 기반 비용 예측, 교체 권고 및 대체 품목 제안<br />
	        • 보고서 자동 생성: 활주로 노면 손상 및 장비 유지보수 종합 보고서 생성<br />	
          • 공지 사항: 파일 업로드, 기록 관리, 권한 기반 접근 제어
        </DialogContent>
      </Dialog>
    </Box>
  );
}