import UserModel from '../Model/UserModel.js';
import admin from 'firebase-admin';

const UserController = {

  async register(req, res) {
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
  },

  async saveScore(req, res) {
    console.log('Request received at saveScore endpoint:', req.body); // Log the request body
    const { uid, score, difficulty } = req.body;

    if (!uid || score === undefined || !difficulty) {
        console.log('Invalid data provided'); // Check if invalid data was received
        return res.status(400).json({ error: 'Invalid data provided' });
    }

    try {
        // Define the reference path under 'users' -> 'uid' -> 'scores'
        const scoreRef = admin.database().ref(`users/${uid}/scores`).push();

        // Use set() to add the score data
        await scoreRef.set({
            score: score,
            difficulty: difficulty,
            timestamp: admin.database.ServerValue.TIMESTAMP // Optional: record the time of the entry
        });

        console.log('Score saved in database'); // Confirm score saved
        res.status(200).json({ message: 'Score saved successfully' });
    } catch (error) {
        console.error("Error saving score:", error.message); // Log error if saving fails
        res.status(500).json({ error: 'Failed to save score' });
    }
}
};

export default UserController;
