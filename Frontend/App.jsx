import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from "./Register.jsx"; 
import LoginForm from "./login.jsx";
import Home from "./Home.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;
