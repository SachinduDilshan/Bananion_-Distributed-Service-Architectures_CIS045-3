// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../VIew/Home.jsx";
import Register from "../VIew/Register.jsx";
import Login from "../VIew/Login.jsx";
import DifficultySelect from "../VIew/DifficultySelect.jsx";
import GamePlay from "../VIew/GamePlay.jsx";

function App({ user }) {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/select-difficulty" element={<DifficultySelect />} />

        {/* Game Route with user prop */}
        <Route path="/play" element={<GamePlay user={user} difficulty={selectedDifficulty} />} />

      </Routes>
    </Router>
  );
}

export default App;
