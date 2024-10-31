import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged, getIdToken } from '../Model/Firebase'; // Ensure you're importing the correct functions
import './Styles/home.css';

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
          navigate('/'); // Redirect if fetching fails or user not logged in
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

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out from Firebase
      navigate('/'); // Redirect to login or home page after logging out
    } catch (error) {
      console.error("Logout Error:", error);
      // Optionally show a message to the user
    }
  };



  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      {userData ? (
            <>
            <div className='welcome-text'>
            <h1>Welcome {userData.name}!</h1>
            </div>
            </>
          ) : (
            <p></p>
          )}
      <div className="home-content">
        <button className="custom-btn" onClick={() => navigate('/play')}>Let's Play!</button>
        <button className="custom-btn" onClick={() => navigate('/ranks')}>Top Ranks</button>
        <button className="custom-btn" style={{backgroundColor:'#8a1818'}} onClick={handleLogout}>Exit</button>
        

        <div className="profile-section">
          {userData ? (
            <>
              <img src={userData.profilePicUrl} alt="User Profile" className="profile-pic" />
              <p>{userData.username}</p>
              <button className="btn profile-btn">My Profile</button>
            </>
          ) : (
            <p></p>
          )}
        </div>
        
      </div>  
       
      <h6 className="myName">K.G.S.D. Abeyrathne | 2425049 </h6>
    </div>
   
    
  );
};

export default Home;
