import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, set } from 'firebase/database'; // Import from Realtime Database
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/regist.css';
import { auth } from '../Model/Firebase.js';

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: ""
  });

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
        // Register the user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Write user data to the Realtime Database
        const db = getDatabase();
        await set(ref(db, 'users/' + user.uid), {
            name: formData.name,
            age: formData.age,
        });

        console.log("User registered:", user);
        alert("User registered successfully");

        // Reset form fields
        setFormData({
            name: "",
            email: "",
            age: "",
            password: "",
            confirmPassword: ""
        });
    } catch (error) {
        // Handle specific error for email already in use
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
      <form className="registration-form p-4 border rounded" onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">Ready to Play? Register Now!</h2>
        <div className="form-group mb-3">
          <label htmlFor="username">Name</label>
          <input 
            type="text" 
            placeholder='Your name, please...' 
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
            placeholder='How old are you...' 
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
            placeholder='Your email...' 
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
            placeholder='Enter a secure password...' 
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
            placeholder='Type your password again...' 
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
          className="btn custom-register-btn">
          Register
        </button>
      </form>

      <br></br><br></br>

      <h6 className="text-center mt-3">Already Registered? <Link to="/">Login here</Link></h6>
      <br />
      <h6 className="myName">K.G.S.D. Abeyrathne | 2425049 </h6>
    </div>
  );
}

export default Register;
