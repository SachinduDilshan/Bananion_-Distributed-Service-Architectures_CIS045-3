import React, { useEffect, useState } from 'react';
import { fetchGameInterface } from '../Model/GameModel';


const GameContainer = ({ userId, difficulty }) => {
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const loadGameData = async () => {
      const data = await fetchGameInterface();
      setGameData(data);
    };
    loadGameData();
  }, [userId]);

  return gameData ? <BananaGame gameData={gameData} difficulty={difficulty} /> : <p>Loading game...</p>;
};

export default GameContainer;
