// controllers/TriviaController.js
import { useState, useEffect } from 'react';
import triviaFacts from '../Model/TriviaModel.js';

const useTriviaController = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % triviaFacts.length);
    }, 5000); // Change fact every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return triviaFacts[currentFactIndex];
};

export default useTriviaController;
