import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Dummy credentials for demonstration
  const validEmail = "admin@example.com";
  const validPassword = "password123";

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic email and password validation
    if (email === validEmail && password === validPassword) {
      onLoginSuccess(); // Call parent function to set login status
      navigate('/dashboard'); // Redirect to dashboard
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="addUser">
      <h3>Sign in</h3>
      <form className="addUserForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
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
