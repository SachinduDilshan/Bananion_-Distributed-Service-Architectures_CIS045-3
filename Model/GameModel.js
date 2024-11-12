/*export async function fetchGameInterface() {
  const apiURL = 'https://marcconrad.com/uob/banana/api.php';

  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Failed to fetch from API:', error);

    
    const mockData = {
      base64Image: 'iVBORw0KGgoAAAANSUhEUgAAA...', 
      solution: 8,
    };
    console.warn('Using mock data as a fallback');
    return mockData;
  }
}*/

// GameModel.js

// Initializes game state based on difficulty
// GameModel.js

// Function to retrieve time limit based on difficulty level
const getTimeLimit = (difficulty) => {
  return { Beginner: 61, Intermediate: 46, Expert: 11 }[difficulty] || 60;
};

// Initializes game state based on difficulty
export const initialGameState = (difficulty) => ({
  timeRemaining: getTimeLimit(difficulty),
  wrongAnswers: 0,
  correctAnswers: 0,
  cumulativeScore: 0,
  totalQuestions: 5,
  userAnswer: '',
});

// Define max wrong answers for reuse
export const getMaxWrongAnswers = () => 2;

