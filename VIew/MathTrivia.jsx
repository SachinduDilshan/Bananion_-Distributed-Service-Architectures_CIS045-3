// views/MathTrivia.jsx
import React from 'react';
import useTriviaController from '../Controller/TriviaController.js';
import '../VIew/Styles/Mathrivia.css';

const MathTrivia = () => {
  const currentFact = useTriviaController();

  return (
    <div className="math-trivia">
      <h3>Fun Math Fact</h3>
      <p>{currentFact}</p>
    </div>
  );
};

export default MathTrivia;
