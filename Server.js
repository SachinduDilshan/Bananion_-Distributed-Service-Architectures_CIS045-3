import express from 'express';
import cors from 'cors';
import authenticateUser from './Middleware/authMiddleware.js';
import getUserData from './Model/getUserData.js';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dsagame-2425049-default-rtdb.firebaseio.com"
  });
}

const app = express();
const PORT = 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Route: Get user data for the home page
app.get('/user/home', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userData = await getUserData(userId);
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error retrieving user data:", error.message);
    res.status(500).json({ error: 'Failed to retrieve user data' });
  }
});

// Route: Save game score
app.post('/api/saveScore', async (req, res) => {
  const { uid, score, difficulty } = req.body;

  if (!uid || score === undefined || !difficulty) {
    console.log('Invalid data provided');
    return res.status(400).json({ error: 'Invalid data provided' });
  }

  try {
    const scoreRef = admin.database().ref(`users/${uid}/scores`).push();
    await scoreRef.set({ score, difficulty });
    res.status(200).json({ message: 'Score saved successfully' });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ error: 'Failed to save score', details: error.message });
  }
});

// Route: Create a challenge
app.post('/api/createChallenge', authenticateUser, async (req, res) => {
  const { challengee, scoreTarget, difficulty } = req.body;
  const challenger = req.user.uid; // Authenticated user's UID

  if (!challengee || !scoreTarget || !difficulty) {
    return res.status(400).json({ error: 'Invalid data provided' });
  }

  try {
    const challengeRef = admin.database().ref('challenges').push();
    await challengeRef.set({
      challenger,
      challengee,
      scoreTarget,
      difficulty,
      status: "pending",
      result: null
    });
    res.status(200).json({ message: 'Challenge created successfully', challengeId: challengeRef.key });
  } catch (error) {
    console.error("Error creating challenge:", error);
    res.status(500).json({ error: 'Failed to create challenge', details: error.message });
  }
});

// Route: Accept a challenge
app.post('/api/acceptChallenge', authenticateUser, async (req, res) => {
  const { challengeId } = req.body;

  if (!challengeId) {
    return res.status(400).json({ error: 'Challenge ID is required' });
  }

  try {
    const challengeRef = admin.database().ref(`challenges/${challengeId}`);
    const snapshot = await challengeRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    await challengeRef.update({ status: 'accepted' });
    res.status(200).json({ message: 'Challenge accepted successfully' });
  } catch (error) {
    console.error("Error accepting challenge:", error);
    res.status(500).json({ error: 'Failed to accept challenge', details: error.message });
  }
});

// Route: Update challenge result
app.post('/api/updateChallengeResult', authenticateUser, async (req, res) => {
  const { challengeId, result } = req.body;

  if (!challengeId || !result) {
    return res.status(400).json({ error: 'Challenge ID and result are required' });
  }

  try {
    const challengeRef = admin.database().ref(`challenges/${challengeId}`);
    const snapshot = await challengeRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    await challengeRef.update({ status: 'completed', result });
    res.status(200).json({ message: 'Challenge result updated successfully' });
  } catch (error) {
    console.error("Error updating challenge result:", error);
    res.status(500).json({ error: 'Failed to update challenge result', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
