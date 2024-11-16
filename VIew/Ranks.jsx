import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import './Styles/RankStyle.css';
import medalIcon from '../VIew/Styles/assets/medal-icon.png'; // Make sure you have a medal icon in the assets folder

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
            const levelScores = Object.values(userData.scores || {}).filter(score => score.difficulty.toLowerCase() === selectedLevel);
            
            if (levelScores.length === 0) return [];

            const highestScore = Math.max(...levelScores.map(score => score.score));
            return [{
              userId,
              name: userData.name, 
              score: highestScore
            }];
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);

          setScores(processedScores);
        } else {
          setScores([]);
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchScores();
  }, [selectedLevel]);

  return (
    <div className="top-ranks-page">
      <button onClick={() => navigate('/home')} className="back-btn">&larr;Back</button>
      <div className="level-select">
        <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
          <option value="beginner">Beginner Level</option>
          <option value="intermediate">Intermediate Level</option>
          <option value="expert">Expert Level</option>
        </select>
      </div>
      <div className="leaderboard">
        <h3>Top Masterminds in {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Level 😎</h3>
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
                  <td>
                    {index === 0 && <img src={medalIcon} alt="Top Player Medal" className="medal-icon" />} {/* Display medal for top player */}
                    {index + 1}
                  </td>
                  <td>{entry.name}</td>
                  <td>{entry.score}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Wait a little...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ranks;
