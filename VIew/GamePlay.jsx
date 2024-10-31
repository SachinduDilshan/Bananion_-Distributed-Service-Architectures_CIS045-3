import React, { useState, useEffect } from 'react';
import { fetchQuestions, saveScore } from '../Model/GameModel'; // Assuming fetchQuestions fetches the game data
import { useLocation, useNavigate } from 'react-router-dom';

const GamePlay = ({ user }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [questionData, setQuestionData] = useState(null); // Store fetched game data here
  const [answer, setAnswer] = useState('');

  // Set difficulty levels (seconds for each level)
  const difficultySettings = { beginner: 30, intermediate: 25, expert: 20 };

  useEffect(() => {
    // Set the timer based on difficulty level
    const difficultyTime = difficultySettings[state?.difficulty || 'beginner'];
    setTime(difficultyTime);

    // Fetch initial question data
    fetchQuestions()
      .then(data => setQuestionData(data))
      .catch(error => console.error('Error fetching questions:', error));

    // Timer countdown
    const timer = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleGameEnd(); // End game when time runs out
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.difficulty]);

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    // Check answer and update score accordingly
    if (parseInt(answer) === questionData.correctAnswer) {
      setScore(prevScore => prevScore + time); // Award points based on time remaining
      fetchQuestions().then(setQuestionData); // Fetch new question
    } else {
      handleGameEnd();
    }
    setAnswer(''); // Reset answer input
  };

  const handleGameEnd = async () => {
    await saveScore(user.uid, { score, difficulty: state.difficulty });
    navigate('/profile'); // Navigate to profile after submitting score
  };

  return (
    <div className="game-play-container">
      <h2>Time: {time}s</h2>
      <h3>Score: {score}</h3>
      <p>{questionData ? questionData.question : 'Loading...'}</p>
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
