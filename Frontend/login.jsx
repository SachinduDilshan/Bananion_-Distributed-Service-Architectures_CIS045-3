import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/regist.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [loginData, setLoginData] = useState({
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        alert("Login successful");
        // Redirect or other logic after login success
        navigate("/home"); 
      } else {
        alert("Failed to log in. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <form className="registration-form p-4 border rounded" onSubmit={handleSubmit} style={{height: '320px' }}>
        <h2 className="text-center mb-4"> Log In To Play!</h2>
        <div className="form-group mb-3">
          <label htmlFor="name">Name</label>
          <input type="text" placeholder='Your name...' className="form-control" name="name" value={loginData.name} onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input type="password" placeholder='Your password...' className="form-control" name="password" value={loginData.password} onChange={handleChange} required />
        </div>
        
        <button type="submit" style={{ backgroundColor:  'rgb(52, 52, 155)', color:'white' }} className="btn custom-register-btn">Login</button>
      </form>

      <br></br>

      <h6 className="text-center mt-3">Don't have an account? <Link to="/register">Register here</Link></h6>
      <br></br>
      <h6 className="myName">K.G.S.D. Abeyrathne | 2425049 </h6>
    </div>
  );
}

export default Login;
