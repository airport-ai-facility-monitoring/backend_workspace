import React from "react";
import { TextField, Typography } from "@mui/material";
import { inputStyle } from "../styles";

const PhoneNumberInput = ({ value, onChange }) => (
  <>
    <TextField
      name="phoneNumber"
      placeholder="  '-' 없이 휴대폰 번호 입력"
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      inputProps={{ maxLength: 11 }}
      InputProps={{ sx: inputStyle }}
    />
  </>
);

export default PhoneNumberInput;
