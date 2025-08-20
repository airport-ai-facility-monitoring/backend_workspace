import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import CCTVFeed from "./CCTVFeed";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
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
import MapHero from "../MapHero"; // ✅ 홈 화면과 동일한 공용 컴포넌트 사용

const runwayLabels = [
  { id: 1, name: "제1,2 활주로", top: "33.1%", left: "29.2%" },
  { id: 2, name: "자유무역지역(화물터미널)", top: "16.3%", left: "45.5%" },
  { id: 3, name: "제1 여객터미널", top: "23%", left: "70.7%" },
  { id: 4, name: "제2 여객터미널", top: "59%", left: "40.2%" },
  { id: 5, name: "탑승동", top: "40%", left: "59.8%" },
  { id: 6, name: "제3·4 활주로", top: "65.5%", left: "75.5%" },
  { id: 7, name: "A계류장", top: "45%", left: "20%" },
  { id: 8, name: "B계류장", top: "50%", left: "80%" },
  { id: 9, name: "C계류장", top: "70%", left: "25%" },
  { id: 10, name: "D계류장", top: "20%", left: "30%" },
  { id: 11, name: "E계류장", top: "80%", left: "50%" },
  { id: 12, name: "F계류장", top: "10%", left: "60%" },
];

const GAP = 16;

const DashBoardMg = () => {
  const [alerts, setAlerts] = useState([]);
  const cameraList = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    src: `/videos/${i + 1}.mp4`,
  }));

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchInitialAlerts = async () => {
      try {
        const response = await api.get("/alerts");
        if (!mounted) return;
        setAlerts((Array.isArray(response.data) ? response.data : []).slice(0, 30));
      } catch (error) {
        console.error("Error fetching initial alerts:", error);
      }
    };

    fetchInitialAlerts();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") fetchInitialAlerts();
    }, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    // ✅ 단일 세로 스크롤 컨테이너
    <Box
      sx={{
        height: "100dvh",
        overflowY: "auto",
        overflowX: "hidden",
        bgcolor: "#f3f6fe",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 페이지 헤더(필요 시 고정) */}
      <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Typography variant="caption" color="textSecondary">
          Welcome
        </Typography>
        <Box component="img" src="/app/path2.svg" sx={{ width: 8, height: 8, mx: 1 }} />
        <Typography variant="caption" color="primary" fontWeight="bold">
          Dashboard
        </Typography>
      </Box>

      {/* 본문 래퍼: 내부 섹션은 overflow 없음(중첩 스크롤 방지) */}
      <Box sx={{ px: 2, pb: 4, overflow: "visible" }}>
        {/* 상단: Map + 알림 (고정 2열) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 2,
            alignItems: "start",
            mb: 4,
          }}
        >
          {/* ✅ MapHero (홈 화면 동일) */}
          <Box sx={{ minWidth: 0 }}>
            <MapHero
              labels={runwayLabels}
              onLabelClick={(id) => navigate(`/dashdetail/${id}`)}
              height={620}
              imageSrc="/chart.png"
            />
          </Box>

          {/* 알림 패널: 내부 스크롤 가능 */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              bgcolor: "#fefefe",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden", // ✅ 바깥으로 새는 것 방지
              maxHeight: 650,     // ✅ 높이 제한 (원하는 값으로 조정 가능)
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="h6">알림 로그</Typography>
              <IconButton size="small" onClick={() => navigate("/alert")}>
                <AddIcon sx={{ cursor: "pointer" }} />
              </IconButton>
            </Box>

            {/* 내부 스크롤 영역 */}
            <List
              sx={{
                p: 0,
                overflowY: "auto",  // ✅ 세로 스크롤 가능
                flex: 1,
              }}
            >
              {alerts.map((alert, index) => (
                <React.Fragment key={alert.alertId || index}>
                  <ListItem alignItems="flex-start" disablePadding>
                    <ListItemText
                      primary={alert.alertLog ?? "알림 내용 없음"}
                      secondary={
                        alert.alertDate ? new Date(alert.alertDate).toLocaleString() : "-"
                      }
                      onClick={() => navigate(`/dashdetail/${alert.cctvId}`)}
                      sx={{ cursor: "pointer", px: 1 }}
                    />
                  </ListItem>
                  {index < alerts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>

        {/* 하단: CCTV 15개 — 항상 3열, 비율 고정(16:9), 내부 스크롤 없음 */}
        <Box
          sx={{
            mt: 4,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // ✅ 구조 고정: 항상 3열
            gap: `${GAP}px`,
            alignItems: "start",
            overflow: "visible",
          }}
        >
          {cameraList.map((cam) => (
            <Paper
              key={cam.id}
              onClick={() => navigate(`/dashdetail/${cam.id}`)}
              elevation={1}
              sx={{
                position: "relative",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "#fff",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": { transform: "scale(1.01)", boxShadow: 4 },
                // ✅ 크기: 3열 균등 + 16:9 유지
                width: "100%",
                aspectRatio: "16 / 9",
                overflow: "hidden",
                contain: "layout paint size",
              }}
            >
              {/* 영상 */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  "& video": {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  },
                }}
              >
                <CCTVFeed videoSrc={cam.src} cameraId={cam.id} />
              </Box>

              {/* 좌하단 채널 배지 */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.25,
                  py: 0.5,
                  bgcolor: "rgba(17,24,39,0.6)",
                  borderRadius: 1.5,
                  backdropFilter: "blur(2px)",
                }}
              >
                <Typography variant="caption" sx={{ color: "#e5e7eb", fontWeight: 800 }}>
                  CCTV {cam.id}
                </Typography>
              </Box>

              {/* 우상단 LIVE 뱃지 */}
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1,
                  py: 0.4,
                  borderRadius: 999,
                  bgcolor: "rgba(17,24,39,0.55)",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#f87171",
                    boxShadow: "0 0 0 6px rgba(248,113,113,0.15)",
                  }}
                />
                <Typography variant="caption" sx={{ color: "#e5e7eb", fontWeight: 700 }}>
                  LIVE
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default DashBoardMg;