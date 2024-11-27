import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ResetPassword from './components/resetpassword'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarToggle, setSidebarToggle] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <div className="flex">
        <Routes>
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          
          {/* Protected Routes for authenticated users */}
          <Route
            path="/dashboard/*"
            element={
              isLoggedIn ? (
                <>
                  <Sidebar sidebarToggle={sidebarToggle} />
                  <Dashboard
                    sidebarToggle={sidebarToggle}
                    setSidebarToggle={setSidebarToggle}
                  />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
