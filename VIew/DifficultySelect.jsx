import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/difficult.css';
import Footer from './Footer.jsx';

function DifficultySelect({ setDifficulty, user }) {
  const navigate = useNavigate();

  const handleSelect = (level) => {
    setDifficulty(level);
    navigate("/play", { state: { difficulty: level } });
  };


  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100" >
      <div className="top-bar d-flex justify-content-between align-items-center w-100">
        <button onClick={() => navigate('/home')} className="back-btn">&larr;Back</button>
      </div>

      <h5 className="select-text">Pick a challenge!</h5>

      <div className="home-content">
        <button className="dif-btn" onClick={() => handleSelect("Beginner")}>Beginner</button>
        <button className="dif-btn" onClick={() => handleSelect("Intermediate")}>Intermediate</button>
        <button className="dif-btn" onClick={() => handleSelect("Expert")}>Expert</button>
      </div>
      <Footer />
    </div>
  );
}

export default DifficultySelect;
