// Notification.js
import React from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import "./styles/index.css";
const path = process.env.REACT_APP_WBMS_BACKEND_IMG_URL;
const Notification = ({ message, isRead, sender, photo, key, onClick }) => {
  return (
    <div
      style={{ width: "max-content", marginTop: "25px" }}
      className={`notification ${isRead ? "animate-enter" : "animate-leave"}`}>
      <div className="notification-container">
        <div className="notification-wrapper">
          <div className="image-container">
            <img src={`${path}${photo}`} alt="" />
          </div>
          <div className="message">
            <Typography variant="p"  className="sender">
              {sender}
            </Typography>
            <Typography variant="p" sx={{ marginTop: 1 }} component="div" className="message">
              {message}
            </Typography>
          </div>
        </div>
      </div>
      <div className="notification-close">
        {!isRead && (
          <button onClick={onClick} className="close-button">
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;
