import React, { useEffect, useState } from 'react';
import { fetchGameInterface } from '../Model/GameModel.js';

function GameContainer({ difficulty }) {
  const [gameData, setGameData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const timeLimits = {
    Beginner: 30,
    Intermediate: 25,
    Expert: 20,
  };

  const loadGameData = async () => {
    const data = await fetchGameInterface();
    if (data) {
      setGameData(data);
      setTimeRemaining(timeLimits[difficulty] || 30);
    } else {
      setFeedback("Failed to load game data");
    }
  };

  useEffect(() => {
    loadGameData();
  }, []);

  useEffect(() => {
    if (timeRemaining > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      setGameOver(true);
      setFeedback("Time's up!");
    }
  }, [timeRemaining, gameOver]);

  const handleAnswerSubmit = () => {
    if (parseInt(userAnswer, 10) === gameData.solution) {
      setFeedback("Correct! Well done!");
      setGameOver(true);
    } else {
      setWrongAnswers(wrongAnswers + 1);
      if (wrongAnswers + 1 >= 3) {
        setGameOver(true);
        setFeedback("Game Over: Too many wrong answers.");
      } else {
        setFeedback("Incorrect, try again.");
      }
    }
    setUserAnswer('');
  };

  if (!gameData) return <p>Loading game data...</p>;
  if (gameOver) return <p>{feedback}</p>;

  return (
    <div>
      <h3>Game Loaded!</h3>
      <p>Time Remaining: {timeRemaining} seconds</p>
      <p>Wrong Answers: {wrongAnswers} (Max: 2)</p>
      <img src={`data:image/png;base64,${gameData.base64Image}`} alt="Game Image" />

      <div>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter your answer"
          disabled={gameOver}
        />
        <button onClick={handleAnswerSubmit} disabled={gameOver}>Submit Answer</button>
      </div>

      <p>{feedback}</p>
    </div>
  );
}

export default GameContainer;
