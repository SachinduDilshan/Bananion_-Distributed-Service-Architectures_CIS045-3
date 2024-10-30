// GameModel.js
import axios from 'axios';
import { getDatabase, ref, set, push } from 'firebase/database';

const API_URL = 'https://marcconrad.com/uob/banana/';

// Fetch math puzzle questions
export const fetchQuestions = async () => {
  const response = await axios.get(API_URL);
  return response.data.question; // Assume the response format includes a "question" field
};

// Save score to Firebase under the user ID
export const saveScore = async (userId, scoreData) => {
  const db = getDatabase();
  const scoreRef = ref(db, `users/${userId}/scores`);
  const newScoreRef = push(scoreRef);
  await set(newScoreRef, scoreData);
};
