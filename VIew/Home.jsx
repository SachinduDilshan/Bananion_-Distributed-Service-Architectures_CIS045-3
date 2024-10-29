import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import '../View/Styles/home.css'; 

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase Auth

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the current user
        const currentUser = auth.currentUser;

        if (currentUser) {
          // Get the ID token
          const token = await currentUser.getIdToken();

          const response = await fetch("http://localhost:3000/user/home", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`, // Include the ID token in the header
            },
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else if (response.status === 401 || response.status === 403) {
            navigate('/');
          }
        } else {
          navigate('/'); // Redirect if no user is logged in
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate('/');
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchUserData();
  }, [navigate, auth]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        navigate('/');
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Show loading indicator while fetching user data
  if (loading) return <div>Loading...</div>;
  
  // If user is not found, you might want to handle that case
  if (!user) return <div>No user data found.</div>;

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="welcome-text">Welcome {user.name}!</h1>

        <button className="custom-btn" onClick={() => navigate('/play')}>Let's Play!</button>
        <button className="custom-btn" onClick={() => navigate('/ranks')}>Top Ranks</button>
        <button className="custom-btn" onClick={handleLogout}>Log Out</button>

        <div className="profile-section">
          <img src={user.profilePicUrl} alt="User Profile" className="profile-pic" />
          <p>{user.username}</p>
          <button className="btn profile-btn">My Profile</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
