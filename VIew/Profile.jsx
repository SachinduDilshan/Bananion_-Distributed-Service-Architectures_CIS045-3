import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import picture from './Styles/picture-image.png';
import Footer from '../Components/Footer';
import { fetchUserData, saveUserData } from '../Controller/ProfileController';
import './Styles/ProfileStyle.css';

const Profile = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const data = await fetchUserData(userId);
        if (data) {
          setUserData(data);
          setNewName(data.name || '');
          setNewAge(data.age || '');
        }
      };
      fetchData();
    }
  }, [userId]);

  const handleSave = async () => {
    const success = await saveUserData(userId, newName, newAge);
    if (success) {
      setUserData({ ...userData, name: newName, age: newAge });
      setEditMode(false);
    }
  };

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
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={() => setEditMode(false)} className="cancel-btn">Cancel</button>
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
