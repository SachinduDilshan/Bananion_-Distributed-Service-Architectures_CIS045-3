// Frontend/Register.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './index'; // Custom styles if needed

function RegistrationForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate password match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = {
      name,
      age,
      password,
    };

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      {/* Logo container */}
      

      {/* Registration form */}
      <form className="registration-form p-4 border rounded" onSubmit={handleSubmit} style={{ width: '800px' }}>
        <h2 className="text-center mb-4">Ready to Play? Register Now!</h2>
        <div className="form-group mb-3">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="age">Age</label>
          <input type="number" className="form-control" id="age" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" style={{ backgroundColor:  'rgb(24, 24, 111)', color:'white' }} className="btn custom-register-btn">Register</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
