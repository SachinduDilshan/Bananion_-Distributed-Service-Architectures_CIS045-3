import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/home.css';

function DifficultySelect({ setDifficulty }) {
  const navigate = useNavigate();

  const handleSelect = (level) => {
    setDifficulty(level);
    navigate("/play"); // Navigate to GamePlay after setting difficulty
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">

      <h5 className='select-text'>Choose the difficulty level</h5>

      <div className="home-content">
        <button className='custom-btn' onClick={() => handleSelect("Beginner")}>Beginner</button>
        <button className='custom-btn' onClick={() => handleSelect("Intermediate")}>Intermediate</button>
        <button className='custom-btn' onClick={() => handleSelect("Expert")}>Expert</button>
      </div>

    </div>
  );
}

export default DifficultySelect;
