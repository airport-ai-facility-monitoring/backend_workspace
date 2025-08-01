import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import Badge from '@mui/icons-material/Badge';
import PasswordInput from './PasswordInput';
import PhoneNumberInput from './PhoneNumberInput';
import EmailInput from './EmailInput';
import { inputStyle, placeholderStyle, buttonStyle } from '../styles';

const SignUpForm = ({ form, setForm, showPassword, passwordValidation, handleChange, handleTogglePasswordVisibility, isFormValid, handleSignUp, navigate }) => (
  <Box
    sx={{
      width: '350px',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <Typography
      variant="h6"
      align="center"
      sx={{
        color: 'white',
        fontFamily: 'Montserrat',
        fontWeight: 500,
        mb: 2,
      }}
    >
      PRINCESS AIRPORTS SIGN UP
    </Typography>

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

    <PasswordInput
      form={form}
      showPassword={showPassword}
      handleChange={handleChange}
      handleTogglePasswordVisibility={handleTogglePasswordVisibility}
      passwordValidation={passwordValidation}
    />

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

    <PhoneNumberInput
      value={form.phoneNumber}
      onChange={(e) => setForm(prev => ({ ...prev, phoneNumber: e.target.value.replace(/\D/g, '') }))}
    />
    <EmailInput
      value={form.email}
      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
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
      sx={{ color: 'white', borderColor: 'white', mt: 1 }}
      onClick={() => navigate('/login')}
    >
      BACK TO CONSENT
    </Button>
  </Box>
);

export default SignUpForm;
