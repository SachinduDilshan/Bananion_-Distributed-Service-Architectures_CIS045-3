import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../VIew/Home.jsx"; // Ensure you have a Home component
import Register from "../VIew/Register.jsx";
import Login from "../VIew/Login.jsx"; // Adjust the path as necessary

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
