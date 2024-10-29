const UserModel = require('../Model/UserModel.jsx');
const admin = require('firebase-admin'); // Firebase Admin SDK

const UserController = {
  // Registration endpoint
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

  // Login endpoint
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

  // Home endpoint to retrieve authenticated user data
  async home(req, res) {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
      // Verify the Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // Retrieve user details from Firestore or Realtime Database
      const userSnapshot = await admin.firestore().collection('users').doc(uid).get();
      const userData = userSnapshot.data();

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
};

module.exports = UserController;
