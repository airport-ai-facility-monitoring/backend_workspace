import React, { useState, useEffect } from "react";
import api from "../../api"; // api.js import
import CommuteIcon from "@mui/icons-material/Commute";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import ErrorIcon from "@mui/icons-material/Error";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
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
} from "@mui/material";

// ... (기존 import 문 유지)

const Alert = () => {
  const [alerts, setAlerts] = useState([]);
  const pollingInterval = 5000; // 5초마다 폴링

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get("/alerts");
        setAlerts(response.data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts(); // 컴포넌트 마운트 시 즉시 호출

    const intervalId = setInterval(fetchAlerts, pollingInterval); // 주기적으로 호출

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f3f6fe" }}>
      {/* Sidebar */}
      

      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        

        {/* Breadcrumb */}
        <Box sx={{ px: 5, py: 2, display: "flex", alignItems: "center" }}>
          <Typography
            variant="body2"
            sx={{ fontSize: 11, fontWeight: 300, color: "#1f263d" }}
          >
            Welcome
          </Typography>
          <Box
            component="img"
            src="/path-2.svg"
            alt="Path"
            sx={{ width: 8, height: 8, mx: 1 }}
          />
          <Typography
            variant="body2"
            sx={{ fontSize: 11, fontWeight: 700, color: "#1348fc" }}
          >
            Dashboard
          </Typography>
        </Box>

        {/* Main content area */}
        <Box sx={{ px: 5, py: 1, flexGrow: 1 }}>
          <Paper sx={{ height: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: "100%" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "30%", fontWeight: "normal" }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: "normal" }}>Detail</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={2} sx={{ border: "none", py: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        Latest Activities
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {alerts.map((row, index) => (
                    <TableRow
                      key={row.alertId || index} // alertId가 있으면 사용, 없으면 index 사용
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {new Date(row.alertDate).toLocaleString()} {/* 날짜 형식 변환 */}
                      </TableCell>
                      <TableCell>{row.alertLog}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Alert;