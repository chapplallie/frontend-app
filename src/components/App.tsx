import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './../styles/App.css';
import Login from './Login';
import Register from './Register';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Link to="/login">
            <button className="header-button">Login</button>
          </Link>
          <Link to="/register">
            <button className="header-button">Register</button>
          </Link>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<h1>Bienvenue sur l'application de Poker</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;