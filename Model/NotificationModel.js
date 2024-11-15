import { database } from './Firebase'; // Import your Firebase configuration
import { ref, onValue, update, push } from 'firebase/database';

// Fetch notifications for a specific user
export const fetchNotifications = (userId, callback) => {
  const notificationsRef = ref(database, `users/${userId}/notifications`);
  onValue(notificationsRef, (snapshot) => {
    callback(snapshot.val());
  });
};

// Add a new notification
export const addNotification = (userId, message) => {
  const notificationsRef = ref(database, `users/${userId}/notifications`);
  const newNotificationRef = push(notificationsRef);
  newNotificationRef.set({
    message,
    read: false
  });
};

// Mark a notification as read
export const markNotificationAsRead = (userId, notificationId) => {
  const notificationRef = ref(database, `users/${userId}/notifications/${notificationId}`);
  update(notificationRef, { read: true });
};
