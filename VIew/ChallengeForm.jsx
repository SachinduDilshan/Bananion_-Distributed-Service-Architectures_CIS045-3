import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleFetchUsersAndChallenges, handleChallengeSubmit } from "../Controller/ChallengeController";
import "./Styles/ChallengeForm.css";


function ChallengeForm({ userId }) {
  const [players, setPlayers] = useState([]);
  const [sentChallenges, setSentChallenges] = useState([]);
  const [targetPlayer, setTargetPlayer] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [targetScore, setTargetScore] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    handleFetchUsersAndChallenges(userId, setUserName, setPlayers, setSentChallenges);
  }, [userId]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleChallengeSubmit(userId, userName, targetPlayer, targetScore, difficulty, players)
      .then(() => {
        setTargetPlayer("");
        setTargetScore("");
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="challenge-form-container d-flex">
      {/* Left */}
      <div className="sent-challenges p-3">
        <h5 className="text-center">Sent Challenges</h5>
        {sentChallenges.length > 0 ? (
          <ul className="list-group">
            {sentChallenges.map((challenge) => (
              <li key={challenge.id} className="list-group-item d-flex justify-content-between align-items-center">
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

      {/* Right*/}
      <div className="form-container flex-grow-1 ms-3">
        <div className="top-bar d-flex justify-content-between align-items-center w-100">
          <button onClick={() => navigate("/home")} className="back-btn">
            &larr; Back
          </button>
        </div>
        <h3 className="text-center">Create a Challenge</h3>
        <form onSubmit={handleFormSubmit} className="p-4 border rounded shadow-lg bg-light">
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
            <select className="form-control" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
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
