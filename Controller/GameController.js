import { ref, push } from 'firebase/database';
import { auth, database } from '../Model/Firebase';

export const saveScoreToFirebase = async (score, difficulty, navigate) => {
  if (auth.currentUser) {
    const userId = auth.currentUser.uid;
    const userScoreRef = ref(database, `users/${userId}/`);
    
    try {
      await push(userScoreRef, {
        score: score,
        timestamp: Date.now(),
        difficulty: difficulty,
      });
      alert(`Game completed! Your score: ${score}`);
      navigate('/profile');
    } catch (error) {
      console.error("Error saving score to Firebase:", error);
    }
  } else {
    console.log("No user is logged in.");
  }
};
