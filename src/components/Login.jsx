import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import url from "../config";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isForgetPassword, setIsForgetPassword] = useState(false); // Toggle between forms
  const [email, setEmail] = useState(''); // For forget password
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    fetch(`${url}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Login successful") {
          onLoginSuccess();
          sessionStorage.setItem("email_id", username);
          navigate('/dashboard');
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        alert('There was an error logging in.');
      });
  };

  const handleForgetPasswordSubmit = (e) => {
    e.preventDefault();
    fetch(`${url}api/checkemail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {  // Check for success status
          alert('A password reset link has been sent to your email.');
        } else if (data.error) {
          alert(data.error);  // Display the error message if exists
        } else {
          alert('Something went wrong.');
        }
      })
      .catch((error) => {
        alert('There was an error processing your request.');
      });
  };

  return (
    <div className="addUser">
      {!isForgetPassword ? (
        <>
          <h3>Sign in</h3>
          <form className="addUserForm" onSubmit={handleLoginSubmit}>
            <div className="inputGroup">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="off"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="password">Password:</label>
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
              <p
                style={{
                  textAlign: "right",
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
                onClick={() => setIsForgetPassword(true)} // Toggle form
              >
                Forget password?
              </p>
            </div>
          </form>
        </>
      ) : (
        <>
          <h3>Forget Password</h3>
          <form className="addUserForm" onSubmit={handleForgetPasswordSubmit}>
            <div className="inputGroup">
              <label htmlFor="email">Enter your Email ID:</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="off"
                placeholder="Enter your Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <p
                style={{
                  textAlign: "right",
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
                onClick={() => setIsForgetPassword(false)} // Toggle back
              >
                Back to Sign In
              </p>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
