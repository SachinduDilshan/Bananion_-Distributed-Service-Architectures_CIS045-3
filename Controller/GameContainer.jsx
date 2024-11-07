import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function GameContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { difficulty } = location.state || {};
  const timeLimits = { Beginner: 60, Intermediate: 45, Expert: 30 };
  const [timeRemaining, setTimeRemaining] = useState(timeLimits[difficulty] || 60);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const maxWrongAnswers = 2;
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');

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
  }, [difficulty, navigate]);

  const fetchQuestion = async () => {
    try {
      const response = await fetch('https://marcconrad.com/uob/banana/api.php');
      const data = await response.json();
      setQuestion(data.question); 
      setSolution(data.solution); 
      setUserAnswer(''); 
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  useEffect(() => {
    fetchQuestion(); 
  }, []);

  const handleWrongAnswer = () => {
    setWrongAnswers((prev) => {
      const updatedWrongAnswers = prev + 1;
      if (updatedWrongAnswers > maxWrongAnswers) {
        handleGameOver();
      }
      return updatedWrongAnswers;
    });
  };

  const handleGameOver = () => {
    alert('Game Over!');
    navigate('/home');
  };

  const handleSubmitAnswer = () => {
    const parsedUserAnswer = parseInt(userAnswer, 10);
    const parsedSolution = parseInt(solution, 10);

    if (parsedUserAnswer === parsedSolution) {
      alert('Correct answer!');
      fetchQuestion(); 
    } else {
      handleWrongAnswer();
      alert('Wrong answer!');
    }
  };

  return (
    <div className="gameplay-container">
      <h1>Game Play - {difficulty} Level</h1>
      <div className="timer">Time Remaining: {timeRemaining}s</div>
      <div className="wrong-answers">
        Wrong Answers: {wrongAnswers} / {maxWrongAnswers}
      </div>
      <div className="question">
        <p>Solve the equation:</p>
        {question ? (
          <img src={question} alt="Game question" style={{ width: '300px', height: 'auto' }} />
        ) : (
          <p>Loading question...</p>
        )}
      </div>
      <input
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Enter your answer"
      />
      <button onClick={handleSubmitAnswer}>Submit Answer</button>
    </div>
  );
}

export default GameContainer;
