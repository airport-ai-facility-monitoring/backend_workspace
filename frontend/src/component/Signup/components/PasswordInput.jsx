import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import Lock from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { inputStyle, placeholderStyle } from '../styles';

const PasswordInput = ({ form, showPassword, handleChange, handleTogglePasswordVisibility, passwordValidation }) => (
  <>
    <TextField
      name="password"
      placeholder="비밀번호를 입력하세요"
      variant="outlined"
      fullWidth
      type={showPassword.password ? 'text' : 'password'}
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
    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5, mb: 2 }}>
      비밀번호는 10~16자, 영문자·숫자·특수문자 포함해야 합니다.
    </Typography>
    {!(passwordValidation.length && passwordValidation.alphanumeric && passwordValidation.number && passwordValidation.special) && form.password.length > 0 && (
      <Typography variant="caption" sx={{ color: 'red', mt: 0.5, mb: 2 }}>
        비밀번호 조건을 모두 만족해야 합니다.
      </Typography>
    )}

    <TextField
      name="confirmPassword"
      placeholder="비밀번호를 다시 입력하세요"
      variant="outlined"
      fullWidth
      type={showPassword.confirmPassword ? 'text' : 'password'}
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
    {!passwordValidation.match && form.confirmPassword.length > 0 && (
      <Typography variant="caption" sx={{ color: 'red', mt: 0.5, mb: 2 }}>
        비밀번호가 일치하지 않습니다.
      </Typography>
    )}
  </>
);

export default PasswordInput;
