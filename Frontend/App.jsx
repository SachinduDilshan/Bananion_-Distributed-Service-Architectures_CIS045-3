import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Home from "../VIew/Home.jsx";
import Register from "../VIew/Register.jsx";
import Login from "../VIew/Login.jsx";
import DifficultySelect from '../VIew/DifficultySelect.jsx';
import GameContainer from '../VIew/GameContainer.jsx';
import Profile from "../VIew/Profile.jsx";
import Ranks from "../VIew/Ranks.jsx";


function App() {
  const [userId, setUserId] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log("Logged in user ID:", user.uid);
      } else {
        setUserId(null);
        console.log("No user is logged in.");
      }
    });

    return () => unsubscribe();
  }, [auth]);



  return (
    <Router>
      <Routes>
        
        {/* Default route for login page */}
        <Route path="/" element={<Login />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />

        <Route path="/ranks" element={<Ranks />} />

        {/* Home page, only accessible to logged-in users */}
        <Route path="/home" element={userId ? <Home /> : <Navigate to="/" replace />} 
        />

        {/* Difficulty selection page, only accessible to logged-in users */}
        <Route
          path="/difficulty"
          element={userId ? (
            <DifficultySelect setDifficulty={setSelectedDifficulty} userId={userId} />
          ) : (
            <Navigate to="/" replace />
          )}
        />

        {/* Game play page, requires both user login and selected difficulty */}
        <Route
          path="/play"
          element={
            userId && selectedDifficulty ? (
              <GameContainer userId={userId} difficulty={selectedDifficulty} />
            ) : (
              <Navigate to="/difficulty" replace />
            )
          }
        />

        {/* Profile page, accessible only to logged-in users */}
        <Route
          path="/profile"
          element={userId ? <Profile userId={userId} /> : <Navigate to="/" replace />}
        />

        {/* Redirect any unknown paths to the login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
