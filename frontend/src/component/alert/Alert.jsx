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
import React from "react";

// Mock data for the activity log
const activityData = [
  { date: "2018/10/02 15:57:46", detail: "2번 활주로 FOD 감지" },
  { date: "2018/10/10 10:57:46", detail: "1번 활주로 FOD 감지" },
  { date: "2018/10/10 10:57:46", detail: "3번 활주로 작업자 이상행동" },
  { date: "2018/10/13 10:57:46", detail: "3번 활주로 감쇠 감지" },
  { date: "2018/10/13 10:57:46", detail: "----------------------------" },
  { date: "2018/10/13 10:57:46", detail: "----------------------------" },
  { date: "2018/10/23 10:57:46", detail: "----------------------------" },
  { date: "2018/10/23 10:57:46", detail: "----------------------------" },
  { date: "2018/10/30 10:57:46", detail: "----------------------------" },
];

const Alert = () => {
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
                  {activityData.map((row, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.date}
                      </TableCell>
                      <TableCell>{row.detail}</TableCell>
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