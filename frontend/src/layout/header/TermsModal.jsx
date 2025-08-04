import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TermsModal = ({ open, onClose, title, children }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 1,
        }}
      >
        {title}
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Typography component="div" variant="body2" sx={{ whiteSpace: "pre-line" }}>
          {children}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;