import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

import Side from "./Side"; // 사이드바 컴포넌트 임포트

const Navbar = ({ open, setOpen }) => {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        bgcolor: "white",
        boxShadow: "0px 8px 28px rgba(72, 89, 102, 0.1)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        // width: open ? `calc(100% - 220px)` : "100%",
        // marginLeft: open ? "220px" : 0,
        transition: (theme) =>
          theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setOpen(!open)}
        >
          <MenuIcon />
        </IconButton>
        {/* 나머지 내용 */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
