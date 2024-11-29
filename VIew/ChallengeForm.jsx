import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, push } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import "./Styles/ChallengeForm.css"; // Custom CSS file

function ChallengeForm({ userId }) {
    const [players, setPlayers] = useState([]);
    const [targetPlayer, setTargetPlayer] = useState("");
    const [difficulty, setDifficulty] = useState("Beginner");
    const [targetScore, setTargetScore] = useState("");const navigate = useNavigate();

  
    const db = getDatabase();
  
    useEffect(() => {
      const usersRef = ref(db, "users");
      get(usersRef).then((snapshot) => {
        const usersData = snapshot.val();
        if (usersData) {
          const otherPlayers = Object.entries(usersData)
            .filter(([uid]) => uid !== userId)
            .map(([uid, userData]) => ({
              uid,
              name: userData.name || "Unnamed Player",
            }));
          setPlayers(otherPlayers);
        }
      });
    }, [db, userId]);
  
    const handleChallengeSubmit = async (e) => {
      e.preventDefault();
      if (!targetPlayer || !targetScore) {
        alert("Please fill in all fields!");
        return;
      }
  
      const challengeRef = ref(db, `users/${targetPlayer}/challenges`);
      const newChallenge = {
        challenger: userId,
        difficulty,
        targetScore: parseInt(targetScore, 10),
        status: "pending",
      };
  
      try {
        await push(challengeRef, newChallenge);
        alert("Challenge sent successfully!");
        setTargetPlayer("");
        setTargetScore("");
      } catch (error) {
        console.error("Error sending challenge:", error);
        alert("Failed to send challenge. Please try again.");
      }
    };
  
    return (
      <div className="challenge-form-container">
        <div className="top-bar d-flex justify-content-between align-items-center w-100">
        <button onClick={() => navigate('/home')} className="back-btn">&larr;Back</button>
      </div>
        <h3 className="text-center">Create a Challenge</h3>
        <form onSubmit={handleChallengeSubmit} className="p-4 border rounded shadow-lg bg-light">
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
    );
  }
  
  export default ChallengeForm;