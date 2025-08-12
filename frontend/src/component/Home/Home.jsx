import React, { useState, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import WeatherBox from "./WeatherBox";
import NotificationBox from "./NotificationBox";
import api from "../../api/axios"; // api import 추가
import { useNavigate } from "react-router-dom"; 

import {
  Box,
  IconButton,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";

const runwayLabels = [
  { id: 1, name: "제1,2 활주로", top: "33.1%", left: "29.2%" },
  { id: 2, name: "자유무역지역(화물터미널)", top: "16.3%", left: "45.5%" },
  { id: 3, name: "제1 여객터미널", top: "23%", left: "70.7%" },
  { id: 4, name: "제2 여객터미널", top: "59%", left: "40.2%" },
  { id: 5, name: "탑승동", top: "40%", left: "59.8%" },
  { id: 6, name: "제3·4 활주로", top: "65.5%", left: "75.5%" },
];

const MainHomeMg = () => {
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialAlerts = async () => {
      try {
        const response = await api.get("/alerts?sort=alertDate,desc");
        setAlerts(response.data._embedded.alerts.slice(0, 10));
      } catch (error) {
        console.error("Error fetching initial alerts:", error);
      }
    };

    fetchInitialAlerts();
    const interval = setInterval(fetchInitialAlerts, 1000);

    return () => clearInterval(interval);
  }, []);

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
                position: "relative",
              }}
              elevation={1}
            >
              <Box
                component="img"
                src="/chart.png"
                alt="차트"
                sx={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "cover",
                }}
              />
               {/* ✅ 차트 위 버튼들 */}
            {runwayLabels.map(({ id, name, top, left }) => (
             <Button
               key={id}
               variant="text"
                onClick={() => navigate(`/dashdetail/${id}`)}
                sx={{
                  position: "absolute",
                  top,
                  left,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#fff",
                  border: "2px solid #FFD700",
                  color: "#000",
                  textTransform: "none",
                  fontSize: "0.75rem",
                  lineHeight: 1,
                   px: 2,
                  py: 1,
                   zIndex: 2,
                   "&:hover": { backgroundColor: "#fff" },
                 }}
               >
                {name}
               </Button>
             ))}
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
                    src={`/videos/${num}.mp4`}
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
                <AddIcon onClick={() => navigate('/weather-detail')} sx={{ cursor: 'pointer' }} />
              </IconButton>
            </Box>
            <WeatherBox />
          </Paper>

          {/* 공지사항 카드 */}
                    <Paper 
            sx={{ width: 400, minHeight: 180, p: 4 }}
          >
                                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="h6">공지사항</Typography>
              <IconButton size="small">
                <AddIcon onClick={() => navigate('/notifications')} sx={{ cursor: 'pointer' }} />
              </IconButton>
            </Box>
            <NotificationBox />
          </Paper>

          {/* 알림 로그 카드 */}
          <Paper sx={{ width: 400, minHeight: 180, p: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="h6">알림 로그</Typography>
              <IconButton size="small">
                <AddIcon onClick={() => navigate('/alert')} sx={{ cursor: 'pointer' }} />
              </IconButton>
            </Box>
            <List sx={{ overflow: "auto", flexGrow: 1 }}>
                {alerts.map((alert, index) => (
                  <React.Fragment key={alert.alertId || index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={alert.alertLog}
                        secondary={new Date(alert.alertDate).toLocaleString()}
                        onClick={() => navigate(`/dashdetail/${alert.cctvId}`)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </ListItem>
                    {index < alerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
          </Paper>
        </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainHomeMg;