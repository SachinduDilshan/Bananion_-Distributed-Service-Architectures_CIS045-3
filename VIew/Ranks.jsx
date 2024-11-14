// View/GameContainer.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchQuestion } from '../Model/GameModel';
import * as GameController from '../Controller/GameController';
import '../View/Styles/gamestyle.css';

function GameContainer() {  
  const totalQuestions = 35;
  const location = useLocation();
  const navigate = useNavigate();
  const { difficulty } = location.state || {};
  const gameSettings = GameController.initializeGame(difficulty);

  const [timeRemaining, setTimeRemaining] = useState(gameSettings.timeLimit);
  const [highlightTime, setHighlightTime] = useState(false);  // New state for time highlight effect
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const goToProfile = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  const handleGameOver = useCallback(() => {
    GameController.saveTotalScore(totalScore, difficulty);
    alert(`Game Over! Your final score: ${totalScore}`);
    goToProfile();
  }, [totalScore, goToProfile, difficulty]);

  useEffect(() => {
    if (!difficulty) {
      navigate('/difficulty');
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [difficulty, handleGameOver, navigate]);

  const fetchNewQuestion = async () => {
    const data = await fetchQuestion();
    if (data) {
      setQuestion(data.question);
      setSolution(data.solution);
      setUserAnswer('');
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, []);

  const handleSubmitAnswer = () => {
    if (userAnswer === solution.toString()) {  // Check if answer is correct
      setCorrectAnswers(correctAnswers + 1);

      // Determine extra time based on difficulty level
      let extraTime = 0;
      if (difficulty === 'Beginner') extraTime = 4;
      else if (difficulty === 'Intermediate') extraTime = 3;
      else if (difficulty === 'Expert') extraTime = 2;

      // Add extra time and apply highlight effect
      setTimeRemaining((prevTime) => prevTime + extraTime);
      setHighlightTime(true);
      setTimeout(() => setHighlightTime(false), 500);  // Remove highlight after 500ms

      // Fetch new question and update score
      setTotalScore((prevScore) => prevScore + (extraTime * 10));  // Example scoring mechanism
      fetchNewQuestion();
    } else {
      setWrongAnswers(wrongAnswers + 1);
      if (wrongAnswers + 1 >= gameSettings.maxWrongAnswers) {
        handleGameOver();
      }
    }
  };

  return (
    <div className="gameplay-container">
      <button onClick={() => navigate('/difficulty')} className="back-btn">Exit the Game</button>
      <div className="game-card">
        <h6 className="game-title">{difficulty} Level</h6>

        <div className="status-container">
          <div className={`status time-remaining ${highlightTime ? 'highlight' : ''}`}>
            <span>Time Remaining</span>
            <span className="time">{timeRemaining}s</span>
          </div>
          <div className="status wrong-answers">
            <span>Wrong Answers!</span>
            <span className="answers">{wrongAnswers} / {gameSettings.maxWrongAnswers}</span>
          </div>
        </div>

        <div className="question-section">
          <p className="question-prompt">Find the hidden number...</p>
          <div className="question-answer-container">
            {question ? (
              <img src={question} alt="Game question" className="question-image" />
            ) : (
              <p>Loading question...</p>
            )}
            <div className="answer-input-container">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="answer-input"
              />
              <button onClick={handleSubmitAnswer} className="submit-button">
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameContainer;
