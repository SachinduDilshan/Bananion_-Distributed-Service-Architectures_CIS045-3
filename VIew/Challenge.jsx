import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, update, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "./Styles/Challenge.css";

function Challenge({ userId }) {
  const [challenges, setChallenges] = useState([]);
  const db = getDatabase();
  const navigate = useNavigate();

  // Fetch challenge
  useEffect(() => {
    const fetchChallenges = async () => {
      const challengesRef = ref(db, `users/${userId}/challenges`);
      const snapshot = await get(challengesRef);
      const challengesData = snapshot.val();

      if (challengesData) {
        const formattedChallenges = await Promise.all(
          Object.entries(challengesData).map(async ([id, challenge]) => {
            // Fetch the challenger's name
            const challengerName = await fetchChallengerName(challenge.challengerId);
            return {
              id,
              ...challenge,
              challengerName,
            };
          })
        );
        setChallenges(formattedChallenges);
      }
    };

    // Function to fetch challengers name from Firebase
    const fetchChallengerName = async (challengerId) => {
      if (!challengerId) return "Unknown";
      const challengerRef = ref(db, `users/${challengerId}`);
      const challengerSnapshot = await get(challengerRef);
      const challengerData = challengerSnapshot.val();
      return challengerData?.name || "Unknown";
    };

    fetchChallenges();
  }, [db, userId]);

  const acceptChallenge = async (challengeId) => {
    const challengeRef = ref(db, `users/${userId}/challenges/${challengeId}`);
    await update(challengeRef, { status: "accepted" });
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === challengeId
          ? { ...challenge, status: "accepted" }
          : challenge
      )
    );
    navigate("/difficulty");
  };


  const declineChallenge = async (challengeId) => {
    const challengeRef = ref(db, `users/${userId}/challenges/${challengeId}`);
    await update(challengeRef, { status: "declined" });
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === challengeId
          ? { ...challenge, status: "declined" }
          : challenge
      )
    );
    navigate("/challenge");
  };

  // Delete
  const deleteChallenge = async (challengeId) => {
    const challengeRef = ref(db, `users/${userId}/challenges/${challengeId}`);
    await remove(challengeRef);
    setChallenges((prevChallenges) =>
      prevChallenges.filter((challenge) => challenge.id !== challengeId)
    );
  };

  return (
    <div className="challenge-container">
      <div className="top-bar d-flex justify-content-between align-items-center w-100">
        <button onClick={() => navigate("/home")} className="back-btn">
          &larr; Back
        </button>
      </div>
      <h3>Challenges</h3>
      {challenges.length > 0 ? (
        <ul className="list-group">
          {challenges.map((challenge) => (
            <li
              key={challenge.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${challenge.status === "accepted"
                  ? "list-group-item-success"
                  : challenge.status === "declined"
                    ? "list-group-item-danger"
                    : ""
                }`}
            >
              <div>
                <p>
                  <strong>From:</strong> {challenge.challengerName || "Unknown"}
                </p>
                <p>
                  <strong>Difficulty:</strong> {challenge.difficulty}
                </p>
                <p>
                  <strong>Target Score:</strong> {challenge.targetScore || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {challenge.status || "pending"}
                </p>
              </div>
              <div className="button-group">
                {challenge.status === "pending" && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => acceptChallenge(challenge.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => declineChallenge(challenge.id)}
                    >
                      Decline
                    </button>
                  </>
                )}
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => deleteChallenge(challenge.id)}
                >
                  <i className="fas fa-trash-alt"></i> 
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No challenges available.</p>
      )}
    </div>
  );
}

export default Challenge;
