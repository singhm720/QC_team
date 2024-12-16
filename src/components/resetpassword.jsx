import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css"; // Ensure the CSS file is correctly imported
import url from "../config";
import { PiColumnsPlusLeft } from "react-icons/pi";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get the reset token from the query parameters
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get('token');
    setToken(resetToken);

    if (!resetToken) {
      setErrorMessage("No valid reset token found. Please check your email.");
    }
  }, [location]);

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    fetch(`${url}resetpassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Password reset successful. You can now log in with your new password.");
          navigate('/login');
        } else {
          setErrorMessage(data.error || "There was an error resetting your password.");
        }
      })
      .catch((error) => {
        setErrorMessage("There was an error processing your request.");
      });
  };

  return (
    <div className="addUser">
      {token ? (
        <div>
          <h3>Reset Your Password</h3>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <form className="addUserForm" onSubmit={handleResetSubmit}>
            <div className="inputGroup">
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                autoComplete="off"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="off"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p>No valid reset token found. Please check your email.</p>
      )}
    </div>
  );
};

export default ResetPassword;
