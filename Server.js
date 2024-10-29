// Server.js
import express from 'express';
import cors from 'cors';
import authenticateUser from './Middleware/authMiddleware.js';
import getUserData from './Model/getUserData.js'; // Import getUserData
import admin from './Model/firebaseadmin.js';

const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Define route
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
