import React, { useEffect, useState } from 'react';
import { fetchGameInterface } from '../Model/GameModel';

function GameContainer() {
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);

  const loadGameData = async () => {
    try {
      const data = await fetchGameInterface();
      if (data) {
        setGameData(data);
      } else {
        setError("Failed to load game data");
      }
    } catch (error) {
      console.error('Error loading game data:', error);
      setError("Error loading game data");
    }
  };

  useEffect(() => {
    loadGameData();
  }, []);

  if (error) return <p>{error}</p>;
  if (!gameData) return <p>Loading game data...</p>;

  return (
    <div>
      {/* Render game interface */}
      <h3>Game Loaded!</h3>
      <p>Solution: {gameData.solution}</p>
      {/* Render other game details and interactive elements here */}
    </div>
  );
}

export default GameContainer;
