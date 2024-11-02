import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import './Styles/ProfileStyle.css';
import picture from './Styles/picture-image.png';
import Footer from '../Components/Footer';

const Profile = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);

      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            console.log('Fetched data:', data);  // Debugging: Log fetched data
            setUserData(data);
          } else {
            console.log('No data available');
          }
        })
        .catch((error) => {
          console.error('Error fetching profile data:', error);
        });
    }
  }, [userId]);

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-page">
      <button onClick={() => navigate('/home')} className="back-btn">Back</button>
      <div className="profile-container">
        <div className="profile-info">
          <img src={picture} alt="User Profile" className="profile-pic" />
          <h2>{userData.name || 'Name not available'}</h2>
          <p>Age: {userData.age ? `${userData.age} Years` : 'Age not available'}</p>
          <p>Email: {userData.email || 'Email not available'}</p>
          <button>Edit</button>
        </div>
        <div className="score-section">
          <h3>Highest Score</h3>
          <div className="score-list">
            <div className="score-item">
              <span>Beginner</span>
              <span>{userData.scores?.beginner || 'N/A'}</span>
            </div>
            <div className="score-item">
              <span>Intermediate</span>
              <span>{userData.scores?.intermediate || 'N/A'}</span>
            </div>
            <div className="score-item">
              <span>Expert</span>
              <span>{userData.scores?.expert || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
