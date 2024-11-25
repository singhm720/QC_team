import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import url from "../config";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${url}login`, { // Remove query parameters
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type
      },
      body: JSON.stringify({ username, password }), // Send username and password as JSON
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === "Login successful") { // Match the message from backend
          onLoginSuccess(); // Call parent function to set login status
          sessionStorage.setItem("email_id", username);
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
          <label htmlFor="username">Username:</label> {/* Changed from email to username */}
          <input
            type="text"
            id="username" // Changed from email to username
            name="username" // Changed from email to username
            autoComplete="off"
            placeholder="Enter your Username" // Changed placeholder
            value={username} // Changed from email to username
            onChange={(e) => setUsername(e.target.value)} // Changed from email to username
            required
          />
          <label htmlFor="password">Password:</label> {/* Changed to lowercase */}
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
