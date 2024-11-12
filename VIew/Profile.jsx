import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import './Styles/ProfileStyle.css';
import picture from './Styles/picture-image.png';
import Footer from '../Components/Footer';

const Profile = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [highestScores, setHighestScores] = useState({
    beginner: 'N/A',
    intermediate: 'N/A',
    expert: 'N/A'
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);
      const scoresRef = ref(db, `users/${userId}/scores`);

      // Fetch user data
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            console.log('No user data available');
          }
        })
        .catch((error) => {
          console.error('Error fetching user profile data:', error);
        });

      // Fetch and process scores to find the highest for each level
      get(scoresRef)
        .then((snapshot) => {
          const scoresData = snapshot.val();
          if (scoresData) {
            const maxScores = { beginner: 0, intermediate: 0, expert: 0 };

            Object.values(scoresData).forEach((score) => {
              if (score.difficulty === 'Beginner' && score.score > maxScores.beginner) {
                maxScores.beginner = score.score;
              }
              if (score.difficulty === 'Intermediate' && score.score > maxScores.intermediate) {
                maxScores.intermediate = score.score;
              }
              if (score.difficulty === 'Expert' && score.score > maxScores.expert) {
                maxScores.expert = score.score;
              }
            });

            setHighestScores({
              beginner: maxScores.beginner || 'N/A',
              intermediate: maxScores.intermediate || 'N/A',
              expert: maxScores.expert || 'N/A'
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching scores:', error);
        });
    }
  }, [userId]);

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (    
    <div className="profile-page">
      <div className='topic'>
      <h2>My Profile</h2>
      </div>
      <button onClick={() => navigate('/home')} className="back-btn">&larr;</button>
      <div className="profile-container">
        
        <div className="profile-info">
          <img src={picture} alt="User Profile" className="profile-pic" />
          <h2>{userData.name || 'Name not available'}</h2>
          <p>Age: {userData.age ? `${userData.age} Years` : 'Age not available'}</p>
          <p>Email: {userData.email || 'Email not available'}</p>
          <button>Edit</button>
        </div>
        <div className="score-section">
          <h3>Highest Scores</h3>
          <div className="score-list">
            <div className="score-item">
              <span>Beginner</span>
              <span>{highestScores.beginner}</span>
            </div>
            <div className="score-item">
              <span>Intermediate</span>
              <span>{highestScores.intermediate}</span>
            </div>
            <div className="score-item">
              <span>Expert</span>
              <span>{highestScores.expert}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

export default Profile;
