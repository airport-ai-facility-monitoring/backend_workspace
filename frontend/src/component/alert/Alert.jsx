import React, { useState, useEffect } from "react";
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
import api from "../../config/api"; // api import 추가
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
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

const Alert = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchInitialAlerts = async () => {
      try {
        const response = await api.get("/alerts?sort=alertDate,desc");
        setAlerts(response.data._embedded.alerts.slice(0, 30));
      } catch (error) {
        console.error("Error fetching initial alerts:", error);
      }
    };

    fetchInitialAlerts();
    const interval = setInterval(fetchInitialAlerts, 1000);

    return () => clearInterval(interval);
  }, []);

  // 처리 요청 버튼 클릭 핸들러
  const handleRequest = (objectId) => {
    console.log(`처리 요청 신호 전송 (ID): ${objectId}`);
    alert(`[처리 요청] 신호를 보냈습니다. 대상 ID: ${objectId}`);
    // 나중에 실제 API 호출 로직을 여기에 추가할 수 있습니다.
    // 예: api.post('/handle-request', { objectId });
  };

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
          {/* <Box
            component="img"
            src="/path-2.svg"
            alt="Path"
            sx={{ width: 8, height: 8, mx: 1 }}
          /> */}
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
                    <TableCell
                      sx={{
                        width: "15%",
                        fontWeight: "normal",
                        textAlign: "center",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} sx={{ border: "none", py: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        Latest Activities
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {alerts.map((row, index) => {
                    console.log("Alert data:", row); // For debugging

                    const isForeignObjectAlert =
                      row.alertLog.includes("이물질 감지");
                    let objectId = null;

                    if (isForeignObjectAlert) {
                      const match = row.alertLog.match(/이물질 감지: (\d+)/);
                      if (match && match[1]) {
                        objectId = match[1];
                      }
                    }

                    return (
                      <TableRow
                        key={row.alertId || index}
                        hover
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {new Date(row.alertDate).toLocaleString()}
                        </TableCell>
                        <TableCell>{row.alertLog}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {isForeignObjectAlert && objectId && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleRequest(objectId)}
                            >
                              처리 요청
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
