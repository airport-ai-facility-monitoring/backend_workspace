import React, { useState } from "react";
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
import api from "../../config/api"; // API 호출 경로 맞게 조정

const ResetPassword = () => {
  const navigate = useNavigate();

  // 기존 상태 유지 + employeeId 추가
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async () => {
    setError("");
    setSuccess("");

    if (!employeeId) {
      setError("사원번호를 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호와 확인이 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자리 이상이어야 합니다.");
      return;
    }

    try {
      await api.post("/users/reset-password", { employeeId, password });

      setSuccess("비밀번호가 성공적으로 변경되었습니다.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "비밀번호 재설정에 실패했습니다.";
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
            비밀번호 재설정
          </Typography>

          {/* employeeId 입력 필드 추가 */}
          <TextField
            fullWidth
            placeholder="사원번호"
            variant="outlined"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
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

          {/* 기존 비밀번호 입력 필드 */}
          <TextField
            fullWidth
            placeholder="새 비밀번호"
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

          <TextField
            fullWidth
            placeholder="비밀번호 확인"
            type="password"
            variant="outlined"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
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

          {success && (
            <Typography color="success.main" variant="body2" align="center">
              {success}
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
            onClick={handleReset}
          >
            비밀번호 재설정
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default ResetPassword;