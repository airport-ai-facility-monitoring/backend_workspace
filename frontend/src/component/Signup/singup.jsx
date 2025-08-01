import Badge from "@mui/icons-material/Badge";
import Lock from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  // 상태 관리
  const [form, setForm] = useState({
    employeeId: "",
    password: "",
    confirmPassword: "",
    name: "",
    department: "",
    position: "",
    hireDate: "",
    phoneNumber: "",
    email: "",
  });
  
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    alphanumeric: false,
    number: false,
    special: false,
    match: false,
  });

  const navigate = useNavigate();

  // 개인정보 동의 확인
  useEffect(() => {
    const consent = localStorage.getItem('privacyConsent');
    if (!consent) {
      alert('개인정보 수집·이용 동의가 필요합니다.');
      navigate('/login');
      return;
    }
  }, [navigate]);

  // 비밀번호 검증 함수
  const validatePassword = (password, confirmPassword) => {
    return {
      length: password.length >= 10 && password.length <= 16,
      alphanumeric: /[a-zA-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword && password.length > 0,
    };
  };

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    // 비밀번호 필드 변경 시 검증
    if (name === 'password' || name === 'confirmPassword') {
      const validation = validatePassword(
        name === 'password' ? value : newForm.password,
        name === 'confirmPassword' ? value : newForm.confirmPassword
      );
      setPasswordValidation(validation);
    }
  };

  // 비밀번호 표시/숨김 토글
  const handleTogglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // 회원가입 유효성 검사
    const isFormValid = () => {
      const { length, alphanumeric, number, special, match } = passwordValidation;
      const passwordValid = length && alphanumeric && number && special && match;

      const requiredFields = ['employeeId', 'password', 'confirmPassword', 'name', 'department', 'position', 'hireDate'];
      const fieldsValid = requiredFields.every(field => form[field].trim() !== '');

      return passwordValid && fieldsValid;
    };

  // 회원가입 요청
  const handleSignUp = async () => {
    if (!isFormValid()) {
      alert('모든 필수 항목을 올바르게 입력해주세요.');
      return;
    }

    try {
      // confirmPassword 제외하고 전송
      const { confirmPassword, ...submitData } = form;
      const response = await api.post("/users/signup", submitData);
      
      // 동의 정보 제거 (회원가입 완료 후)
      localStorage.removeItem('privacyConsent');
      
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
        minHeight: "100vh",
        bgcolor: "#2148c0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        py: 4,
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
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            gap: 4,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* 회원가입 폼 */}
          <Box
            sx={{
              width: "350px",
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

            <TextField
              name="password"
              placeholder="비밀번호를 입력하세요"
              variant="outlined"
              fullWidth
              type={showPassword.password ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility('password')}
                      edge="end"
                      sx={{ color: 'white' }}
                    >
                      {showPassword.password ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: inputStyle,
              }}
              sx={placeholderStyle}
            />
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5, mb: 2 }}
            >
              비밀번호는 10~16자, 영문자·숫자·특수문자 포함해야 합니다.
            </Typography>

            {!(passwordValidation.length &&
              passwordValidation.alphanumeric &&
              passwordValidation.number &&
              passwordValidation.special) && form.password.length > 0 && (
              <Typography variant="caption" sx={{ color: "red", mt: 0.5, mb: 2 }}>
                비밀번호 조건을 모두 만족해야 합니다.
              </Typography>
            )}


            {/* 비밀번호 확인 */}
            <TextField
              name="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요"
              variant="outlined"
              fullWidth
              type={showPassword.confirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility('confirmPassword')}
                      edge="end"
                      sx={{ color: 'white' }}
                    >
                      {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: inputStyle,
              }}
              sx={placeholderStyle}
            />
            {/* 비밀번호 확인이 일치하지 않으면 빨간 경고 */}
            {!passwordValidation.match && form.confirmPassword.length > 0 && (
              <Typography variant="caption" sx={{ color: "red", mt: 0.5, mb: 2 }}>
                비밀번호가 일치하지 않습니다.
              </Typography>
            )}

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
              placeholder="전화번호 (선택사항)"
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
              placeholder="이메일 (선택사항)"
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
              sx={{
                ...buttonStyle,
                opacity: isFormValid() ? 1 : 0.6,
              }}
              onClick={handleSignUp}
              disabled={!isFormValid()}
            >
              SIGN UP
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{ color: "white", borderColor: "white", mt: 1 }}
              onClick={() => navigate("/login")}
            >
              BACK TO CONSENT
            </Button>
          </Box>

        </Box>
      </Container>
    </Box>
  );
};

// 스타일 상수
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
  "&:disabled": { 
    bgcolor: "#cccccc", 
    color: "#666666" 
  },
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.3)",
};

export default SignUp;