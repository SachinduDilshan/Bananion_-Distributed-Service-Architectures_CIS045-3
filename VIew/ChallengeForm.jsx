import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, push, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "./Styles/ChallengeForm.css"; // Custom CSS file

function ChallengeForm({ userId }) {
  const [players, setPlayers] = useState([]);
  const [sentChallenges, setSentChallenges] = useState([]); // State for sent challenges
  const [targetPlayer, setTargetPlayer] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [targetScore, setTargetScore] = useState("");
  const [userName, setUserName] = useState(""); // State for the current user's name
  const navigate = useNavigate();

  const db = getDatabase();

  // Fetch the current user's name, list of players, and sent challenges
  useEffect(() => {
    const fetchUsersAndChallenges = async () => {
      const usersRef = ref(db, "users");
      const snapshot = await get(usersRef);
      const usersData = snapshot.val();

      if (usersData) {
        // Set the current user's name
        setUserName(usersData[userId]?.name || "Unnamed User");

        // Set the list of other players
        const otherPlayers = Object.entries(usersData)
          .filter(([uid]) => uid !== userId) // Exclude the current user
          .map(([uid, userData]) => ({
            uid,
            name: userData.name || "Unnamed Player",
          }));
        setPlayers(otherPlayers);
      }

      // Fetch the challenges sent by the current user
      const challengesRef = ref(db, `users/${userId}/sentChallenges`);
      onValue(challengesRef, (snapshot) => {
        const challengesData = snapshot.val();
        if (challengesData) {
          const challengesArray = Object.entries(challengesData).map(
            ([id, challenge]) => ({ id, ...challenge })
          );
          setSentChallenges(challengesArray);
        } else {
          setSentChallenges([]);
        }
      });
    };

    fetchUsersAndChallenges();
  }, [db, userId]);

  // Handle form submission
  const handleChallengeSubmit = async (e) => {
    e.preventDefault();
    if (!targetPlayer || !targetScore) {
      alert("Please fill in all fields!");
      return;
    }

    // Define the new challenge
    const challengeRef = ref(db, `users/${targetPlayer}/challenges`);
    const newChallenge = {
      challengerId: userId,
      challengerName: userName,
      difficulty,
      targetScore: parseInt(targetScore, 10),
      status: "pending",
    };

    try {
      // Push the challenge to the target player's challenges
      await push(challengeRef, newChallenge);

      // Add the challenge to the current user's sentChallenges
      const sentChallengeRef = ref(db, `users/${userId}/sentChallenges`);
      await push(sentChallengeRef, {
        targetPlayerName: players.find((p) => p.uid === targetPlayer)?.name,
        difficulty,
        targetScore: parseInt(targetScore, 10),
        status: "pending",
      });

      alert("Challenge sent successfully!");
      setTargetPlayer("");
      setTargetScore("");
    } catch (error) {
      console.error("Error sending challenge:", error);
      alert("Failed to send challenge. Please try again.");
    }
  };

  return (
    <div className="challenge-form-container d-flex">
      {/* Left side: Sent challenges */}
      <div className="sent-challenges bg-light p-3 border rounded shadow-lg">
        <h5 className="text-center">Sent Challenges</h5>
        {sentChallenges.length > 0 ? (
          <ul className="list-group">
            {sentChallenges.map((challenge) => (
              <li
                key={challenge.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>To:</strong> {challenge.targetPlayerName} <br />
                  <strong>Difficulty:</strong> {challenge.difficulty} <br />
                  <strong>Score:</strong> {challenge.targetScore}
                </div>
                <span
                  className={`badge ${
                    challenge.status === "pending"
                      ? "bg-warning"
                      : challenge.status === "accepted"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {challenge.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No challenges sent yet.</p>
        )}
      </div>

      {/* Right side: Challenge form */}
      <div className="form-container flex-grow-1 ms-3">
        <div className="top-bar d-flex justify-content-between align-items-center w-100">
          <button onClick={() => navigate("/home")} className="back-btn">
            &larr; Back
          </button>
        </div>
        <h3 className="text-center">Create a Challenge</h3>
        <form
          onSubmit={handleChallengeSubmit}
          className="p-4 border rounded shadow-lg bg-light"
        >
          <div className="form-group mb-3">
            <label className="form-label">Target Player</label>
            <select
              className="form-control"
              value={targetPlayer}
              onChange={(e) => setTargetPlayer(e.target.value)}
              required
            >
              <option value="">Select a Player</option>
              {players.map((player) => (
                <option key={player.uid} value={player.uid}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Difficulty</label>
            <select
              className="form-control"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Target Score</label>
            <input
              type="number"
              className="form-control"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              required
              min="1"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Send Challenge
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChallengeForm;
