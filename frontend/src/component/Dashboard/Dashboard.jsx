import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import CCTVFeed from "./CCTVFeed";
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios"; // api import 추가
import {
  AppBar,
  Box,
  IconButton,
  Paper,
  Toolbar,
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

const DashBoardMg = () => {
  const [alerts, setAlerts] = useState([]);
  const cameraList = [
    { id: 1, src: "/app/videos/1.mp4" },
    { id: 2, src: "/app/videos/2.mp4" },
    { id: 3, src: "/app/videos/3.mp4" },
    { id: 4, src: "/app/videos/4.mp4" },
    { id: 5, src: "/app/videos/5.mp4" },
    { id: 6, src: "/app/videos/6.mp4" },
  ];
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
          {/* 상단 */}
          <Box sx={{ display: "flex", gap: 2 ,mb :4}}>
            <Paper
              sx={{
                position : "relative",
                height: 500,
                flex: 1,
                p: 2,
                overflow : "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#e0e7ff",
              }}
              elevation={1}
            >
              <Box
                component="img"
                src="/app/chart.png"
                alt="차트"
                sx={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "cover",
                  display :"block",
                }}
              />
              {runwayLabels.map(({ id, name, top, left }) => (
                <Button
                  key={id}
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={() => navigate(`/dashdetail/${id}`)}
                  sx={{
                    position: "absolute",
                    top,
                    left,
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#fff",    // 흰 배경
                    border: "2px solid #FFD700",// 노랑 테두리
                    color: "#000",              // 검정 글씨
                    p: "2px 6px",
                    paddingY: "7px",
                    paddingX: "16px", 
                    textTransform: "none",
                    padding :"4px 8px",
                    fontSize: "0.75rem",
                    lineHeight: 1,
                    zIndex:2,
                  }}
                >
                  {name}
                </Button>
              ))}
            </Paper>

            <Paper
              sx={{
                height: 500,
                width: 300,
                p: 3,
                bgcolor: "#fefefe",
                display: "flex",
                flexDirection: "column",
              }}
            >
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

          {/* 하단: CCTV 영상 */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mt: 4,
              justifyContent: "flex-start",
            }}
          >
            {cameraList.map((cam) => (
              <Paper
                key={cam.id}
                onClick={() => navigate(`/dashdetail/${cam.id}`)}
                sx={{
                  width: "32%",
                  minWidth: 250,
                  height: 140,
                  bgcolor: "#fff",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: 4,
                  },
                }}
              >
                <CCTVFeed videoSrc={cam.src} cameraId={cam.id} />
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashBoardMg;