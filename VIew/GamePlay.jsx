import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Styles/home.css';

function GamePlay() {
  const location = useLocation();
  const navigate = useNavigate();
  const { difficulty } = location.state || {};

  // Set initial time limit and wrong answers based on difficulty level
  const timeLimits = { Beginner: 30, Intermediate: 25, Expert: 20 };
  const [timeRemaining, setTimeRemaining] = useState(timeLimits[difficulty] || 30);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const maxWrongAnswers = 2;

  useEffect(() => {
    // Redirect if no difficulty level is selected
    if (!difficulty) {
      navigate('/difficulty');
    }

    // Start the countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Handle game over due to time up
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [difficulty, navigate]);

  const handleWrongAnswer = () => {
    setWrongAnswers((prev) => {
      const updatedWrongAnswers = prev + 1;
      if (updatedWrongAnswers > maxWrongAnswers) {
        handleGameOver(); // Handle game over due to too many wrong answers
      }
      return updatedWrongAnswers;
    });
  };

  const handleGameOver = () => {
    alert('Game Over!');
    navigate('/home'); // Navigate back to the home page or results page
  };

  return (
    <div className="gameplay-container">
      <h1>Game Play - {difficulty} Level</h1>
      <div className="timer">Time Remaining: {timeRemaining}s</div>
      <div className="wrong-answers">
        Wrong Answers: {wrongAnswers} / {maxWrongAnswers}
      </div>
      {/* Game content goes here, such as questions, answer options, etc. */}
      {/* For example: */}
      <div className="question">Solve the equation: 5 + 3</div>
      <button onClick={handleWrongAnswer}>Submit Wrong Answer (for testing)</button>
    </div>
  );
}

export default GamePlay;
