import { database } from '../Model/FirebaseConfig';
import { ref, onValue } from 'firebase/database';
import { addNotification } from '../Model/NotificationModel';

// Monitor scores to detect if a user surpasses another user's best score
export const monitorScores = (userId, userBestScore) => {
  const scoresRef = ref(database, 'users');
  onValue(scoresRef, (snapshot) => {
    const users = snapshot.val();
    for (const [otherUserId, userData] of Object.entries(users)) {
      if (otherUserId !== userId && userData.scores) {
        const highestScore = Math.max(...Object.values(userData.scores).map(score => score.score));
        if (highestScore > userBestScore) {
          const message = `${userData.name} surpassed your best score of ${userBestScore}!`;
          addNotification(userId, message);
        }
      }
    }
  });
};
