import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import url from "../config";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isForgetPassword, setIsForgetPassword] = useState(false); // Toggle between forms
  const [email, setEmail] = useState(''); // For forget password
  const [isLoading, setIsLoading] = useState(false); // Buffer bar state
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Disable button
  const [countdown, setCountdown] = useState(0); // Countdown for 1 minute
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsButtonDisabled(false); // Enable button after countdown
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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
    setIsLoading(true); // Show buffer bar
    fetch(`${url}api/checkemail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false); // Hide buffer bar
        if (data.success) { 
          alert('A password reset link has been sent to your email.');
          setIsButtonDisabled(true); // Disable submit button
          setCountdown(60); // Start 1-minute countdown
        } else if (data.error) {
          alert(data.error);
        } else {
          alert('Something went wrong.');
        }
      })
      .catch((error) => {
        setIsLoading(false); // Hide buffer bar on error
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
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isButtonDisabled || isLoading} // Disable button if loading or countdown
              >
                {isLoading ? "Processing..." : "Submit"}
              </button>
              {countdown > 0 && (
                <p style={{ color: "red" }}>
                  Please wait {countdown} seconds before trying again.
                </p>
              )}
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
