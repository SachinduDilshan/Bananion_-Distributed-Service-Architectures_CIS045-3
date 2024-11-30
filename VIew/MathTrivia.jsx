import React from 'react';
import useTriviaController from '../Controller/TriviaController.js';
import '../VIew/Styles/Mathrivia.css';
import picture from './Styles/assets/funfact.png';

const MathTrivia = () => {
    const currentFact = useTriviaController();

    return (
        <div className="math-trivia">
            <img src={picture} alt="Fun Fact" className="fun-pic" />
            <p>{currentFact || "Loading trivia..."} </p>
        </div>
    );
};

export default MathTrivia;
