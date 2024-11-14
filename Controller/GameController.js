import * as GameModel from '../Model/GameModel';

export function initializeGame(difficulty) {
    return {
        timeLimit: GameModel.timeLimits[difficulty] || 60,
        maxWrongAnswers: GameModel.maxWrongAnswers,
        totalQuestions: GameModel.totalQuestions,
    };
}

export function handleAnswerSubmit(
    userAnswer,
    solution,
    correctAnswers,
    totalScore,
    setCorrectAnswers,
    setTotalScore,
    fetchNewQuestion,
    handleGameOver,
    wrongAnswers,
    setWrongAnswers,
    maxWrongAnswers,
    totalQuestions
) {
    const parsedUserAnswer = parseInt(userAnswer, 10);
    const parsedSolution = parseInt(solution, 10);

    if (parsedUserAnswer === parsedSolution) {
        setTotalScore((prevScore) => (prevScore + 10) * 2);
        setCorrectAnswers((prev) => prev + 1);

        if (correctAnswers + 1 >= totalQuestions) {
            handleGameOver();
        } else {
            fetchNewQuestion();
        }
    } else {
        handleWrongAnswer(wrongAnswers, setWrongAnswers, maxWrongAnswers, totalScore, setTotalScore, handleGameOver);
        alert('Wrong answer!');
    }
}



export function handleWrongAnswer(wrongAnswers, setWrongAnswers, maxWrongAnswers, totalScore, setTotalScore, handleGameOver) {
    setWrongAnswers((prev) => {
        const updatedWrongAnswers = prev + 1;
        if (updatedWrongAnswers > maxWrongAnswers) {
            handleGameOver();
        }
        return updatedWrongAnswers;
    });

    setTotalScore((prevScore) => Math.max(prevScore - 10, 0));
}


export function saveTotalScore(finalScore, difficulty) {
    GameModel.saveScoreToFirebase(finalScore, difficulty);
}
