import { createChallenge, acceptChallenge, updateChallengeResult } from '../Model/ChallengeModel';

export const handleCreateChallenge = async (challenger, challengee, scoreTarget, difficulty) => {
  try {
    const response = await createChallenge(challenger, challengee, scoreTarget, difficulty);
    console.log('Challenge created:', response.message);
    return response;
  } catch (error) {
    console.error('Error handling challenge creation:', error.message);
    throw error;
  }
};

export const handleAcceptChallenge = async (challengeId) => {
  try {
    const response = await acceptChallenge(challengeId);
    console.log('Challenge accepted:', response.message);
    return response;
  } catch (error) {
    console.error('Error handling challenge acceptance:', error.message);
    throw error;
  }
};

export const handleUpdateChallengeResult = async (challengeId, result) => {
  try {
    const response = await updateChallengeResult(challengeId, result);
    console.log('Challenge result updated:', response.message);
    return response;
  } catch (error) {
    console.error('Error handling challenge result update:', error.message);
    throw error;
  }
};
