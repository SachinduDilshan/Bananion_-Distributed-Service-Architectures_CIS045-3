import { getDatabase, ref, set, push } from 'firebase/database';

// Fetch math puzzle questions
export const fetchQuestions = async (userId) => {
  try {
    const response = await fetch(`/api/banana?userId=${userId}`);
    
    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      const errorText = await response.text(); // Capture the error text for debugging
      console.error('Unexpected response:', errorText);
      throw new Error(`Unexpected response type: ${contentType || "unknown"}`);
    }

    const data = await response.json();
    return data.question;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};



// Save score to Firebase under the user ID
export const saveScore = async (userId, scoreData) => {
  const db = getDatabase();
  const scoreRef = ref(db, `users/${userId}/scores`);
  const newScoreRef = push(scoreRef);
  await set(newScoreRef, scoreData);
};
