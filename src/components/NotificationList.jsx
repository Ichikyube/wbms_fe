import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import { cilBell } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import api from "../api/api";
import toast from "react-hot-toast";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setshowNotification] = useState(false);
  const handleShowNotification = () => {
    setshowNotification(!showNotification);
  };
  const navigate = useNavigate();
  const fetchNotification = () => {
    api
      .get("notifications")
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };
  useEffect(() => {
    fetchNotification();
  }, []);
  const handleNotificationClick = async (id) => {
    // Send a PUT request to mark notification as read
    // Example using fetch:
    await api.patch(`notifications/${id}/read`);
    toast.dismiss(id);
    // Refresh the list after marking as read
    fetchNotification();
    navigate("/configrequest");
  };
  return (
    <div style={{ position: "relative" }} className="notification-list">
      <IconButton
        size="large"
        aria-label="show new notifications"
        color="inherit"
        onClick={handleShowNotification}>
        <Badge badgeContent={notifications?.length} color="error">
          <CIcon icon={cilBell} size="lg" />
        </Badge>
      </IconButton>
      {showNotification && (
        <div style={{ position: "absolute", right: "40%", top: "20%" }}>
          {notifications?.length > 0 &&
            notifications?.map((notification) => (
              <Notification
                key={notification.id}
                photo={notification.photo}
                sender={notification.sender}
                message={notification.message}
                isReaded={notification.isReaded}
                onClick={() => handleNotificationClick(notification.id)}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
