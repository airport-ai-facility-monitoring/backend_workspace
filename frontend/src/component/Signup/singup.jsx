import Badge from "@mui/icons-material/Badge";
import Email from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import Person from "@mui/icons-material/Person";
import Phone from "@mui/icons-material/Phone";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const SignUp = () => {
  const formFields = [
    {
      id: "employee-id",
      label: "사번을 입력하세요",
      icon: <Badge fontSize="small" />,
    },
    {
      id: "password",
      label: "비밀번호를 입력하세요",
      icon: <Lock fontSize="small" />,
      type: "password",
    },
    {
      id: "name",
      label: "이름을 입력하세요",
      icon: <Person fontSize="small" />,
    },
    {
      id: "phone",
      label: "휴대번호를 입력하세요",
      icon: <Phone fontSize="small" />,
    },
    {
      id: "email",
      label: "E-MAIL을 입력하세요",
      icon: <Email fontSize="small" />,
      type: "email",
    },
  ];

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

          {formFields.map((field) => (
            <TextField
              key={field.id}
              id={field.id}
              placeholder={field.label}
              type={field.type || "text"}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{field.icon}</InputAdornment>
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
          ))}

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
          >
            SIGN UP
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SignUp;
