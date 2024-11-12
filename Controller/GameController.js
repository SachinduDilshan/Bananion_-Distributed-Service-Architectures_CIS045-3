//import admin from 'firebase-admin';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

  /*async register(req, res) {
    try {
      const { name, email, age, password } = req.body;
      const userData = await UserModel.registerUser({ name, email, age, password });
      res.status(201).json(userData);
    } catch (error) {
      console.error("Registration Error:", error.message);
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email } = req.body;
      const user = await UserModel.loginUser({ email });

      if (user) {
        res.status(200).json({ message: 'Login successful', uid: user.uid });
      } else {
        res.status(401).json({ error: 'Invalid login credentials' });
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      res.status(401).json({ error: error.message });
    }
  },

  async home(req, res) {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;


      const userRef = admin.database().ref(`users/${uid}`);
      const userSnapshot = await userRef.once('value');
      const userData = userSnapshot.val();

      if (userData) {
        res.status(200).json(userData);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error("Error retrieving user data:", error.message);
      res.status(500).json({ error: 'Failed to retrieve user data' });
    }
  },*/
  
  // Controller for handling game-related logic
  
  // Fetches a question from the API - event-based fetching
export const fetchQuestion = async () => {
  try {
    const response = await fetch('https://marcconrad.com/uob/banana/api.php?out=json');
    const data = await response.json();
    return { question: data.question, solution: data.solution };
  } catch (error) {
    console.error('Error fetching question:', error);
    return { question: null, solution: null };
  }
};

// Saves total score to Firebase - interoperable with REST API
export const saveTotalScore = async (totalScore, difficulty) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return;

  const uid = user.uid;
  try {
    await axios.post('http://localhost:3000/api/saveScore', { uid, score: totalScore, difficulty });
    console.log('Score saved successfully');
  } catch (error) {
    console.error('Error saving score:', error.message);
  }
};

// Utility functions to retrieve time limits and max wrong answers based on difficulty
export const getTimeLimit = (difficulty) => ({ Beginner: 61, Intermediate: 46, Expert: 31 }[difficulty] || 60);
export const getMaxWrongAnswers = () => 2;
  
