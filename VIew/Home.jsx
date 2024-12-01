import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged, getIdToken } from '../Model/Firebase';
import './Styles/home.css';
import MathTrivia from './MathTrivia.jsx';
import picture from './Styles/picture-image.png';
import Footer from './Footer.jsx';

const Home = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (token) => {
      try {
        const response = await fetch("http://localhost:3000/user/home", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Failed to fetch user data");
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate('/');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user);
        fetchUserData(token);
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="home-container d-flex min-vh-100">
      <div className="left-section">
        <MathTrivia />
      </div>

      <div className="center-section d-flex flex-column align-items-center">
        {userData && (
          <div className="welcome-text">
            <h1>Welcome {userData.name}!</h1>
          </div>
        )}

        <div className="home-content">
          <button className="custom-btn" onClick={() => navigate('/difficulty')}>Let's Play!</button>
          <button className="custom-btn" onClick={() => navigate('/challenge')}>View Challenge</button>
          <button className="custom-btn" onClick={() => navigate("/givechallenge")}>Create Challenge</button>
          <button className="custom-btn" onClick={() => navigate('/ranks')}>Top Ranks</button>
          <button className="custom-btn" onClick={() => navigate('/profile')}>My Profile</button>
          
          
        </div>

        <div className="profile-section">
          {userData && (
            <>
              <img src={picture} alt="User Profile" className="profile-pic" />
              <p>{userData.name}</p>
              <p>{userData.age} Years</p>
              
            </>
          )}
          <button className="exit-btn" onClick={() => auth.signOut()}>Exit</button>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
