import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WeatherBox from "./WeatherBox";
import NotificationBox from "./NotificationBox";

import {
  Box,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

const MainHomeMg = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f3f6fe" }}>
      <Box sx={{ flexGrow: 1, overflow: "auto", width: "100%" }}>
        {/* Breadcrumb */}
        <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center" }}>
          <Typography variant="caption" color="textSecondary">Welcome</Typography>
          <Box component="img" src="/app/path2.svg" sx={{ width: 8, height: 8, mx: 1 }} />
          <Typography variant="caption" color="primary" fontWeight="bold">Dashboard</Typography>
        </Box>

        {/* 메인 콘텐츠 */}
        <Box sx={{ px: 2 }}>
          {/* 상단: 왼쪽 박스 + 오른쪽 카드 3개 */}
          <Box sx={{ display: "flex", gap: 5 }}>
            {/* 왼쪽 박스 (이미지로 대체) */}
            <Paper
              sx={{
                height: 500,
                flex: 1,
                p: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#e0e7ff",
                maxWidth: "1100px",
              }}
            >
              <Box
                component="img"
                src="/app/chart.png"
                alt="차트"
                sx={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "cover",
                }}
              />
            </Paper>

            {/* 오른쪽 세로 카드 (동영상) */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4, height: 515 }}>
              {[1, 2, 3].map((num) => (
                <Paper
                  key={num}
                  sx={{
                    height: 200,
                    width: 300,
                    p: 0,
                    bgcolor: "#fefefe",
                    overflow: "hidden",
                  }}
                >
                  <video
                    src={`/app/videos/${num}.mp4`}
                    autoPlay
                    muted
                    loop
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                </Paper>
              ))}
            </Box>
          </Box>

          {/* 하단: 날씨, 공지사항, 알림 로그 */}
          <Box sx={{ display: "flex", gap: 4, mt: 4 }}>
          {/* 날씨 카드 */}
          <Paper sx={{ width: 400, minHeight: 180, p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="h6">날씨</Typography>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
            <WeatherBox />
          </Paper>

          {/* 공지사항 카드 */}
          <Paper sx={{ width: 400, minHeight: 180, p: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="h6">공지사항</Typography>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
            <NotificationBox />
          </Paper>

          {/* 알림 로그 카드 */}
          <Paper sx={{ width: 400, minHeight: 180, p: 4 }}>
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
        </Box>
      </Box>
    </Box>
  );
};

export default MainHomeMg;