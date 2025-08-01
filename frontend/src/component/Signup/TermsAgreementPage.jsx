import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert, // 누락된 import 추가
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const buttonBase = {
  bgcolor: "white",
  color: "#3150b0",
  height: "45px",
  fontFamily: "Montserrat",
  fontWeight: 600,
  fontSize: "14px",
  "&:hover": { bgcolor: "#f5f5f5" },
  boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
};

const PrivacyConsent = () => {
  const navigate = useNavigate();
  const [requiredConsent, setRequiredConsent] = useState(false);
  // marketingConsent은 현재 사용되지 않아서 제거하거나 실제 UI에 연결할 것
  const [showPolicy, setShowPolicy] = useState(false);
  const [error, setError] = useState("");

  const handleAgree = () => {
    if (!requiredConsent) {
      setError("필수 개인정보 수집 및 이용에 동의하셔야 합니다.");
      return;
    }
    localStorage.setItem("privacyConsent", "agreed");
    navigate("/signup");
  };

  const handleReject = () => {
    alert("개인정보 수집/이용에 동의하지 않으면 서비스를 이용할 수 없습니다.");
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
        p: { xs: 2, md: 4 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 배경 감성 유지 */}
      <Box
        sx={{
          position: "absolute",
          width: "650px",
          height: "650px",
          bottom: "-320px",
          left: "-300px",
          bgcolor: "#264ec9",
          borderRadius: "50%",
          filter: "blur(40px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          width: "100%",
          maxWidth: 960,
          zIndex: 1,
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          alignItems: "stretch",
        }}
      >
        <Paper
          elevation={12}
          sx={{
            flex: "1 1 320px",
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            position: "relative",
            bgcolor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            minWidth: 0, // flex 아이템에서 오버플로우 방지
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{
              color: "white",
              fontFamily: "Montserrat",
              fontWeight: 600,
              mb: 1,
            }}
          >
            개인정보 수집 및 이용 동의
          </Typography>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.3)", mb: 3 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={requiredConsent}
                  onChange={(e) => {
                    setRequiredConsent(e.target.checked);
                    setError("");
                  }}
                  sx={{
                    color: "white",
                    "&.Mui-checked": { color: "#4caf50" },
                  }}
                />
              }
              label={
                <Box>
                  <Typography
                    component="div"
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    [필수] 개인정보 수집 및 이용 동의
                  </Typography>
                  <Typography
                    component="div"
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    서비스 제공을 위해 필요한 정보(이름, 사번, 이메일 등)를 수집합니다.
                  </Typography>
                </Box>
              }
            />
          </Box>

          {error && (
            <Box sx={{ mt: 1 }}>
              <Alert severity="error" sx={{ fontSize: 13 }} role="alert">
                {error}
              </Alert>
            </Box>
          )}

          <Box
            sx={{
              mt: 4,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={handleAgree}
              sx={{
                ...buttonBase,
                flex: "1 1 180px",
              }}
              disabled={!requiredConsent}
            >
              동의하고 계속
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setShowPolicy(true)}
              sx={{
                flex: "1 1 180px",
                borderColor: "white",
                color: "white",
                fontWeight: 600,
              }}
            >
              처리방침 보기
            </Button>
          </Box>

          <Typography
            variant="caption"
            sx={{ display: "block", mt: 2, color: "rgba(255,255,255,0.7)" }}
          >
            * 필수 동의는 거부할 수 없으며, 동의하지 않으면 회원가입이 불가능합니다.
          </Typography>
        </Paper>
      </Box>

      <Dialog open={showPolicy} onClose={() => setShowPolicy(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#1f3fa0", color: "white" }}>개인정보 처리방침</DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "#1f47c4", color: "white" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>
            1. 수집 항목
          </Typography>
          <Typography variant="body2" paragraph>
            이름, 사번, 이메일, 연락처 등 서비스 제공을 위한 기본 정보.
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>
            2. 이용 목적
          </Typography>
          <Typography variant="body2" paragraph>
            회원관리, 인증, 공지, 서비스 개선, 마케팅(선택 동의 시) 등.
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>
            3. 보관 기간
          </Typography>
          <Typography variant="body2" paragraph>
            가입 시점부터 서비스 종료 또는 관계법령에 따름.
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>
            4. 동의 철회
          </Typography>
          <Typography variant="body2" paragraph>
            마이페이지 / 고객센터를 통해 언제든지 철회할 수 있습니다.
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 2 }}>
            * 본 내용은 예시이며 실제 배포 전 법률 검토 필요합니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#1f47c4" }}>
          <Button onClick={() => setShowPolicy(false)} sx={{ color: "white" }}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrivacyConsent;