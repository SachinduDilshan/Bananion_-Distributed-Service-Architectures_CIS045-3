import { getDatabase, ref, get, update } from 'firebase/database';

export const fetchHighestScores = async (userId) => {
  const db = getDatabase();
  const scoresRef = ref(db, `users/${userId}/scores`);
  const maxScores = { beginner: 0, intermediate: 0, expert: 0 };

  try {
    const snapshot = await get(scoresRef);
    const scoresData = snapshot.val();

    if (scoresData) {
      Object.values(scoresData).forEach((score) => {
        if (score.difficulty === 'Beginner' && score.score > maxScores.beginner) {
          maxScores.beginner = score.score;
        }
        if (score.difficulty === 'Intermediate' && score.score > maxScores.intermediate) {
          maxScores.intermediate = score.score;
        }
        if (score.difficulty === 'Expert' && score.score > maxScores.expert) {
          maxScores.expert = score.score;
        }
      });
    }
    return maxScores;
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw error;
  }
};

export const updateUserData = async (userId, name, age) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${userId}`);

  try {
    await update(userRef, { name, age });
    return { name, age };
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};
