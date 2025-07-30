import CommuteIcon from "@mui/icons-material/Commute";
import ErrorIcon from "@mui/icons-material/Error";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";

// Import sections
import ChartSection from "./ChartSection";
import DashboardMetricsSection from "./DashboardMetricsSection";
import DataVisualizationSection from "./DataVisualizationSection";
import SummarySection from "./SummarySection";

// Sample user image
const userImage = "https://via.placeholder.com/40";

const Facility = () => {
  // Navigation items data
  const mainNavItems = [
    { text: "Home", icon: <HomeIcon />, active: false },
    { text: "Management", icon: <GroupIcon />, active: true },
    { text: "Notifications", icon: <NotificationsIcon />, active: false },
    { text: "Anomaly", icon: <ErrorIcon />, active: false },
    { text: "Commute", icon: <CommuteIcon />, active: false },
  ];

  const accountNavItems = [
    { text: "Settings", icon: <SettingsIcon /> },
    { text: "Log Out", icon: <LogoutIcon /> },
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "#f3f6fe", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: 218,
          flexShrink: 0,
          bgcolor: "#1f263d",
          color: "white",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Quick Access Section */}
        <Box sx={{ p: 2, pt: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
            Quick Access
          </Typography>
          <List>
            {mainNavItems.map((item, index) => (
              <ListItem
                key={index}
                button
                sx={{
                  py: 1,
                  bgcolor: item.active
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.05)" },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 13,
                    opacity: item.active ? 1 : 0.65,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Account Section */}
        <Box sx={{ p: 2, mt: "auto" }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
            Account
          </Typography>
          <List>
            {accountNavItems.map((item, index) => (
              <ListItem key={index} button sx={{ py: 1 }}>
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 13,
                    opacity: 0.65,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, ml: "218px" }}>
        {/* Header */}
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{
            bgcolor: "white",
            boxShadow: "0px 8px 28px rgba(72, 89, 102, 0.1)",
            height: 70,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Avatar src={userImage} sx={{ width: 32, height: 32, mr: 4 }} />
            <Badge badgeContent={3} color="error" sx={{ mr: 2 }}>
              <NotificationsIcon />
            </Badge>
          </Toolbar>
        </AppBar>

        {/* Breadcrumb */}
        <Box sx={{ p: 3, pb: 1 }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              underline="hover"
              color="inherit"
              href="#"
              sx={{ fontSize: 11, fontWeight: 300 }}
            >
              Welcome
            </Link>
            <Typography color="primary" sx={{ fontSize: 11, fontWeight: 700 }}>
              Dashboard
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Dashboard Sections */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <SummarySection />
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartSection />
            </Grid>
            <Grid item xs={12} md={6}>
              <DashboardMetricsSection />
            </Grid>
            <Grid item xs={12} md={6}>
              <DataVisualizationSection />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Facility;
