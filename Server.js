import express from 'express';
import cors from 'cors';
import userRoutes from './route/UserRoute.cjs'; // Adjust the path as necessary

const app = express();
const port = 3000;

// Middleware setup
app.use(cors({
  origin: "http://localhost:5173",  // Allow requests from this origin
  credentials: true                 // Allow cookies and credentials to be sent
}));
app.use(express.json());

// Use the user routes
app.use('/user', userRoutes); // Make sure this is correctly set

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
