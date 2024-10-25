import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/home.css'; // Ensure you have this CSS file in the specified path

function Home() {
  const [user, setUser] = useState(null); // State to store user data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include' // Ensure session or cookie is sent
        });

        // Handle valid user session
        if (response.ok) {
          const data = await response.json();
          setUser(data); // Set the user data fetched from the backend
        } else if (response.status === 401 || response.status === 403) {
          // Redirect to login if not authenticated
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate('/'); // Redirect to login page on error
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Ensure session or cookie is sent
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

  if (!user) return <div>Loading...</div>;

  return (
    <div className="home-container">
      <div className="home-content"> {/* Wrap the content in a div for styling */}
        <h1 className="welcome-text">Welcome {user.name}!</h1>

        <button className="custom-btn" onClick={() => navigate('/play')}>Lets Play!</button>
        <button className="custom-btn" onClick={() => navigate('/ranks')}>TopRanks</button>
        <button className="custom-btn" onClick={handleLogout}>LogOut</button>

        <div className="profile-section">
          <img src="" alt="User Profile" className="profile-pic" />
          <p>{user.username}</p>
          <button className="btn profile-btn">My Profile</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
