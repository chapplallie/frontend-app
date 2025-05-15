import React, { useState } from 'react';
import './../styles/Nav.css';
import logo from '../assets/images/logo.png';
import logo2 from '../assets/images/bernard-tapis.png';
import NavButton from './NavButton';

const Nav: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Vous avez été déconnecté!');
    window.location.href = '/';
  };

  return (
    <nav className="nav-container">
      <a href="/" className="logo-container">
        <img className='app-logo' src={logo} alt="Poker app logo" />
      </a>
      <a href="/" className="logo-container">
        <img className='app-logo-2' src={logo2} alt="Poker app logo typo" />
      </a>

      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <NavButton to="/tables">Voir les tables</NavButton>

        {!isAuthenticated ? (
          <>
            <NavButton to="/login">Connexion</NavButton>
            <NavButton to="/register">Inscription</NavButton>
          </>
        ) : (
          <>
            <NavButton to="/profile">Profil</NavButton>
            <NavButton className="logout-button" to="/" onClick={handleLogout}>
              Déconnexion
            </NavButton>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;