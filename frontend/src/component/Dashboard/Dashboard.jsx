import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
} from "@mui/material";

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
          <Box sx={{ display: "flex", gap: 2 }}>
            <Paper
              sx={{
                height: 500,
                flex: 1,
                p: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#e0e7ff",
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
                <IconButton size="small"><MoreVertIcon /></IconButton>
              </Box>
              <List sx={{ overflow: "auto", flexGrow: 1 }}>
                {alerts.map((alert, index) => (
                  <React.Fragment key={alert.alertId || index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={alert.alertLog}
                        secondary={new Date(alert.alertDate).toLocaleString()}
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