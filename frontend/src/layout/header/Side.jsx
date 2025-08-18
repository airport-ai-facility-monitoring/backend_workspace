// SideNav.jsx
import React, { useMemo, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Tooltip,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ErrorIcon from "@mui/icons-material/Error";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ConstructionIcon from "@mui/icons-material/Construction";
import StorageIcon from "@mui/icons-material/Storage";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";

/**
 * Airport Facility Side Navigation (polished)
 * - collapsedMode: 'hidden' | 'mini'
 *   - hidden(기본): 닫힘일 때 폭 0px (본문에 영향 없음)
 *   - mini: 닫힘일 때 폭 72px 아이콘만 표시
 * - appBarHeight: 상단 AppBar 높이(px)
 */

const DRAWER_WIDTH = 240;
const MINI_WIDTH = 72;

const PaperStyles = {
  width: DRAWER_WIDTH,
  border: 0,
  boxSizing: "border-box",
  overflowX: "hidden",
  background: (theme) =>
    `linear-gradient(180deg, ${
      theme.palette.mode === "dark" ? "#0f172a" : "#0b1220"
    } 0%, #111827 100%)`,
  color: "#e5e7eb",
  boxShadow: "inset -1px 0 0 rgba(255,255,255,0.06)",
  backdropFilter: "saturate(140%) blur(6px)",
};

const Pill = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 8,
  right: 8,
  top: 4,
  bottom: 4,
  borderRadius: 14,
  background:
    theme.palette.mode === "dark"
      ? "rgba(96,165,250,0.12)"
      : "rgba(147,197,253,0.12)",
  border: "1px solid rgba(148,163,184,0.2)",
}));

function useActive(pathOrPrefix) {
  const { pathname } = useLocation();
  return useMemo(() => {
    if (!pathOrPrefix) return false;
    if (pathOrPrefix.endsWith("/*")) {
      const base = pathOrPrefix.slice(0, -2);
      return pathname.startsWith(base);
    }
    return pathname === pathOrPrefix || pathname.startsWith(pathOrPrefix);
  }, [pathOrPrefix, pathname]);
}

function NavItem({
  icon,
  label,
  to,
  dense = false,
  selected,
  mini,
  endAdornment,
  onClick,
  sx,
  ...rest
}) {
  const navigate = useNavigate();
  const content = (
    <ListItemButton
      onClick={onClick || (() => to && navigate(to))}
      selected={selected}
      aria-current={selected ? "page" : undefined}
      sx={{
        my: 0.25,
        mx: 1,
        borderRadius: 2,
        position: "relative",
        py: dense ? 0.75 : 1,
        px: mini ? 0.5 : 1.25,
        transition: "background-color .2s ease, color .2s ease",
        color: selected ? "#eaf2ff" : "#cbd5e1",
        "&.Mui-selected": { backgroundColor: "transparent" },
        "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
        ...sx,
      }}
      {...rest}
    >
      {(!mini && selected) && <Pill aria-hidden />}
      <ListItemIcon
        sx={{
          minWidth: mini ? 0 : 40,
          mr: mini ? 0 : 1,
          color: selected ? "#90caf9" : "inherit",
          justifyContent: "center",
        }}
      >
        {icon}
      </ListItemIcon>
      {!mini && (
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            fontSize: 13,
            fontWeight: selected ? 700 : 500,
          }}
        />
      )}
      {!mini && endAdornment}
    </ListItemButton>
  );

  if (mini) {
    return (
      <Tooltip title={label} placement="right" arrow>
        {content}
      </Tooltip>
    );
  }
  return content;
}

