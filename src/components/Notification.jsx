// Notification.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { markNotificationAsRead } from '../slices/notificationSlice'; // Assuming you have this action defined

function Notification({ message, isRead, id, onClick }) {
  return (
    <div style={{width: "max-content", marginTop: "25px"}} 
    className={`notification ${isRead ? 'read' : 'unread'}`}>
      <p>{message}</p>
      {!isRead && (
        <button onClick={onClick}>Mark as Read</button>
      )}
    </div>
  );
}

export default Notification;
