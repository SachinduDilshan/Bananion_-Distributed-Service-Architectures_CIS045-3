import express from 'express';
import cors from 'cors';
import authenticateUser from './Middleware/authMiddleware.js';
import getUserData from './Model/getUserData.js'; 
import fetch from 'node-fetch';
import axios from 'axios'; 

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


app.get('/banana-api', async (req, res) => {
  try {
    const response = await fetch('http://marcconrad.com/uob/banana/api.php');
    const data = await response.json(); 
    res.set('Access-Control-Allow-Origin', '*'); 
    res.json(data);
  } catch (error) {
    console.error('Error fetching Banana API:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
