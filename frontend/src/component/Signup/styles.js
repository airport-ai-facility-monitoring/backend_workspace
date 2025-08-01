// 스타일 상수
export const inputStyle = {
  color: "white",
  borderColor: "white",
  height: "45px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
  "& .MuiInputAdornment-root": { color: "white" },
};

export const placeholderStyle = {
  "& .MuiInputBase-input::placeholder": {
    color: "white",
    opacity: 1,
    fontFamily: "Montserrat",
    fontWeight: 300,
    fontSize: "14px",
  },
};

export const buttonStyle = {
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
