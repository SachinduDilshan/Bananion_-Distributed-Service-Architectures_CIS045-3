import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware setup
app.use(cors({
  origin: "http://localhost:5173",  // Allow requests from this origin
  credentials: true                 // Allow cookies and credentials to be sent
}));
app.use(express.json());

// Mock login route
app.post('/user/login', (req, res) => {
  const { username, password } = req.body;

  // Basic login check
  if (username === 'testuser' && password === 'testpass') {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
