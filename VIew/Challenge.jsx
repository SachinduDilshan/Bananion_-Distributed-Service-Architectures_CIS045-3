import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set, update } from "firebase/database";
//import { useNavigate } from 'react-router-dom';

function Challenge({ userId }) {
  const [challenges, setChallenges] = useState([]); // Ensure it's initialized as an array
  const [loading, setLoading] = useState(true); // Add loading state for better UX
  
  const db = getDatabase();
 // const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      const challengesRef = ref(db, `users/challenges/${userId}`);
      onValue(challengesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert the object to an array for mapping
          const challengesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setChallenges(challengesArray);
        } else {
          setChallenges([]); // No challenges
        }
        setLoading(false); // Data loading finished
      });
    }
  }, [userId, db]);

  const acceptChallenge = async (challengeId) => {
    const challengeRef = ref(db, `users/challenges/${userId}/${challengeId}`);
    await update(challengeRef, { status: "accepted" });
    navigate('/difficulty');
  };

  const declineChallenge = async (challengeId) => {
    const challengeRef = ref(db, `users/challenges/${userId}/${challengeId}`);
    await update(challengeRef, { status: "declined" });
    navigate('/home');
  };

  if (loading) {
    return <div>Loading challenges...</div>; // Show loading indicator
  }

  return (
    <div>
      <h2>Challenges</h2>
      {challenges.length === 0 ? (
        <p>No challenges available.</p>
      ) : (
        <ul>
          {challenges.map((challenge) => (
            <li key={challenge.id}>
              <p>Challenger: {challenge.challenger}</p>
              <p>Target Score: {challenge.targetScore}</p>
              <p>Difficulty: {challenge.difficulty}</p>
              <p>Status: {challenge.status || "pending"}</p>
              {challenge.status === "pending" && (
                <div>
                  <button onClick={() => acceptChallenge(challenge.id)}>
                    Accept
                  </button>
                  <button onClick={() => declineChallenge(challenge.id)}>
                    Decline
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Challenge;
