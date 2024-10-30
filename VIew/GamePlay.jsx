// GamePlay.jsx
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

  const difficultySettings = {
    beginner: 30,
    intermediate: 25,
    expert: 20,
  };

  useEffect(() => {
    // Set initial timer based on difficulty
    setTime(difficultySettings[state.difficulty]);
    fetchQuestions().then(setQuestion); // Fetch initial question

    // Timer logic
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          submitScore(); // Submit score when time runs out
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.difficulty]);

  const submitScore = async () => {
    await saveScore(user.uid, { score, difficulty: state.difficulty });
    navigate('/profile'); // Redirect to profile after submitting score
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    // Example scoring logic: increase score based on remaining time
    if (parseInt(answer) === question.correctAnswer) { // Check answer
      setScore((prevScore) => prevScore + time); // Higher score for faster answers
      fetchQuestions().then(setQuestion); // Fetch new question
    } else {
      submitScore();
    }
  };

  return (
    <div className="game-play-container">
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
