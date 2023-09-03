import React, { useState, useEffect } from "react";
import Notification from "./Notification";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from your API here
    // Example using fetch:
    fetch("/api/notifications")
      .then((response) => response.json())
      .then((data) => setNotifications(data))
      .catch((error) => console.error("Error fetching notifications:", error));
  }, []);

  const handleNotificationClick = async (id) => {
    // Send a PUT request to mark notification as read
    // Example using fetch:
    await fetch(`/api/notifications/${id}`, {
      method: "PUT",
    });

    // Refresh the list after marking as read
    fetch("/api/notifications")
      .then((response) => response.json())
      .then((data) => setNotifications(data))
      .catch((error) => console.error("Error fetching notifications:", error));
  };

  return (
    <div className="notification-list">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          isReaded={notification.isReaded}
          onClick={() => handleNotificationClick(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationList;
