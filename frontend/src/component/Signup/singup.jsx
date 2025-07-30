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
  // 사번과 비밀번호 상태 추가
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 입력 핸들러
  const handleEmployeeIdChange = (e) => setEmployeeId(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSignUp = async () => {
    try {
      const response = await api.post("/users", {
        employeeId,
        password,
      });
      alert("회원가입 성공!");
      setEmployeeId("");
      setPassword("");
      console.log(response.data)
      navigate("/login");
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert("회원가입 실패: " + (error.response.data.message || error.response.statusText));
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
      {/* Background circles */}
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

      {/* Form container */}
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
            PRINCESS AIRPORTS SERVICE
          </Typography>

          {/* 사번 입력 */}
          <TextField
            id="employee-id"
            placeholder="사번을 입력하세요"
            variant="outlined"
            fullWidth
            value={employeeId}
            onChange={handleEmployeeIdChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Badge fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                color: "white",
                borderColor: "white",
                height: "45px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "& .MuiInputAdornment-root": {
                  color: "white",
                },
              },
            }}
            sx={{
              "& .MuiInputBase-input::placeholder": {
                color: "white",
                opacity: 1,
                fontFamily: "Montserrat",
                fontWeight: 300,
                fontSize: "14px",
              },
            }}
          />

          {/* 비밀번호 입력 */}
          <TextField
            id="password"
            placeholder="비밀번호를 입력하세요"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                color: "white",
                borderColor: "white",
                height: "45px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "& .MuiInputAdornment-root": {
                  color: "white",
                },
              },
            }}
            sx={{
              "& .MuiInputBase-input::placeholder": {
                color: "white",
                opacity: 1,
                fontFamily: "Montserrat",
                fontWeight: 300,
                fontSize: "14px",
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "white",
              color: "#3150b0",
              height: "45px",
              fontFamily: "Montserrat",
              fontWeight: 600,
              fontSize: "16px",
              mt: 2,
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.3)",
            }}
            onClick={handleSignUp}
          >
            SIGN UP
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SignUp;