import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import WarningIcon from "@mui/icons-material/Warning";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import React from "react";

// Mock data for the anomaly table
const anomalyData = [
  {
    id: 1,
    site: "SITE A",
    channel: "CH03",
    date: "2025-07-18",
    time: "17:06",
    status: "처리중",
    anomaly: "온도 이상",
    imageUrl: "https://via.placeholder.com/80", // 예시 이미지
  },
  {
    id: 2,
    site: "SITE A",
    channel: "CH11",
    date: "2025-07-17",
    time: "12:00",
    status: "완료",
    anomaly: "습도 급상승",
    imageUrl: "https://via.placeholder.com/80",
  },
  {
    id: 3,
    site: "SITE C",
    channel: "CH07",
    date: "2025-07-17",
    time: "06:35",
    status: "처리중",
    anomaly: "누수 감지",
    imageUrl: "https://via.placeholder.com/80",
  },
  {
    id: 4,
    site: "SITE F",
    channel: "CH09",
    date: "2025-07-16",
    time: "17:06",
    status: "대기중",
    anomaly: "연기 감지",
    imageUrl: "https://via.placeholder.com/80",
  },
];

// Navigation items for the sidebar
const navigationItems = [
  { text: "Home", icon: <HomeIcon /> },
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Alert", icon: <WarningIcon /> },
  { text: "Notifications", icon: <NotificationsIcon /> },
  { text: "Anomaly", icon: <WarningIcon />, selected: true },
  { text: "Facility", icon: <DirectionsCarIcon /> },
  { text: "Daily Log", icon: <DescriptionIcon /> },
];

// Account items for the sidebar
const accountItems = [{ text: "Settings", icon: <SettingsIcon /> }];

const Anomaly = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f3f6fe" }}>
      {/* Sidebar */}

      {/* Main content */}
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {/* Breadcrumb */}
        <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Welcome
          </Typography>
          <NavigateNextIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="primary" fontWeight="bold">
            Dashboard
          </Typography>
          <NavigateNextIcon fontSize="small" color="primary" />
        </Box>

        {/* Summary Card */}
        <Paper sx={{ mx: 3, mb: 3, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">이상 감지 내역</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", width: 210 }}>
              <Typography variant="caption" color="text.secondary">
                날짜
              </Typography>
              <Typography variant="body1">2025.07.18</Typography>
              <Divider sx={{ mt: 1, bgcolor: "#1348fc" }} />
            </Box>
          </Box>
        </Paper>

        {/* Anomaly Table */}
        <Box sx={{ mx: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            이상 탐지 보고서 조회
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">상태</TableCell>
                  <TableCell align="center">현장</TableCell>
                  <TableCell align="center">채널</TableCell>
                  <TableCell align="center">이상</TableCell>
                  <TableCell align="center">시간</TableCell>
                  <TableCell align="center">사진</TableCell>
                  <TableCell align="center">보고서 보기</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {anomalyData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center">{row.site}</TableCell>
                    <TableCell align="center">{row.channel}</TableCell>
                    <TableCell align="center">{row.anomaly}</TableCell>
                    <TableCell align="center">
                      {row.date}
                      <br />
                      {row.time}
                    </TableCell>
                    <TableCell align="center">
                      <img
                        src={row.imageUrl}
                        alt="이상 이미지"
                        width={60}
                        height={40}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/report/${row.id}`)}
                      >
                        보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Anomaly;
