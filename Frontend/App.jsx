// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../VIew/Home.jsx";
import Register from "../VIew/Register.jsx";
import Login from "../VIew/Login.jsx";
import DifficultySelect from '../VIew/DifficultySelect.jsx';
import GamePlay from '../VIew/GamePlay.jsx';

function App({user}) {
  // Step 1: Define selectedDifficulty state
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        {/* Step 2: Pass setSelectedDifficulty to DifficultySelect */}
        <Route path="/select-difficulty" element={<DifficultySelect setDifficulty={setSelectedDifficulty} />}
        />
        {/* Step 3: Pass selectedDifficulty as a prop to GamePlay */}
        <Route path="/play" element={<GamePlay user={user} difficulty={selectedDifficulty} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
