import { fetchUsersAndChallenges, submitChallenge } from "../Model/ChallengeModel";

//  to handle fetching users and challenges
export const handleFetchUsersAndChallenges = async (userId, setUserName, setPlayers, setSentChallenges) => {
  try {
    await fetchUsersAndChallenges(userId, setUserName, setPlayers, setSentChallenges);
  } catch (error) {
    console.error("Error fetching users and challenges:", error);
  }
};

//  to handle challenge submission
export const handleChallengeSubmit = async (userId, userName, targetPlayer, targetScore, difficulty, players) => {
  try {
    const message = await submitChallenge(userId, userName, targetPlayer, targetScore, difficulty, players);
    alert(message);
  } catch (error) {
    console.error("Error sending challenge:", error);
    alert(error.message || "Failed to send challenge. Please try again.");
  }
};
