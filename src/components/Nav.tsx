import React from 'react';
import './../styles/Nav.css'; 

const Nav: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    alert('You have been logged out!');
    window.location.href = '/';
  };

  return (
    <nav className="nav-container">
      <button className="nav-button" onClick={() => (window.location.href = '/tables')}>
        Voir les tables
      </button>
      <button className="nav-button" onClick={() => (window.location.href = '/profile')}>
        Profile
      </button>

      {!isAuthenticated ? (
        <>
          <button className="nav-button" onClick={() => (window.location.href = '/login')}>
            Login
          </button>
          <button className="nav-button" onClick={() => (window.location.href = '/register')}>
            Register
          </button>
        </>
      ) : (
        <button className="nav-button logout-button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default Nav;