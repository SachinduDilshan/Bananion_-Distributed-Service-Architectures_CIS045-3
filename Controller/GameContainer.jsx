import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, update } from 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';

function GameContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { difficulty } = location.state || {};
  const timeLimits = { Beginner: 50060, Intermediate: 45, Expert: 30 };
  const [timeRemaining, setTimeRemaining] = useState(timeLimits[difficulty] || 60);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const maxWrongAnswers = 2;
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const totalQuestions = 5;

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
   navigate('/profile');
  };

  const handleSubmitAnswer = () => {
    const parsedUserAnswer = parseInt(userAnswer, 10);
    const parsedSolution = parseInt(solution, 10);

    if (parsedUserAnswer === parsedSolution) {
      setCorrectAnswers((prev) => {
        const updatedCorrectAnswers = prev + 1;
        
        if (updatedCorrectAnswers >= totalQuestions) {
          calculateAndSaveScore();
        } else {
          fetchQuestion();
        }
        return updatedCorrectAnswers;
      });
    } else {
      handleWrongAnswer();
      alert('Wrong answer!');
    }
  };

  const calculateAndSaveScore = () => {
    const score = timeRemaining * 10;
    saveScore(score);
  };

  const saveScore= (userId, difficulty, score) => {
    const db = getDatabase();
    const userScoresRef = ref(db, `users/${userId}/scores/${difficulty}`);
  
    
    update(userScoresRef, score)
      .then(() => {
        console.log('Score saved successfully.');
       navigate('/play');
      })
      .catch((error) => {
        console.error('Error saving score:', error);
      });
  };

  return (
    <div className="container">
      <div className="card p-5 shadow-lg border-0" style={{ maxWidth: '800px', maxHeight: 'auto', margin: '0 auto' }}>
        <h1 className="text-center mb-4 display-5 text-primary">{difficulty} Level</h1>
        
        <div className="d-flex justify-content-between mb-4">
          <div className="alert alert-info flex-fill text-center me-2 p-3">
            <h5 className="mb-0">Time Remaining: <span className="fw-bold">{timeRemaining}s</span></h5>
          </div>
          <div className="alert alert-warning flex-fill text-center ms-2 p-3">
            <h5 className="mb-0">Wrong Answers: <span className="fw-bold">{wrongAnswers} / {maxWrongAnswers}</span></h5>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <p className="fs-4 fw-semibold">Solve the equation:</p>
          {question ? (
            <img src={question} alt="Game question" className="img-fluid border rounded" style={{ maxWidth: '300px' }} />
          ) : (
            <p>Loading question...</p>
          )}
        </div>
        
        <div className="mb-4">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="form-control form-control-lg text-center"
          />
        </div>
        
        <div className="text-center">
          <button onClick={handleSubmitAnswer} className="btn btn-success btn-lg px-5">
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameContainer;