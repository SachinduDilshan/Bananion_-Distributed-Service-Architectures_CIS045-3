import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Home from "../VIew/Home.jsx";
import Register from "../VIew/Register.jsx";
import Login from "../VIew/Login.jsx";
import DifficultySelect from '../VIew/DifficultySelect.jsx';
import GameContainer from '../VIew/GameContainer.jsx';
import Profile from "../VIew/Profile.jsx";

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
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/difficulty"
          element={<DifficultySelect setDifficulty={setSelectedDifficulty} userId={userId} />}
        />
        <Route path="/play" element={userId && selectedDifficulty ? (<GameContainer userId={userId} difficulty={selectedDifficulty} />) : 
        ( <Navigate to="/difficulty" replace />)
        }
        />
        <Route path="/profile" element={userId ? <Profile userId={userId} /> : <Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
