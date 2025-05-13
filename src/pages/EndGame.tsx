import React from 'react';
import './../styles/EndGame.css';
import cutieCat from '../assets/images/cutie-cat.gif';

const EndGame: React.FC = () => {
  return (
    <div className="end-game-wrapper">
      <div className="money-overlay"></div>
      <div className="end-game-container">
        <h1 className="end-game-title">Partie terminée</h1>
        <p className="end-game-message">Merci d'avoir joué!</p>
        <img src={ cutieCat } alt="Chat trop mignon qui brille" />
        <div className="end-game-actions">
          <button className="end-game-button" onClick={() => (window.location.href = '/tables')}>
            Jouer !!!
          </button>
          <button className="end-game-button" onClick={() => (window.location.href = '/')}>
            Revenir à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndGame;
