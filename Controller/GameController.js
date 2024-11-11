import { ref, set, push } from 'firebase/database';
import { auth, database } from '../Model/Firebase';

export const saveScoreToFirebase = async (score, difficulty, navigate) => {
  if (auth.currentUser) {
    const userId = auth.currentUser.uid;
    const db = database;

    // Get a reference to `users/{userId}/scores` with a unique ID for each score entry
    const scoreRef = push(ref(db, `users/${userId}/scores`));

    try {
      await set(scoreRef, {
        score: score,
        timestamp: Date.now(),
        difficulty: difficulty,
      });
      console.log("Score saved successfully!"); // Debugging line
      alert(`Game completed! Your score: ${score}`);
      navigate('/profile');
    } catch (error) {
      console.error("Error saving score to Firebase:", error);
    }
  } else {
    console.log("No user is logged in.");
  }
};
