import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import './Styles/RankStyle.css';

const Ranks = () => {
  const [scores, setScores] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("expert");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScores = async () => {
      const db = getDatabase();
      const scoresRef = ref(db, 'users/scores');
      
      try {
        const snapshot = await get(scoresRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Process data to retrieve and sort top scores by selected level
          const processedScores = Object.entries(data)
            .map(([userId, scoreData]) => ({
              userId,
              score: scoreData[selectedLevel] || 0, // Default to 0 if no score for level
            }))
            .filter(entry => entry.score > 0) // Filter out users with no score for the level
            .sort((a, b) => a.score - b.score) // Sort by score, lowest is best for time-based score
            .slice(0, 10); // Top 10 scores
            
          setScores(processedScores);
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchScores();
  }, [selectedLevel]);

  return (
    <div className="top-ranks-page">
      <button onClick={() => navigate('/home')} className="back-btn">&larr; Back</button>
      <div className="level-select">
        <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
          <option value="beginner">Beginner Level</option>
          <option value="intermediate">Intermediate Level</option>
          <option value="expert">Expert Level</option>
        </select>
      </div>
      <div className="leaderboard">
        <h3>{selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Level Top Scores</h3>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.length > 0 ? (
              scores.map((entry, index) => (
                <tr key={entry.userId}>
                  <td>{index + 1}</td>
                  <td>{entry.name}</td> {/* Replace with user's display name if available */}
                  <td>{entry.score}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No scores available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ranks;
