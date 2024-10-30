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

  // Difficulty settings for timer
  const difficultySettings = {
    beginner: 30,
    intermediate: 25,
    expert: 20,
  };

  useEffect(() => {
    // Redirect to difficulty selection if `state.difficulty` is not provided
    if (!state || !state.difficulty) {
      console.warn("Difficulty level not set. Redirecting to select difficulty.");
      navigate("/select-difficulty");
      return;
    }

    // Set initial timer based on selected difficulty
    setTime(difficultySettings[state.difficulty]);
    fetchQuestions().then(setQuestion); // Fetch the first question

    // Start timer
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          submitScore(); // Submit score when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [state, navigate]);

  // Function to submit the user's score and redirect to profile
  const submitScore = async () => {
    await saveScore(user.uid, { score, difficulty: state.difficulty });
    navigate('/profile'); // Redirect to profile after submitting score
  };

  // Handle answer submission
  const handleAnswerSubmit = (e) => {
    e.preventDefault();

    // Check if the answer is correct
    if (parseInt(answer) === question.correctAnswer) {
      setScore((prevScore) => prevScore + time); // Award points based on remaining time
      setAnswer(''); // Clear answer input
      fetchQuestions().then(setQuestion); // Fetch a new question
    } else {
      submitScore(); // End game if answer is incorrect
    }
  };

  return (
    <div className="game-play-container">
      <h2>Time: {time}s</h2>
      <h3>Score: {score}</h3>
      {question ? (
        <p>{question.text}</p>
      ) : (
        <p>Loading question...</p>
      )}
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
