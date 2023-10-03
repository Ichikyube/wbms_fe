// Notification.js
import React from "react";
import toast from "react-hot-toast";

const Notification = toast(({ message, isRead, key, onClick }) => {
  return (
    <div
      style={{ width: "max-content", marginTop: "25px" }}
      className={`notification ${isRead ? "animate-enter" : "animate-leave"}`}>
      <div className="notification-container">
        <div className="notification-wrapper">
          <div className="image-container">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
              alt=""
            />
          </div>
          <div className="message">
            <p className="sender">Emilia Gates</p>
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
});

export default Notification;