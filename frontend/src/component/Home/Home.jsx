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

const MainHomeMg = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f3f6fe" }}>
      <Box sx={{ flexGrow: 1, overflow: "auto", width: "100%" }}>
        {/* Breadcrumb */}
        <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center" }}>
          <Typography variant="caption" color="textSecondary">Welcome</Typography>
          <Box component="img" src="/path2.svg" sx={{ width: 8, height: 8, mx: 1 }} />
          <Typography variant="caption" color="primary" fontWeight="bold">Dashboard</Typography>
        </Box>

        {/* 메인 콘텐츠 */}
        <Box sx={{ px: 2 }}>
          {/* 상단: 왼쪽 박스 + 오른쪽 카드 3개 */}
          <Box sx={{ display: "flex", gap: 5 }}>
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

            {/* 오른쪽 세로 카드 */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4, height: 515 }}>
              {[1, 2, 3].map((item) => (
                <Paper
                  key={item}
                  sx={{
                    height: 200,
                    width: 300,
                    p: 3,
                    bgcolor: "#fefefe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2">오른쪽 카드 {item}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* 하단: 날씨, 공지사항, 알림 로그 */}
          <Box sx={{ display: "flex", gap: 4, mt: 4 }}>
            {[ 
              { title: "날씨", desc: "연결된 날씨가 여기에 표시됩니다." },
              { title: "공지사항", desc: "연결된 공지사항이 여기에 표시됩니다." },
              { title: "알림 로그", desc: "연결된 알림 로그가 여기에 표시됩니다." },
            ].map((card, index) => (
              <Paper
                key={index}
                sx={{ width: 400, height: 100, p: 4 }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="h6">{card.title}</Typography>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {card.desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainHomeMg;
