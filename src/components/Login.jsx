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

  // Countdown logic for button re-enabling
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsButtonDisabled(false);
    }
  }, [countdown]);

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.message === "Login successful") {
        sessionStorage.setItem("email_id", username);
        sessionStorage.setItem("user_type", data.user_type);
        sessionStorage.setItem("access_token", data.access_token);
        sessionStorage.setItem("name", data.name);
        onLoginSuccess();

        // Redirect based on user_type
        if (data.user_type === "Admin") {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('There was an error logging in.');
      console.error("Login error:", error);
    }
  };

  // Handle forget password submission
  const handleForgetPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${url}checkemail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setIsLoading(false);
      if (data.success) {
        alert('A password reset link has been sent to your email.');
        setIsButtonDisabled(true);
        setCountdown(60); // Start countdown
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setIsLoading(false);
      alert('There was an error processing your request.');
      console.error("Forget password error:", error);
    }
  };

  return (
    <div className="addUser">
      {isForgetPassword ? (
        <ForgetPasswordForm
          email={email}
          setEmail={setEmail}
          isButtonDisabled={isButtonDisabled}
          isLoading={isLoading}
          countdown={countdown}
          handleForgetPasswordSubmit={handleForgetPasswordSubmit}
          toggleForm={() => setIsForgetPassword(false)}
        />
      ) : (
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLoginSubmit={handleLoginSubmit}
          toggleForm={() => setIsForgetPassword(true)}
        />
      )}
    </div>
  );
};

const LoginForm = ({ username, password, setUsername, setPassword, handleLoginSubmit, toggleForm }) => (
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
          style={{ textAlign: "right", cursor: "pointer", color: "blue", textDecoration: "underline" }}
          onClick={toggleForm}
        >
          Forget password?
        </p>
      </div>
    </form>
  </>
);

const ForgetPasswordForm = ({ email, setEmail, isButtonDisabled, isLoading, countdown, handleForgetPasswordSubmit, toggleForm }) => (
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
        <button type="submit" className="btn btn-primary" disabled={isButtonDisabled || isLoading}>
          {isLoading ? "Processing..." : "Submit"}
        </button>
        {countdown > 0 && (
          <p style={{ color: "red" }}>Please wait {countdown} seconds before trying again.</p>
        )}
        <p
          style={{ textAlign: "right", cursor: "pointer", color: "blue", textDecoration: "underline" }}
          onClick={toggleForm}
        >
          Back to Sign In
        </p>
      </div>
    </form>
  </>
);

export default Login;
