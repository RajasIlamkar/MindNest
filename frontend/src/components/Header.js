import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');
    navigate('/');
  };

  return (
    <header className="header">
      <Link to="/" className="logo">MindNest 🧠</Link>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <>
          <Link to="/whatsnew">What’s new</Link>
          <Link to="/dashboard">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
