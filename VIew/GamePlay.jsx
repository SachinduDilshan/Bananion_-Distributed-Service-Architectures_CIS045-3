import React, { useEffect, useState } from 'react';
import GameServer from '../Model/GameServer.js';

const GamePlay = () => {
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const loadGame = async () => {
      const gameServer = new GameServer();
      const game = await gameServer.getRandomGame();
      setGameData(game);
    };

    loadGame();
  }, []);

  if (!gameData) {
    return <p>Loading game...</p>;
  }

  return (
    <div>
      <h1>Math Game</h1>
      <div>
        <img src={gameData.image.src} alt="Game Image" />

        <p>Solution (for testing): {gameData.solution}</p>
      </div>
    </div>
  );
};

export default GamePlay;
