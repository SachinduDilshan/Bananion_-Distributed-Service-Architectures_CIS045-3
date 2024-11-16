import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async (uid) => {
        try {
          if (!uid) {
            console.error("UID is undefined. Cannot fetch notifications.");
            return;
          }
          const response = await axios.get(`http://localhost:3000/api/notifications/${uid}`);
          console.log("Notifications:", response.data);
          return response.data;
        } catch (error) {
          console.error("Error fetching notifications:", error.message);
        }
      };

    fetchNotifications();
  }, [userId]);

  return (
    <div className="notifications-tab">
      <h4>Notifications</h4>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <p>{notification.message}</p>
            <small>{new Date(notification.timestamp).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
