// Notification.js
import React from "react";
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
            <img 
              src={`${path}${photo}`}
              alt=""
            />
          </div>
          <div className="message">
            <p className="sender">{sender}</p>
            <p className="message">{message}</p>
          </div>
        </div>
      </div>
      <div className="notification-close">
        {!isRead && (
          <button
            onClick={onClick}
            className="close-button">
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;
