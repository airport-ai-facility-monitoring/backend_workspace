import React, { useState } from "react";
import Badge from "@mui/icons-material/Badge";
import Lock from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import api from "../../config/api";

// reCAPTCHA 사이트 키를 config 파일에서 가져옵니다.
import RECAPTCHA_SITE_KEY from '../../config/recaptchaConfig';

const Login = () => {
  const navigate = useNavigate();

  // 폼 상태관리
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      
      // 1. reCAPTCHA v3 토큰 생성
      // 이 코드는 public/index.html에 reCAPTCHA 스크립트가 로드되었다고 가정합니다.
      if (!window.grecaptcha) {
        throw new Error('reCAPTCHA 스크립트가 로드되지 않았습니다.');
      }
      
      // 'login' 액션으로 토큰을 생성합니다.
      // 상수로 정의된 사이트 키를 사용합니다.
      const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'login' });

      // 2. 로그인 API 호출 시 캡챠 토큰을 함께 전송
      const response = await api.post(
        "/users/login/jwt",
        {
          employeeId,
          password,
          recaptchaToken: recaptchaToken, // 캡챠 토큰을 요청 본문에 추가
        },
      );
      
      localStorage.setItem("accessToken", response.data.accessToken);
      navigate("/home"); 
    } catch (err) {
      console.error("로그인 실패:", err);
      // 서버에서 반환된 오류 메시지 또는 일반 오류 메시지 표시
      const errorMessage = err.response?.data?.message || err.message || "로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.";
      setError(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#2148c0",
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ...배경과 기타 UI 생략... */}

      <Container
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {/* ...로고 생략... */}

        <Stack spacing={2} sx={{ width: 302 }}>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              color: "white",
              fontFamily: "Montserrat-Medium, Helvetica",
              fontWeight: 500,
              mb: 1,
            }}
          >
            PRINCESS AIRPORTS SERVICE
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
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                height: 45,
                "& fieldset": {
                  borderColor: "white",
                  borderRadius: 1,
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "white",
                opacity: 1,
                fontSize: "0.875rem",
                fontFamily: "Montserrat-Light, Helvetica",
                fontWeight: 300,
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
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                height: 45,
                "& fieldset": {
                  borderColor: "white",
                  borderRadius: 1,
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "white",
                opacity: 1,
                fontSize: "0.875rem",
                fontFamily: "Montserrat-Light, Helvetica",
                fontWeight: 300,
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
            sx={{
              bgcolor: "white",
              color: "#2148c0",
              height: 45,
              borderRadius: 1,
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.3)",
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
              fontFamily: "Montserrat-SemiBold, Helvetica",
              fontWeight: 600,
              fontSize: "1rem",
            }}
            onClick={handleLogin} // 로그인 핸들러 연결
          >
            LOGIN
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/signup/privacy-consent")}
            sx={{
              bgcolor: "white",
              color: "#2148c0",
              height: 45,
              borderRadius: 1,
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.3)",
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
              fontFamily: "Montserrat-SemiBold, Helvetica",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            SIGN UP
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Login;
