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
import axios from "axios";
import api from "../../api";

const Login = () => {
  const navigate = useNavigate();

  // 폼 상태관리
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      // 로그인 API 호출
      const response = await api.post(
        "/users/login/jwt",
        {
          employeeId,
          password,
        },

      );
      localStorage.setItem("accessToken", response.data.accessToken);
      navigate("/home"); 
    } catch (err) {
      console.error("로그인 실패:", err);
      setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.");
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
            onClick={() => navigate("/signup")}
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