export default function SideNav({
  open,
  setOpen,
  alertCount = 0,
  notifCount = 0,
  appBarHeight = 64,
  collapsedMode = "hidden", // 'hidden' | 'mini'
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // nested menu states (auto open if route matches)
  const crackActive = useActive("/crack/*");
  const equipActive = useActive("/equipment/*");
  const [crackOpen, setCrackOpen] = useState(crackActive);
  const [equipmentOpen, setEquipmentOpen] = useState(equipActive);

  // mini: 접힘 상태에서 아이콘만 노출할지 여부
  const mini = open ? false : collapsedMode === "mini";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const closedWidth = collapsedMode === "mini" ? MINI_WIDTH : 0;

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
        sx: {
          ...PaperStyles,
          width: open ? DRAWER_WIDTH : closedWidth,
          top: appBarHeight,
          height: `calc(100% - ${appBarHeight}px)`,
          transition: (theme) =>
            theme.transitions.create(["width", "transform"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.shorter,
            }),
          pointerEvents: open || mini ? "auto" : "none",
          borderRight: 0,
          zIndex: (theme) => theme.zIndex.drawer, // AppBar 아래/위 정렬은 레이아웃에서 조정
        },
      }}
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": { overflowX: "hidden" },
      }}
    >
      {/* Brand / Header */}
      {!mini && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            height: 72,
            px: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AirportShuttleIcon sx={{ fontSize: 24, color: "#93c5fd" }} />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ lineHeight: 1, color: "#e5e7eb", fontWeight: 800 }}
              >
                Facility Ops
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(229,231,235,0.7)" }}
              >
                Airport CMMS
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Overview */}
      <Box sx={{ px: mini ? 0 : 1, pt: 1 }}>
        {!mini && (
          <Typography variant="overline" sx={{ px: 2, opacity: 0.6 }}>
            Overview
          </Typography>
        )}
        <List disablePadding>
          <NavItem
            icon={<HomeIcon />}
            label="Home"
            to="/home"
            mini={mini}
            selected={location.pathname === "/home"}
          />
          <NavItem
            icon={<DashboardIcon />}
            label="Dashboard"
            to="/dash"
            mini={mini}
            selected={location.pathname === "/dash"}
          />
          <NavItem
            icon={<ErrorIcon />}
            label="Alert"
            to="/alert"
            mini={mini}
            selected={location.pathname === "/alert"}
            endAdornment={
              !mini && alertCount > 0 ? (
                <Chip size="small" label={alertCount} sx={{ ml: 1, height: 20 }} />
              ) : null
            }
          />
          <NavItem
            icon={<NotificationsIcon />}
            label="Notifications"
            to="/notifications"
            mini={mini}
            selected={location.pathname === "/notifications"}
            endAdornment={
              !mini && notifCount > 0 ? (
                <Chip size="small" label={notifCount} sx={{ ml: 1, height: 20 }} />
              ) : null
            }
          />
        </List>
      </Box>

      {/* Runway / Crack */}
      <Box sx={{ px: mini ? 0 : 1, mt: 1 }}>
        {!mini && (
          <Typography variant="overline" sx={{ px: 2, opacity: 0.6 }}>
            Runway Health
          </Typography>
        )}
        <List disablePadding>
          <NavItem
            icon={<ConstructionIcon />}
            label="Crack"
            mini={mini}
            selected={crackActive}
            onClick={() => setCrackOpen((v) => !v)}
            endAdornment={!mini ? (crackOpen ? <ExpandLess /> : <ExpandMore />) : null}
          />
          {!mini && (
            <Collapse in={crackOpen} unmountOnExit>
              <List disablePadding sx={{ pl: 2 }}>
                <NavItem
                  dense
                  icon={
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 9999,
                        background: "#93c5fd",
                        display: "inline-block",
                      }}
                    />
                  }
                  label="Crack"
                  to="/crack"
                  mini={mini}
                  selected={location.pathname === "/crack"}
                  sx={{ ml: 1.5 }}
                />
                <NavItem
                  dense
                  icon={
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 9999,
                        background: "#93c5fd",
                        display: "inline-block",
                      }}
                    />
                  }
                  label="Crack Report"
                  to="/crack/report/list"
                  mini={mini}
                  selected={location.pathname === "/crack/report/list"}
                  sx={{ ml: 1.5 }}
                />
              </List>
            </Collapse>
          )}
        </List>
      </Box>

      {/* Equipment */}
      <Box sx={{ px: mini ? 0 : 1, mt: 1 }}>
        {!mini && (
          <Typography variant="overline" sx={{ px: 2, opacity: 0.6 }}>
            Equipment
          </Typography>
        )}
        <List disablePadding>
          <NavItem
            icon={<StorageIcon />}
            label="Equipment"
            mini={mini}
            selected={equipActive}
            onClick={() => setEquipmentOpen((v) => !v)}
            endAdornment={!mini ? (equipmentOpen ? <ExpandLess /> : <ExpandMore />) : null}
          />
          {!mini && (
            <Collapse in={equipmentOpen} unmountOnExit>
              <List disablePadding sx={{ pl: 2 }}>
                <NavItem
                  dense
                  icon={
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 9999,
                        background: "#93c5fd",
                        display: "inline-block",
                      }}
                    />
                  }
                  label="Equipment"
                  to="/equipment"
                  mini={mini}
                  selected={location.pathname === "/equipment"}
                  sx={{ ml: 1.5 }}
                />
                <NavItem
                  dense
                  icon={
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 9999,
                        background: "#93c5fd",
                        display: "inline-block",
                      }}
                    />
                  }
                  label="Equipment Report"
                  to="/equipment/report"
                  mini={mini}
                  selected={location.pathname === "/equipment/report"}
                  sx={{ ml: 1.5 }}
                />
              </List>
            </Collapse>
          )}
        </List>
      </Box>

      <Box sx={{ flex: 1 }} />

      {/* Account */}
      <Divider sx={{ opacity: 0.12, borderColor: "rgba(255,255,255,0.12)", mt: 1 }} />
      <Box sx={{ px: mini ? 0 : 1, py: 1 }}>
        {!mini && (
          <Typography variant="overline" sx={{ px: 2, opacity: 0.6 }}>
            Account
          </Typography>
        )}
        <List disablePadding>
          <NavItem
            icon={<SettingsIcon />}
            label="Settings"
            to="/settings"
            mini={mini}
            selected={location.pathname === "/settings"}
          />
          <NavItem
            icon={<LogoutIcon />}
            label="Log Out"
            mini={mini}
            onClick={() => {
              localStorage.removeItem("accessToken");
              navigate("/login");
            }}
          />
        </List>
      </Box>
    </Drawer>
  );
}