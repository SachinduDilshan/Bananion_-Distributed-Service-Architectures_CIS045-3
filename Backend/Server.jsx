const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
app.use(express.json()); // Ensure you can handle JSON requests


app.use(cors({
  origin: "http://localhost:5173", // Adjust this to the frontend's URL
}));


// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Bananiondb", // Your actual database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to database.");
  }
});

app.post("/register", (req, res) => {
  const { name, age, password } = req.body;

  if (!name || !age || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "INSERT INTO users (name, age, password) VALUES (?, ?, ?)";
  db.query(query, [name, age, password], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json({ message: "User registered successfully" });
  });
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

/*================================Login=======================*/

app.post("/login", (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Both fields are required" });
  }

  const query = "SELECT * FROM users WHERE name = ? AND password = ?";
  db.query(query, [name, password], (err, result) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});
