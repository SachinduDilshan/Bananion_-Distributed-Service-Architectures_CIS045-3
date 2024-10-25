const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session = require('express-session');

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bananiondb",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to database.");
  }
});

app.use(session({
  secret: 'mykey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use((req, res, next) => {
  if (!req.session) {
    return next(new Error('Session is not initialized'));
  }
  next();
});

/*================================Register=======================*/
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

/*================================Login=======================*/
app.post("/login", (req, res) => {
  const { name, password } = req.body;

  const query = "SELECT * FROM users WHERE name = ? AND password = ?";
  db.query(query, [name, password], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
      // Set the userId in session after successful login
      req.session.uid = result[0].uid;  // Ensure this matches your database schema
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

/*================================User Data===========================*/
app.get("/user", (req, res) => {
  // Check if session contains user ID
  const uid = req.session.uid;

  if (!uid) {
    // If no session exists, respond with a 401 Unauthorized status
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Query the database for the user's information
  const query = "SELECT * FROM users WHERE uid = ?"; // Ensure the field 'id' matches your schema
  db.query(query, [uid], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
      // Return the user data if found
      res.status(200).json(result[0]);
    } else {
      // If no user is found in the database
      res.status(404).json({ message: "User not found" });
    }
  });
});


/*==========================LOg out=========================*/
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



