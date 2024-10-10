import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import url from "../config";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${url}login?username=${email}&password=${password}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === "Login successful!") {
          onLoginSuccess(); // Call parent function to set login status
          navigate('/dashboard'); // Redirect to dashboard
        } else {
          alert(data.message); // Show error message if login fails
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('There was an error logging in.');
      });
  };
  

  return (
    <div className="addUser">
      <h3>Sign in</h3>
      <form className="addUserForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            autoComplete="off"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="Password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
