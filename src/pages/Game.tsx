import React from 'react';
import './../styles/Game.css';

const GamePage: React.FC = () => {
  return (
    // <div className="page-container">
      <div className="game-container">
        <div className="game-log">
          <h4>Avancement de la partie</h4>
          <ul className="logs">
            <li>Machin a joué</li>
            <li>Truc a misé 10 compotes</li>
          </ul>
        </div>
        <div className="cards-container">
          <div className="player-cards">
            <h4>Vos cartes</h4>
            <div className="cards">
              <div className="card">10♠</div>
              <div className="card">1♦</div>
            </div>
          </div>
          <div className="river-cards">
            <h4>Les cartes de la table</h4>
            <div className="cards">
              <div className="card">K♠</div>
              <div className="card">Q♦</div>
              <div className="card">J♣</div>
              <div className="card">10♥</div>
            </div>
          </div>
        </div>
        <div className="game-actions">
          <button className="action-button">Suivre</button>
          <button className="action-button">Relancer</button>
          <button className="action-button" onClick={() => (window.location.href = '/endGame')}>Se coucher</button>
        </div>
      </div>
    // </div>
  );
};

export default GamePage;
