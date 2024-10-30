// DifficultySelect.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DifficultySelect = () => {
  const navigate = useNavigate();

  const startGame = (difficulty) => {
    navigate('/play', { state: { difficulty } });
  };

  return (
    <div className="difficulty-container">
      <h2>Choose the difficulty level</h2>
      <button onClick={() => startGame('beginner')}>Beginner</button>
      <button onClick={() => startGame('intermediate')}>Intermediate</button>
      <button onClick={() => startGame('expert')}>Expert</button>
    </div>
  );
};

export default DifficultySelect;
