import { getDatabase, ref, set, push } from 'firebase/database';

export const fetchGameData = async (userId) => {
  try {
    const response = await fetch(`https://marcconrad.com/uob/banana/?user=${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch game data");
    }
    const data = await response.json();
    console.log("Game Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching game data:", error);
    throw error;
  }
};


/*xport const saveScore = async (userId, scoreData) => {
  const db = getDatabase();
  const scoreRef = ref(db, `users/${userId}/scores`);
  const newScoreRef = push(scoreRef);
  await set(newScoreRef, scoreData);
};
*/