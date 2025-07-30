import { Outlet } from "react-router-dom";
import Navbar from "../../header/Navbar";
import Side from "./header/Side";
import { useState } from "react";
import Box from "@mui/material/Box";

const drawerWidth = 220;

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* 사이드바 */}
      <Side open={open} setOpen={setOpen} />

      {/* 오른쪽 메인 영역: 상단 네비바 + 컨텐츠 */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: open ? `${drawerWidth}px` : 0,
          width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
        }}
      >
        <Navbar open={open} setOpen={setOpen} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
