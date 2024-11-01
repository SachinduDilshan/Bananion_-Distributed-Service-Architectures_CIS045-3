// Server.js
import express from 'express';
import cors from 'cors';
import authenticateUser from './Middleware/authMiddleware.js';
import getUserData from './Model/getUserData.js'; // Import getUserData
import axios from 'axios'; // Import axios for making HTTP requests

const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Define route for user data
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

// New route to fetch data from the external API via server-side proxy
app.get('/api/banana', async (req, res) => {
  const userId = req.query.user; // Get user ID from query parameter
  const url = `https://marcconrad.com/uob/banana/?user=${userId}`;

  try {
    const response = await axios.get(url); // Server-side fetch
    res.status(200).json(response.data); // Send data back to frontend
  } catch (error) {
    console.error("Error fetching data from the external API:", error.message);
    res.status(500).json({ error: 'Failed to fetch data from the external API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
