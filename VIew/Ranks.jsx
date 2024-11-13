import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import './Styles/RankStyle.css';

const Ranks = () => {
  const [scores, setScores] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScores = async () => {
      const db = getDatabase();
      const usersRef = ref(db, 'users');
      
      try {
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const data = snapshot.val();

          const processedScores = Object.entries(data).flatMap(([userId, userData]) => {
            // Get the scores for the selected level
            const levelScores = Object.values(userData.scores || {}).filter(score => score.difficulty.toLowerCase() === selectedLevel);
            
            if (levelScores.length === 0) return [];

            // Find the highest score for the user in the selected level
            const highestScore = Math.max(...levelScores.map(score => score.score));
            return [{
              userId,
              name: userData.name, 
              score: highestScore
            }];
          })
          .sort((a, b) => b.score - a.score) // Sort by score in descending order
          .slice(0, 10); // Limit to top 10 scores

          setScores(processedScores);
        } else {
          setScores([]); // Clear scores if no data found
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchScores();
  }, [selectedLevel]); // Re-run fetchScores whenever selectedLevel changes

  return (
    <div className="top-ranks-page">
      <button onClick={() => navigate('/home')} className="back-btn">&larr;</button>
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
                  <td>{entry.name}</td>
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
