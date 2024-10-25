import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './Styles/regist.css';

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("User registered successfully");
        setFormData({
          name: '',
          age: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        alert("Failed to register user. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <form className="registration-form p-4 border rounded" onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">Ready to Play? Register Now!</h2>
        <div className="form-group mb-3">
          <label htmlFor="name">Name</label>
          <input type="text" placeholder='Your name, please...' className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="age">Age</label>
          <input type="number" placeholder='How old are you...' className="form-control" name="age" value={formData.age} onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input type="password" placeholder='Enter a secure password...' className="form-control" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" placeholder='Type your password again...' className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ backgroundColor: 'rgb(52, 52, 155)', color:'white' }} className="btn custom-register-btn">Register</button>
      </form>

      <br></br>

      <h6 className="text-center mt-3">Already Registered? <Link to="/login">Login here</Link></h6>
      <br></br>
      <h6 className="myName">K.G.S.D. Abeyrathne | 2425049 </h6>
    </div>
  );
}

export default Register;
