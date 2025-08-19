import React, { useState, useMemo } from "react";
import Lock from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import api from "../../config/api";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const canRequestCode = useMemo(
    () => employeeId.trim().length > 0 && /\S+@\S+\.\S+/.test(email),
    [employeeId, email]
  );
  const canConfirm = useMemo(
    () => code.trim().length === 6 && password.length >= 6 && password === passwordConfirm,
    [code, password, passwordConfirm]
  );

  const startCooldown = (sec = 60) => {
    setCooldown(sec);
    const timer = setInterval(() => {
      setCooldown((p) => {
        if (p <= 1) { clearInterval(timer); return 0; }
        return p - 1;
      });
    }, 1000);
  };

  const handleRequestCode = async () => {
    setError(""); setSuccess("");
    if (!canRequestCode) { setError("사번/이메일을 올바르게 입력하세요."); return; }
    setLoading(true);
    try {
      await api.post("/users/password-reset/request", { employeeId, email });
      setSuccess("인증코드를 이메일로 보냈어요. 10분 내에 입력해주세요.");
      setStep(2);
      startCooldown(60);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(msg || "인증코드 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setError(""); setSuccess("");
    if (!canConfirm) { setError("6자리 코드와 6자 이상 비밀번호(일치)를 입력하세요."); return; }
    setLoading(true);
    try {
      await api.post("/users/password-reset/confirm", { employeeId, email, code, newPassword: password });
      setSuccess("비밀번호가 변경되었습니다. 잠시 후 로그인 화면으로 이동합니다.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(msg || "비밀번호 재설정 실패");
    } finally {
      setLoading(false);
    }
  };

  const commonTextFieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "white", height: 45,
      "& fieldset": { borderColor: "white", borderRadius: 1 },
      "&:hover fieldset": { borderColor: "white" },
      "&.Mui-focused fieldset": { borderColor: "white" },
    },
    "& .MuiInputBase-input::placeholder": {
      color: "white", opacity: 1, fontSize: "0.875rem",
      fontFamily: "Montserrat-Light, Helvetica", fontWeight: 300,
    },
  };

  return (
    <Box sx={{ bgcolor: "#2148c0", width: "100%", height: "100vh", display: "flex", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <Stack spacing={2} sx={{ width: 302 }}>
          <Typography variant="subtitle1" align="center" sx={{ color: "white", fontFamily: "Montserrat-Medium, Helvetica", fontWeight: 500, mb: 1 }}>
            비밀번호 재설정
          </Typography>

          {step === 1 && (
            <>
              <TextField fullWidth placeholder="사원번호" variant="outlined" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} sx={commonTextFieldSx} />
              <TextField fullWidth placeholder="이메일" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} sx={commonTextFieldSx} />

              {error && <Typography color="error" variant="body2" align="center">{error}</Typography>}
              {success && <Typography color="success.main" variant="body2" align="center">{success}</Typography>}

              <Button variant="contained" fullWidth disabled={!canRequestCode || loading}
                sx={{ bgcolor: "white", color: "#2148c0", height: 45, borderRadius: 1, boxShadow: "0px 4px 4px rgba(0,0,0,0.3)", "&:hover": { bgcolor: "#f5f5f5" }, fontFamily: "Montserrat-SemiBold, Helvetica", fontWeight: 600, fontSize: "1rem" }}
                onClick={handleRequestCode}>
                {loading ? "전송 중..." : "인증코드 받기"}
              </Button>

              <Button variant="outlined" fullWidth sx={{ mt: 1, color: "white", borderColor: "white", height: 45, borderRadius: 1, fontFamily: "Montserrat-SemiBold, Helvetica", fontWeight: 600, fontSize: "1rem", "&:hover": { borderColor: "#a8c1ff", color: "#a8c1ff" }}} onClick={() => navigate("/login")}>
                뒤로가기
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <TextField fullWidth placeholder="인증코드 6자리" variant="outlined" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} sx={commonTextFieldSx} />
              <TextField fullWidth placeholder="새 비밀번호" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} InputProps={{ startAdornment: <Lock sx={{ mr: 1, color: "white" }} /> }} sx={commonTextFieldSx} />
              <TextField fullWidth placeholder="비밀번호 확인" type="password" variant="outlined" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} InputProps={{ startAdornment: <Lock sx={{ mr: 1, color: "white" }} /> }} sx={commonTextFieldSx} />

              {error && <Typography color="error" variant="body2" align="center">{error}</Typography>}
              {success && <Typography color="success.main" variant="body2" align="center">{success}</Typography>}

              <Button variant="contained" fullWidth disabled={!canConfirm || loading}
                sx={{ bgcolor: "white", color: "#2148c0", height: 45, borderRadius: 1, boxShadow: "0px 4px 4px rgba(0,0,0,0.3)", "&:hover": { bgcolor: "#f5f5f5" }, fontFamily: "Montserrat-SemiBold, Helvetica", fontWeight: 600, fontSize: "1rem" }}
                onClick={handleConfirm}>
                {loading ? "처리 중..." : "비밀번호 재설정"}
              </Button>

              <Button variant="outlined" fullWidth disabled={cooldown > 0 || loading}
                sx={{ mt: 1, color: "white", borderColor: "white", height: 45, borderRadius: 1, fontFamily: "Montserrat-SemiBold, Helvetica", fontWeight: 600, fontSize: "1rem", "&:hover": { borderColor: "#a8c1ff", color: "#a8c1ff" } }}
                onClick={handleRequestCode}>
                {cooldown > 0 ? `인증코드 재전송 (${cooldown}s)` : "인증코드 재전송"}
              </Button>

              <Button variant="text" fullWidth sx={{ color: "white", textDecoration: "underline" }} onClick={() => setStep(1)}>
                이메일/사번 다시 입력
              </Button>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default ResetPassword;