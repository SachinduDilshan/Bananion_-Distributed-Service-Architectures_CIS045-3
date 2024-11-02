import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/home.css';

function DifficultySelect({ setDifficulty, user }) {
  const navigate = useNavigate();

  const handleSelect = (level) => {
    setDifficulty(level);
    navigate("/play", { state: { difficulty: level } }); 
  };

  const handleBackClick = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate("/home"); 
    } 
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div className="top-bar d-flex justify-content-between align-items-center w-100">
        <button className="back-btn" onClick={handleBackClick}>
          &larr; Back
        </button>          
      </div>

      <h5 className="select-text">Pick a challenge!</h5>

      <div className="home-content">
        <button className="custom-btn" onClick={() => handleSelect("Beginner")}>Beginner</button>
        <button className="custom-btn" onClick={() => handleSelect("Intermediate")}>Intermediate</button>
        <button className="custom-btn" onClick={() => handleSelect("Expert")}>Expert</button>
      </div>
    </div>
  );
}

export default DifficultySelect;
