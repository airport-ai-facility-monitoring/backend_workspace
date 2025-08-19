import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import WeatherBox from "./WeatherBox";
import NotificationBox from "./NotificationBox";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Tooltip,
  Container,
} from "@mui/material";
import MapHero from "../MapHero"; // ✅ 새 공용 컴포넌트

/** 지도 라벨: 대시보드와 동일하게 12개 확장 */
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

const APP_BAR_HEIGHT = 64;

export default function MainHomeMg() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
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
      } finally {
        if (mounted) setLoading(false);
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
    <Box sx={{ minHeight: `calc(100vh - ${APP_BAR_HEIGHT}px)`, bgcolor: "#f5f7fc" }}>
      {/* Breadcrumb */}
      <Container maxWidth="xl" sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Welcome</Typography>
          <ArrowForwardIosRoundedIcon sx={{ fontSize: 12, color: "text.disabled" }} />
          <Typography variant="subtitle2" color="primary" fontWeight={800}>Home</Typography>
        </Box>
      </Container>

      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <Grid container spacing={3}>
          {/* 좌측: 지도 + CCTV + 날씨 */}
          <Grid item xs={9}>
            {/* ✅ 공용 MapHero 사용 (라벨 12개) */}
            <MapHero
              labels={runwayLabels}
              onLabelClick={(id) => navigate(`/dashdetail/${id}`)}
              height={620}
              imageSrc="/chart.png"
            />

            {/* CCTV 1~3 */}
            <Grid container columnSpacing={6} rowSpacing={5} sx={{ mt: 2, alignItems: "stretch" }}>
              {[1, 2, 3].map((num) => (
                <Grid key={num} item xs={4} sx={{ display: "flex" }}>
                  <Card
                    elevation={1}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                      height: 180,
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <CardActionArea onClick={() => navigate(`/dashdetail/${num}`)} sx={{ position: "relative" }}>
                      <Box
                        component="video"
                        src={`/videos/${num}.mp4`}
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
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
                        <VideocamRoundedIcon sx={{ fontSize: 18, color: "#e5e7eb" }} />
                        <Typography variant="caption" sx={{ color: "#e5e7eb", fontWeight: 800 }}>
                          CCTV {num}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          bgcolor: "rgba(17,24,39,0.55)",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <PlayArrowRoundedIcon sx={{ color: "#e5e7eb" }} />
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* 날씨 */}
            <Card elevation={1} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", mt: 2 }}>
              <CardHeader
                title={<Typography variant="subtitle1" fontWeight={900}>현재 날씨</Typography>}
                action={
                  <Tooltip title="상세 보기">
                    <IconButton size="small" onClick={() => navigate("/weather-detail")}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
                sx={{ py: 1.25 }}
              />
              <Divider />
              <CardContent sx={{ pt: 2 }}>
                <WeatherBox defaultAirportKey="RKPK" refreshMinutes={10} />
              </CardContent>
            </Card>
          </Grid>

          {/* 우측: 공지 + 알림 */}
          <Grid item xs={3}>
            <Card elevation={1} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CardHeader
                title={<Typography variant="subtitle1" fontWeight={900}>공지사항</Typography>}
                action={
                  <Tooltip title="전체 공지로 이동">
                    <IconButton size="small" onClick={() => navigate("/notifications")}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
                sx={{ py: 1.25 }}
              />
              <Divider />
              <CardContent sx={{ pt: 2 }}>
                <NotificationBox />
              </CardContent>
            </Card>

            <Card elevation={1} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", mt: 3 }}>
              <CardHeader
                title={<Typography variant="subtitle1" fontWeight={900}>알림 로그</Typography>}
                action={
                  <Tooltip title="알림 페이지로 이동">
                    <IconButton size="small" onClick={() => navigate("/alert")}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
                sx={{ py: 1.25 }}
              />
              <Divider />
              <CardContent sx={{ pt: 1, pb: 0 }}>
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <Box key={i} sx={{ mb: 1.25 }}>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="40%" />
                      {i < 3 && <Divider sx={{ mt: 1 }} />}
                    </Box>
                  ))
                ) : alerts.length ? (
                  <List dense sx={{ maxHeight: 420, overflow: "auto" }}>
                    {alerts.map((alert, index) => (
                      <React.Fragment key={alert.alertId || index}>
                        <ListItem alignItems="flex-start" disableGutters>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {alert.alertLog ?? "알림 내용 없음"}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {alert.alertDate ? new Date(alert.alertDate).toLocaleString() : "-"}
                              </Typography>
                            }
                            onClick={() => navigate(`/dashdetail/${alert.cctvId}`)}
                            sx={{ cursor: "pointer" }}
                          />
                        </ListItem>
                        {index < alerts.length - 1 && <Divider sx={{ my: 1 }} />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    최근 알림이 없습니다.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}