import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserData, fetchHighestScores, updateUserData } from '../Model/ProfileModel';
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
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  const loadProfileData = async () => {
    try {
      const profileData = await fetchUserData(userId);
      if (profileData) {
        setUserData(profileData);
        setNewName(profileData.name || '');
        setNewAge(profileData.age || '');
      }
      
      const scoresData = await fetchHighestScores(userId);
      setHighestScores({
        beginner: scoresData.beginner || 'N/A',
        intermediate: scoresData.intermediate || 'N/A',
        expert: scoresData.expert || 'N/A'
      });
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = await updateUserData(userId, newName, newAge);
      setUserData({ ...userData, ...updatedData });
      setEditMode(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  // Render loading message if userData is still null
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
          {editMode ? (
            <>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name"
                className="edit-input"
              />
              <input
                type="number"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                placeholder="Enter new age"
                className="edit-input"
              />
              <button onClick={handleSave} className="icon-button save-btn">✔️</button>
              <button onClick={() => setEditMode(false)} className="icon-button cancel-btn">❌</button>
            </>
          ) : (
            <>
              <h2>{userData.name || 'Name not available'}</h2>
              <p>Age: {userData.age ? `${userData.age} Years` : 'Age not available'}</p>
              <p>Email: {userData.email || 'Email not available'}</p>
              <button onClick={() => setEditMode(true)} className="edit-btn">Edit</button>
            </>
          )}
        </div>

        <div className="score-section">
          <h3>Highest Scores</h3>
          <div className="score-list">
            <div className="score-item">
              <span>Beginner</span>
              <span>{highestScores.beginner !== 0 ? highestScores.beginner : 'N/A'}</span>
            </div>
            <div className="score-item">
              <span>Intermediate</span>
              <span>{highestScores.intermediate !== 0 ? highestScores.intermediate : 'N/A'}</span>
            </div>
            <div className="score-item">
              <span>Expert</span>
              <span>{highestScores.expert !== 0 ? highestScores.expert : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
