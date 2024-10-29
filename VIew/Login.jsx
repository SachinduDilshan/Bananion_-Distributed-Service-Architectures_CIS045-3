import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/regist.css';

const auth = getAuth();

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

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
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;

      console.log("User logged in:", user);
      alert("Login successful");

      // Reset form fields
      setLoginData({
        email: "",
        password: ""
      });

      // Redirect to home page
      navigate('/home');
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed: Check your email name and password.");
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <form className="registration-form p-4 border rounded" onSubmit={handleSubmit} style={{ height: '320px' }}>
        <h2 className="text-center mb-4">Log In To Play!</h2>
        <div className="form-group mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Your email..."
            className="form-control"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Your password..."
            className="form-control"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          style={{ backgroundColor: 'rgb(52, 52, 155)', color: 'white' }}
          className="btn custom-register-btn">
          Login
        </button>
      </form>

      <h6 className="text-center mt-3">
        Don't have an account? <Link to="/register">Register here</Link>
      </h6>
      <h6 className="myName">K.G.S.D. Abeyrathne | 2425049</h6>
    </div>
  );
}

export default Login;
