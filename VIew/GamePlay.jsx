import React, { useEffect, useState } from 'react';
import { fetchQuestions, saveScore } from '../Model/GameModel.js';
import { useLocation, useNavigate } from 'react-router-dom';

const GamePlay = ({ user }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  // Check if difficulty is provided
  useEffect(() => {
    if (!state || !state.difficulty) {
      console.warn("Difficulty level not set. Redirecting to select difficulty.");
      navigate('/select-difficulty'); // Redirect if difficulty level is not set
    } else {
      setTime(difficultySettings[state.difficulty]);
      fetchQuestions().then(setQuestion);
    }
  }, [state, navigate]);

  // Back button handler with fallback
  const handleBackClick = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/select-difficulty'); // Fallback to difficulty selection screen
    }
  };

  const difficultySettings = {
    beginner: 30,
    intermediate: 25,
    expert: 20,
  };

  const submitScore = async () => {
    await saveScore(user.uid, { score, difficulty: state.difficulty });
    navigate('/profile');
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (parseInt(answer) === question.correctAnswer) {
      setScore((prevScore) => prevScore + time);
      fetchQuestions().then(setQuestion);
    } else {
      submitScore();
    }
  };

  return (
    <div className="game-play-container">
      <button className="back-btn" onClick={handleBackClick}>
        &larr; Back
      </button>
      <h2>Time: {time}s</h2>
      <h3>Score: {score}</h3>
      <p>{question}</p>
      <form onSubmit={handleAnswerSubmit}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter answer"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default GamePlay;
