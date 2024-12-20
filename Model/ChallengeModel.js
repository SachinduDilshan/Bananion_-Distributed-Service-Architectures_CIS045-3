import { getDatabase, ref, get, push, onValue } from "firebase/database";

// Fetch the list of users and challenges
export const fetchUsersAndChallenges = async (userId, setUserName, setPlayers, setSentChallenges) => {
  const db = getDatabase();

  const usersRef = ref(db, "users");
  const snapshot = await get(usersRef);
  const usersData = snapshot.val();

  if (usersData) {

    setUserName(usersData[userId]?.name || "Unnamed User");

    //LIst of other players
    const otherPlayers = Object.entries(usersData)
      .filter(([uid]) => uid !== userId) // Excluding the current logged in user
      .map(([uid, userData]) => ({
        uid,
        name: userData.name || "Unnamed Player",
      }));
    setPlayers(otherPlayers);
  }

  // Fetch the challenges sent by the logged in user
  const challengesRef = ref(db, `users/${userId}/sentChallenges`);
  onValue(challengesRef, (snapshot) => {
    const challengesData = snapshot.val();
    if (challengesData) {
      const challengesArray = Object.entries(challengesData).map(([id, challenge]) => ({ id, ...challenge }));
      setSentChallenges(challengesArray);
    } else {
      setSentChallenges([]);
    }
  });
};


export const submitChallenge = async (userId, userName, targetPlayer, targetScore, difficulty, players) => {
  const db = getDatabase();

  if (!targetPlayer || !targetScore) {
    throw new Error("Please fill in all fields!");
  }

  const challengeRef = ref(db, `users/${targetPlayer}/challenges`);
  const newChallenge = {
    challengerId: userId,
    challengerName: userName,
    difficulty,
    targetScore: parseInt(targetScore, 10),
    status: "pending",
  };

  // Pushing the challenge to the target player's challenges
  await push(challengeRef, newChallenge);

  // Add the challenge to the current user's sentChallenges
  const sentChallengeRef = ref(db, `users/${userId}/sentChallenges`);
  await push(sentChallengeRef, {
    targetPlayerName: players.find((p) => p.uid === targetPlayer)?.name,
    difficulty,
    targetScore: parseInt(targetScore, 10),
    status: "pending",
  });

  return "Challenge sent successfully!";
};
