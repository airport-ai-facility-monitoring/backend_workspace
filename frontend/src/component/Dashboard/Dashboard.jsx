import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  AppBar,
  Box,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";

const DashBoardMg = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f3f6fe" }}>
      <Box sx={{ flexGrow: 1, overflow: "auto", width: "100%" }}>
      

        {/* Breadcrumb */}
        <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center" }}>
          <Typography variant="caption" color="textSecondary">
            Welcome
          </Typography>
          <Box
            component="img"
            src="/path2.svg"
            sx={{ width: 8, height: 8, mx: 1 }}
          />
          <Typography variant="caption" color="primary" fontWeight="bold">
            Dashboard
          </Typography>
        </Box>

        {/* 메인 콘텐츠 */}
        <Box sx={{ px: 2 }}>
          {/* 상단: 왼쪽 박스 + 오른쪽 알림 로그 */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* 왼쪽 박스 */}
            <Paper
              sx={{
                height: 500,
                flex: 1,
                p: 6,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#e0e7ff",
              }}
            >
              <Typography variant="h6">왼쪽 상단 박스 (예: 차트/지도)</Typography>
            </Paper>

            {/* 오른쪽 알림 로그 */}
            <Paper
              sx={{
                height: 500,
                width: 300,
                p: 3,
                bgcolor: "#fefefe",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="h6">알림 로그</Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="textSecondary">
                연결된 알림 로그가 여기에 표시됩니다.
              </Typography>
            </Paper>
          </Box>

          {/* 하단: 고정 3개씩 줄바꿈 */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mt: 4,
              justifyContent: "flex-start",
            }}
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <Paper
                key={idx}
                sx={{
                  width: "32%",
                  minWidth: 250,
                  height: 140,
                  bgcolor: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">빈 박스 {idx + 1}</Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashBoardMg;
