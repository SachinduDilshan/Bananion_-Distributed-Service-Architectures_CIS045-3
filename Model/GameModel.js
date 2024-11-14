import { getAuth } from 'firebase/auth';
import axios from 'axios';

export const timeLimits = { Beginner: 61, Intermediate: 46, Expert: 31 };
export const maxWrongAnswers = 2;
export const totalQuestions = 35;

export async function fetchQuestion() {
  try {
    const response = await fetch('https://marcconrad.com/uob/banana/api.php?out=json');
    const data = await response.json();
    return { question: data.question, solution: data.solution };
  } catch (error) {
    console.error('Error fetching question:', error);
    return null;
  }
}

export async function saveScoreToFirebase(finalScore, difficulty) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    console.log('No authenticated user');
    return;
  }
  const uid = user.uid;

  try {
    await axios.post('http://localhost:3000/api/saveScore', { uid, score: finalScore, difficulty });
    console.log('Total score saved successfully');
  } catch (error) {
    console.error('Error saving total score:', error.message);
  }
}
