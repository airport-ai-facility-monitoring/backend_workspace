import React from "react";
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

const Login = () => {
  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 Hook

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
      {/* Background circles */}
      <Box
        sx={{
          position: "absolute",
          width: 724,
          height: 724,
          bottom: -359,
          left: -352,
          bgcolor: "#264ec9",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 572,
            height: 572,
            bgcolor: "#234bc5",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 438,
              height: 438,
              bgcolor: "#274ec7",
              borderRadius: "50%",
            }}
          />
        </Box>
      </Box>

      {/* Background vector shape */}
      <Box
        sx={{
          position: "absolute",
          width: 854,
          height: 718,
          top: 0,
          right: -352,
          bgcolor: "#2148c0",
          borderBottomLeftRadius: "50%",
          zIndex: 0,
        }}
      />

      {/* Main content */}
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
        {/* Logo */}
        <Box
          component="img"
          src="/airport-logo.png"
          alt="Princess Airports Service Logo"
          sx={{ width: 182, height: 182, mb: 2 }}
        />

        {/* Login form */}
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

          {/* LOGIN 버튼 */}
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
          >
            LOGIN
          </Button>

          {/* ✅ SIGN UP 버튼 - 클릭 시 /signup 이동 */}
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/signup")} // ✅ 여기에 이동 추가
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
