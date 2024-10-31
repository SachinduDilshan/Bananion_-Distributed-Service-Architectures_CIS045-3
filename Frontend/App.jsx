import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { onAuthStateChanged, auth } from "../Model/Firebase.js"; // Adjust path if needed
import Home from "../VIew/Home.jsx";
import Register from "../VIew/Register.jsx";
import Login from "../VIew/Login.jsx";
import DifficultySelect from '../VIew/DifficultySelect.jsx';
import GamePlay from '../VIew/GamePlay.jsx';

function App() {
  // Define state to hold the authenticated user ID and difficulty level
  const [userId, setUserId] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set the user ID when a user is logged in
      } else {
        setUserId(null); // Reset user ID when no user is logged in
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        {/* Pass setSelectedDifficulty to DifficultySelect to allow difficulty selection */}
        <Route path="/select-difficulty" element={<DifficultySelect setDifficulty={setSelectedDifficulty} />} />
        {/* Pass selectedDifficulty and userId to GamePlay */}
        <Route path="/play" element={<GamePlay user={userId} difficulty={selectedDifficulty} />} />
      </Routes>
    </Router>
  );
}

export default App;
