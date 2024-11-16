import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, set } from 'firebase/database';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/regist.css';
import { auth } from '../Model/Firebase.js';
import Footer from '../Components/Footer.jsx';
import email from './Styles/assets/email.png';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: ""
  });

  const [verificationSent, setVerificationSent] = useState(false); // Track if the email verification link was sent
  const [isVerified, setIsVerified] = useState(false); // Track email verification status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      setVerificationSent(true);
      alert("A verification email has been sent. Please verify your email address to complete registration.");

      // Save user details in Firebase Realtime Database with `verified: false`
      const db = getDatabase();
      await set(ref(db, 'users/' + user.uid), {
        name: formData.name,
        age: formData.age,
        email: formData.email,
        verified: false,
      });

      console.log("User registered:", user);

      // Monitor verification status
      const verificationInterval = setInterval(async () => {
        await user.reload(); // Refresh user data
        if (user.emailVerified) {
          clearInterval(verificationInterval); // Stop checking once verified
          setIsVerified(true);

          // Update the user's verification status in the database
          await set(ref(db, 'users/' + user.uid + '/verified'), true);

          alert("Email verified! You can now log in.");
          navigate('/'); // Redirect to login after verification
        }
      }, 3000); // Check every 3 seconds

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert("This email is already registered. Please log in or use a different email.");
      } else {
        console.error("Error:", error);
        alert("An error occurred: " + error.message);
      }
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      {!verificationSent ? (
        <form className="registration-form p-4 border rounded" onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">Ready to Play? Register Now!</h2>
          <div className="form-group mb-3">
            <label htmlFor="username">Name</label>
            <input
              type="text"
              placeholder="Your name, please..."
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              placeholder="How old are you..."
              className="form-control"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Your email..."
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter a secure password..."
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              placeholder="Type your password again..."
              className="form-control"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            style={{ backgroundColor: 'rgb(52, 52, 155)', color: 'white' }}
            className="btn custom-register-btn"
          >
            Register
          </button>
        </form>
      ) : (
        <div className="verify-center">
          <h3>Please Verify Your Email</h3>
          <p>We've sent a verification link to your email address. Check your inbox and click on the link to complete registration.</p>
          <img src={email} alt="email sended" className="email-pic" />
        </div>
      )}

      <br></br><br></br>

      <h6 className="text-center mt-3">Already Registered? <Link to="/">Login here</Link></h6>
      <Footer />
    </div>
  );
}

export default Register;
