import Badge from "@mui/icons-material/Badge";
import Lock from "@mui/icons-material/Lock";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  // 상태 관리 (id 제외 모든 필드)
  const [form, setForm] = useState({
    employeeId: "",
    password: "",
    name: "",
    department: "",
    position: "",
    hireDate: "",
    phoneNumber: "",
    email: "",
  });
  const navigate = useNavigate();

  // 입력 핸들러 (모든 필드 공통 처리)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 회원가입 요청
  const handleSignUp = async () => {
    try {
      const response = await api.post("/users", form);
      alert("회원가입 성공!");
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(
          "회원가입 실패: " +
            (error.response.data.message || error.response.statusText)
        );
      } else {
        alert("서버 통신 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: "#2148c0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 배경 원 */}
      <Box
        sx={{
          position: "absolute",
          width: "724px",
          height: "724px",
          bottom: "-359px",
          left: "-362px",
          bgcolor: "#264ec9",
          borderRadius: "50%",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "572px",
            height: "572px",
            top: "76px",
            left: "76px",
            bgcolor: "#234bc5",
            borderRadius: "50%",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "438px",
              height: "438px",
              top: "67px",
              left: "67px",
              bgcolor: "#274ec7",
              borderRadius: "50%",
            }}
          />
        </Box>
      </Box>

      {/* 폼 */}
      <Container maxWidth="sm">
        <Box
          sx={{
            width: "300px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: "white",
              fontFamily: "Montserrat",
              fontWeight: 500,
              mb: 2,
            }}
          >
            PRINCESS AIRPORTS SIGN UP
          </Typography>

          {/* 사번 */}
          <TextField
            name="employeeId"
            placeholder="사번을 입력하세요"
            variant="outlined"
            fullWidth
            value={form.employeeId}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Badge fontSize="small" />
                </InputAdornment>
              ),
              sx: inputStyle,
            }}
            sx={placeholderStyle}
          />

          {/* 비밀번호 */}
          <TextField
            name="password"
            placeholder="비밀번호를 입력하세요"
            variant="outlined"
            fullWidth
            type="password"
            value={form.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" />
                </InputAdornment>
              ),
              sx: inputStyle,
            }}
            sx={placeholderStyle}
          />

          {/* 이름 */}
          <TextField
            name="name"
            placeholder="이름"
            variant="outlined"
            fullWidth
            value={form.name}
            onChange={handleChange}
            InputProps={{ sx: inputStyle }}
            sx={placeholderStyle}
          />

          {/* 부서 */}
          <TextField
            name="department"
            placeholder="부서"
            variant="outlined"
            fullWidth
            value={form.department}
            onChange={handleChange}
            InputProps={{ sx: inputStyle }}
            sx={placeholderStyle}
          />

          {/* 직책 */}
          <TextField
            name="position"
            placeholder="직책"
            variant="outlined"
            fullWidth
            value={form.position}
            onChange={handleChange}
            InputProps={{ sx: inputStyle }}
            sx={placeholderStyle}
          />

          {/* 입사일 */}
          <TextField
            name="hireDate"
            type="date"
            variant="outlined"
            fullWidth
            value={form.hireDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: inputStyle }}
            sx={placeholderStyle}
          />

          {/* 전화번호 */}
          <TextField
            name="phoneNumber"
            placeholder="전화번호"
            variant="outlined"
            fullWidth
            value={form.phoneNumber}
            onChange={handleChange}
            InputProps={{ sx: inputStyle }}
            sx={placeholderStyle}
          />

          {/* 이메일 */}
          <TextField
            name="email"
            placeholder="이메일"
            type="email"
            variant="outlined"
            fullWidth
            value={form.email}
            onChange={handleChange}
            InputProps={{ sx: inputStyle }}
            sx={placeholderStyle}
          />

          <Button
            variant="contained"
            fullWidth
            sx={buttonStyle}
            onClick={handleSignUp}
          >
            SIGN UP
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{ color: "white", borderColor: "white", mt: 1 }}
            onClick={() => navigate("/login")}
          >
            BACK TO LOGIN
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

// 스타일 상수 분리
const inputStyle = {
  color: "white",
  borderColor: "white",
  height: "45px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
  "& .MuiInputAdornment-root": { color: "white" },
};

const placeholderStyle = {
  "& .MuiInputBase-input::placeholder": {
    color: "white",
    opacity: 1,
    fontFamily: "Montserrat",
    fontWeight: 300,
    fontSize: "14px",
  },
};

const buttonStyle = {
  bgcolor: "white",
  color: "#3150b0",
  height: "45px",
  fontFamily: "Montserrat",
  fontWeight: 600,
  fontSize: "16px",
  mt: 2,
  "&:hover": { bgcolor: "#f5f5f5" },
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.3)",
};

export default SignUp;