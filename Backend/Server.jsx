const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const PORT = 5173;

app.use(bodyParser.json());
app.use(cors());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",             
  password: "",             
  database: "bananiondb",      
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database Bananadb");
});

app.post("/register", (req, res) => {
  const { name, age, password } = req.body;

 
  if (!name || !age || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const checkUserQuery = "SELECT * FROM users WHERE name = ?";
  db.query(checkUserQuery, [name], (err, result) => {
    if (err) {
      console.error("Error checking user:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const insertUserQuery = "INSERT INTO users (name, age, password) VALUES (?, ?, ?)";
    db.query(insertUserQuery, [name, age, password], (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ success: false, message: "Server error" });
      }
      res.json({ success: true, message: "User registered successfully" });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
