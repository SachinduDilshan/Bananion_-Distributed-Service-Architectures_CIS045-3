import express from 'express';
import cors from 'cors';
import authenticateUser from './Middleware/authMiddleware.js';
import getUserData from './Model/getUserData.js'; 
import admin from 'firebase-admin';


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



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
