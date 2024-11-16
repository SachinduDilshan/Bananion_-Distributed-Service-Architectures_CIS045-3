import { useState, useEffect } from 'react';
import triviaFacts from '../Model/TriviaModel.js';

const useTriviaController = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % triviaFacts.length);
    }, 7000); //changes fact for every 7s

    return () => clearInterval(interval);
  }, []);

  return triviaFacts[currentFactIndex];
};

export default useTriviaController;
