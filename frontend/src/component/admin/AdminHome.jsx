import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

const MainHomeAD = () => {
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
          {/* 상단: 좌측 박스 + 우측 카드 3개 */}
          <Grid container spacing={5}>
            {/* 왼쪽 박스 (크기 증가됨) */}
            <Grid item xs={16} md={8}>
              <Paper
                sx={{
                  height: 200,
                  width: 500, // ✅ 높이 증가
                  p: 20,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "#e0e7ff",
                }}
              >
                <Typography variant="h6">왼쪽 상단 박스 (예: 차트/지도)</Typography>
              </Paper>
            </Grid>

            {/* 오른쪽 세로 카드 */}
            <Grid item xs={12} md={4}>
              <Stack spacing={4} sx={{ height: 500 }}> {/* ✅ Stack 높이도 맞춤 */}
                {[1, 2, 3].map((item) => (
                  <Paper
                    key={item}
                    sx={{
                      flex: 1,
                      p: 8,
                      bgcolor: "#fefefe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2">오른쪽 카드 {item}</Typography>
                  </Paper>
                ))}
              </Stack>
            </Grid>
          </Grid>

          {/* 하단 3개 카드: 날씨, 공지사항, 알림 로그 */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              { title: "날씨", desc: "연결된 날씨가 여기에 표시됩니다." },
              { title: "공지사항", desc: "연결된 공지사항이 여기에 표시됩니다." },
              { title: "승인 관리", desc: "연결된 승인 관리가 여기에 표시됩니다." },
            ].map((card, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper sx={{ height: 100, p: 4 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                  >
                    <Typography variant="h6">{card.title}</Typography>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {card.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default MainHomeAD;
