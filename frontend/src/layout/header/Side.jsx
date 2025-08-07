import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

import ConstructionIcon from "@mui/icons-material/Construction";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ErrorIcon from "@mui/icons-material/Error";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WarningIcon from "@mui/icons-material/Warning";
import CommuteIcon from "@mui/icons-material/Commute";
import DescriptionIcon from "@mui/icons-material/Description";
import StorageIcon from "@mui/icons-material/Storage"; // ✅ 추가
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import api from "../../config/api";

const drawerWidth = 220;

const navItems = [
  { text: "Home", icon: <HomeIcon />, path: "/home" },
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dash" },
  { text: "Alert", icon: <ErrorIcon />, path: "/alert" },
  { text: "Notifications", icon: <NotificationsIcon />, path: "/notifications" },
  { text: "Anomaly", icon: <WarningIcon />, path: "/anomaly" },
  { text: "Facility", icon: <CommuteIcon />, path: "/facility" },
  { text: "Crack", icon: <ConstructionIcon/>, collapse: true},
  // ✅ 새로 추가된 메뉴
  { text: "Equipments List", icon: <StorageIcon />, path: "/equipmentslist" },
];

const Side = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [crackOpen, setCrackOpen] = useState(false);

  const handleCrackClick = () => {
    setCrackOpen((prev) => !prev);
  };
  const handleLogout = async () => {
    try {
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

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
        if (item.text === "Crack") {
          return (
            <React.Fragment key="Crack">
              <ListItem
                button
                onClick={() => setCrackOpen((prev) => !prev)}
                sx={{
                  height: 40,
                  bgcolor: location.pathname.startsWith("/crack")
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.12)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: location.pathname.startsWith("/crack")
                      ? "bold"
                      : "normal",
                    opacity: 0.9,
                  }}
                />
                {crackOpen ? (
                  <ExpandLess sx={{ color: "white" }} />
                ) : (
                  <ExpandMore sx={{ color: "white" }} />
                )}
              </ListItem>

              <Collapse in={crackOpen} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    <ListItem
      button
      sx={{
        pl: 6,
        height: 36,
        bgcolor: location.pathname === "/crack" ? "rgba(255,255,255,0.1)" : "transparent",
        "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
      }}
      onClick={() => navigate("/crack")}
    >
      <ListItemText
        primary="Crack"
        primaryTypographyProps={{
          fontSize: 12,
          fontWeight: location.pathname === "/crack" ? "bold" : "normal",
          opacity: location.pathname === "/crack" ? 1 : 0.7,
        }}
      />
    </ListItem>

    <ListItem
      button
      sx={{
        pl: 6,
        height: 36,
        bgcolor: location.pathname === "/crack/report" ? "rgba(255,255,255,0.1)" : "transparent",
        "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
      }}
      onClick={() => navigate("/crack/report")}
    >
      <ListItemText
        primary="Crack Report"
        primaryTypographyProps={{
          fontSize: 12,
          fontWeight: location.pathname === "/crack/report" ? "bold" : "normal",
          opacity: location.pathname === "/crack/report" ? 1 : 0.7,
        }}
      />
    </ListItem>
  </List>
</Collapse>
            </React.Fragment>
          );
        }

        const selected = location.pathname === item.path;
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
                color: selected ? "#90caf9" : "white",
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: 13,
                fontWeight: selected ? "bold" : "normal",
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
      <ListItem button onClick={handleLogout}>
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
