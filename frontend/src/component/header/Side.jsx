import React from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ 추가
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ErrorIcon from "@mui/icons-material/Error";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningIcon from "@mui/icons-material/Warning";
import CommuteIcon from "@mui/icons-material/Commute";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 220;

const navItems = [
  { text: "Home", icon: <HomeIcon />, path: "/home" },
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dash" },
  { text: "Alert", icon: <ErrorIcon />, path: "/alert" },
  { text: "Notifications", icon: <NotificationsIcon />, path: "/notifications" },
  { text: "Anomaly", icon: <WarningIcon />, path: "/anomaly" },
  { text: "Facility", icon: <CommuteIcon />, path: "/facility" },
  { text: "Daily Log", icon: <DescriptionIcon />, path: "/dailyLog" },
];

const Side = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 현재 URL 경로 확인

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 0,
          boxSizing: "border-box",
          bgcolor: "#1f263d",
          color: "white",
          overflowX: "hidden",
        },
      }}
    >
      <Box sx={{ p: 2, height: 70, display: "flex", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Quick Access
        </Typography>
      </Box>

      <List>
        {navItems.map((item) => {
          const selected = location.pathname === item.path; // ✅ 현재 경로와 일치하는지 확인
          return (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                height: 40,
                bgcolor: selected ? "rgba(255,255,255,0.1)" : "transparent",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.12)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: selected ? "#90caf9" : "white", // ✅ 아이콘 색 강조
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: selected ? "bold" : "normal", // ✅ 글자 강조
                  opacity: selected ? 1 : 0.7,
                }}
              />
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.12)", my: 2 }} />

      <Typography
        variant="subtitle2"
        sx={{ px: 2, py: 1, opacity: 0.7, fontSize: 13 }}
      >
        Account
      </Typography>

      <List>
        <ListItem button onClick={() => navigate("/settings")}>
          <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            primaryTypographyProps={{
              fontSize: 13,
              opacity: 0.65,
            }}
          />
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <List sx={{ marginTop: "auto" }}>
        <ListItem button onClick={() => navigate("/logout")}>
          <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Log Out"
            primaryTypographyProps={{
              fontSize: 13,
              opacity: 0.65,
            }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Side;
