import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './../styles/App.css';
import Login from './Login';
import Register from './Register';
import UserPage from '../profile/page';
import Page from '../tables/page';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<h1>Bienvenue sur l'application de Poker</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<UserPage />} />
            <Route path="/tables" element={<Page />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;