import { useState, useEffect } from 'react';
import triviaFacts from '../Model/TriviaModel.js';

const useTriviaController = () => {
    const [currentFact, setCurrentFact] = useState("");
    const [defaultFactIndex, setDefaultFactIndex] = useState(0);

    useEffect(() => {
        const fetchTrivia = async () => {
            try {
                const response = await fetch("http://numbersapi.com/random/math");
                const fact = await response.text();
                setCurrentFact(fact);
            } catch (error) {
                console.error("Error fetching trivia:", error);
                // If API fails, use default trivia facts
                setCurrentFact(triviaFacts[defaultFactIndex]);
                setDefaultFactIndex((prevIndex) => (prevIndex + 1) % triviaFacts.length);
            }
        };

        //a new trivia fact every 7 seconds
        fetchTrivia();
        const interval = setInterval(fetchTrivia, 7000);

        return () => clearInterval(interval);
    }, [defaultFactIndex]);

    return currentFact;
};

export default useTriviaController;
