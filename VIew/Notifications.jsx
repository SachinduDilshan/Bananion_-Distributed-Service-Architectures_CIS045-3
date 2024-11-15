import React, { useEffect, useState } from 'react';
import { fetchNotifications, markNotificationAsRead } from '../Model/NotificationModel';
import './Styles/notifications.css';

function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications(userId, (data) => {
      if (data) {
        const notificationsList = Object.entries(data).map(([id, details]) => ({
          id,
          ...details
        }));
        setNotifications(notificationsList);
      }
    });
  }, [userId]);

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(userId, id);
  };

  return (
    <div className="notifications-tab">
      <h4>Notifications</h4>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        notifications.map(({ id, message, read }) => (
          <div key={id} className={`notification-item ${read ? 'read' : 'unread'}`}>
            <p>{message}</p>
            {!read && (
              <button onClick={() => handleMarkAsRead(id)} className="mark-read-btn">
                Mark as Read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;
