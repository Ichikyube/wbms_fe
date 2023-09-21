import React, { useState, useEffect } from "react";
import Notification from "./Notification";
import { cilBell } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
                                                                                                                                                                                          
import api from "../api/api";
const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api
      .get("notifications")
      .then((data) => setNotifications(data.data))
      .catch((error) => console.error("Error fetching notifications:", error));
  }, []);

  const handleNotificationClick = async (id) => {
    // Send a PUT request to mark notification as read
    // Example using fetch:
    await api.patch(`notifications/${id}/read`);

    // Refresh the list after marking as read
    api.get("notifications")
      .then((data) => setNotifications(data))
      .catch((error) => console.error("Error fetching notifications:", error));
  };
  return (
    <div style={{position:"relative"}} className="notification-list">
      
      <IconButton
        size="large"
        aria-label="show 17 new notifications"
        color="inherit">
        <Badge badgeContent={notifications?.length} color="error">
        <CIcon icon={cilBell} size="lg" />
        </Badge>
      </IconButton>
      <div style={{position: "absolute", right: "40%", top: "20%"}}>
      {notifications?.length>0 && notifications?.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          isReaded={notification.isReaded}
          onClick={() => handleNotificationClick(notification.id)}
        />
      ))}
      </div>
    </div>
  );
};

export default NotificationList;
