import { getDatabase, ref, set, push } from 'firebase/database';

export const fetchGameInterface = async () => {
  try {
    const response = await fetch('http://localhost:5173/https://marcconrad.com/uob/banana/api.php');
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch', error);
    throw error;
  }
};

/*export const saveScore = async (userId, scoreData) => {
  const db = getDatabase();
  const scoreRef = ref(db, `users/${userId}/scores`);
  const newScoreRef = push(scoreRef);
  await set(newScoreRef, scoreData);
};
*/