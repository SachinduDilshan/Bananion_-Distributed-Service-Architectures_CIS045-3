import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import '../VIew/Styles/gamestyle.css';
import axios from 'axios';

function GameContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { difficulty } = location.state || {};
  const timeLimits = { Beginner: 61, Intermediate: 46, Expert: 31 };
  const [timeRemaining, setTimeRemaining] = useState(timeLimits[difficulty] || 60);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const maxWrongAnswers = 2;
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const totalQuestions = 35;
  const [totalScore, setTotalScore] = useState(0); // Accumulated score

  // Function to navigate to profile after game over
  const goToProfile = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  // Handle game over and save score
  const handleGameOver = useCallback(() => {
    saveTotalScoreToFirebase(totalScore); // Save the final score to Firebase at game end
    alert(`Game Over! Your final score: ${totalScore}`);
    goToProfile(); // Navigate to profile after game over
  }, [totalScore, goToProfile]);

  useEffect(() => {
    if (!difficulty) {
      navigate('/difficulty');
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver(); // Trigger game over if time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [difficulty, handleGameOver, navigate]);

  const fetchQuestion = async () => {
    try {
      const response = await fetch('https://marcconrad.com/uob/banana/api.php?out=json');
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
    setTotalScore((prevScore) => Math.max(prevScore - 10, 0));
  };
  
  const handleSubmitAnswer = () => {
    const parsedUserAnswer = parseInt(userAnswer, 10);
    const parsedSolution = parseInt(solution, 10);
  
    if (parsedUserAnswer === parsedSolution) {
      setTotalScore((prevScore) => (prevScore + 10)*2);
      setCorrectAnswers((prev) => prev + 1);
  
      if (correctAnswers + 1 >= totalQuestions) {
        handleGameOver(); 
      } else {
        fetchQuestion(); 
      }
    } else {
      handleWrongAnswer(); 
      alert('Wrong answer!');
    }
  };
  

  const saveTotalScoreToFirebase = async (finalScore) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log('No authenticated user');
      return;
    }

    const uid = user.uid;
    console.log('User authenticated, UID:', uid);

    try {
      await axios.post('http://localhost:3000/api/saveScore', { uid, score: finalScore, difficulty });
      console.log('Total score saved successfully');
    } catch (error) {
      console.error('Error saving total score:', error.message);
    }
  };

  return (
    <div className="gameplay-container">
      <button onClick={() => navigate('/difficulty')} className="back-btn">Exit the Game</button>
      <div className="game-card">
        <h6 className="game-title">{difficulty} Level</h6>

        <div className="status-container">
          <div className="status time-remaining">
            <span>Time Remaining</span>
            <span className="time">{timeRemaining}s</span>
          </div>
          <div className="status wrong-answers">
            <span>Wrong Answers!</span>
            <span className="answers">{wrongAnswers} / {maxWrongAnswers}</span>
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
