import React from "react";
import { TextField, Typography } from "@mui/material";
import { inputStyle } from "../styles";

const EmailInput = ({ value, onChange }) => (
  <>
    <TextField
      name="email"
      placeholder=" (선택) 이메일 주소 입력"
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      InputProps={{ sx: inputStyle }}
    />
  </>
);

export default EmailInput;
