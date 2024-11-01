import React, { useState, useEffect } from 'react';
import { fetchGameData } from '../Model/GameModel';

const BananaGame = ({ userId }) => {
  const [gameData, setGameData] = useState(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGameData = async () => {
      try {
        const data = await fetchGameData(userId);
        setGameData(data);
      } catch (err) {
        setError('Failed to load the game. Please try again later.');
      }
    };
    
    loadGameData();
  }, [userId]);

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    
    if (parseInt(answer) === gameData.correctAnswer) {
      alert("Correct!");
    } else {
      alert("Try again!");
    }
    setAnswer('');
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="banana-game">
      <h1>The Banana Game</h1>
      {gameData ? (
        <table className="game-grid">
          <tbody>
            {/* Render each row of the game grid */}
            {gameData.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    {cell === 'banana' ? '🍌' : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading game...</p>
      )}
      
      <form onSubmit={handleAnswerSubmit}>
        <label>Enter the missing digit:</label>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Answer"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BananaGame;
