import React, { useEffect, useState } from "react";
import api from "../../api/axios"; // api.js 경로에 따라 수정
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

const NotificationBox = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        const sorted = response.data.sort((a, b) =>
          new Date(b.writeDate) - new Date(a.writeDate)
        );
        setNotifications(sorted.slice(0, 5)); // 최근 3개만
      } catch (error) {
        console.error("공지사항 불러오기 실패:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        최근 공지사항
      </Typography>
      {notifications.length > 0 ? (
        <List dense>
          {notifications.map((notice) => (
            <ListItem key={notice.notificationsId} disablePadding>
              <ListItemText
                primary={notice.title}
                secondary={
                  notice.writeDate?.slice(0, 16).replace("T", " ") || ""
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="textSecondary">
          공지사항이 없습니다.
        </Typography>
      )}
    </Box>
  );
};

export default NotificationBox;