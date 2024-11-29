import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const createChallenge = async (challenger, challengee, scoreTarget, difficulty) => {
  try {
    const response = await axios.post(`${BASE_URL}/createChallenge`, {
      challenger,
      challengee,
      scoreTarget,
      difficulty
    });
    return response.data;
  } catch (error) {
    console.error('Error creating challenge:', error.message);
    throw error;
  }
};

export const acceptChallenge = async (challengeId) => {
  try {
    const response = await axios.post(`${BASE_URL}/acceptChallenge`, { challengeId });
    return response.data;
  } catch (error) {
    console.error('Error accepting challenge:', error.message);
    throw error;
  }
};

export const updateChallengeResult = async (challengeId, result) => {
  try {
    const response = await axios.post(`${BASE_URL}/updateChallengeResult`, { challengeId, result });
    return response.data;
  } catch (error) {
    console.error('Error updating challenge result:', error.message);
    throw error;
  }
};
