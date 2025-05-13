import React from 'react';
import './../styles/Home.css';
import vegasBaby from '../assets/images/vegas-baby.gif';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Bienvenue sur l'application de Poker</h1>
      <img src={vegasBaby} alt="Vegas dans toute sa splendeur" />
      <button className="end-game-button" onClick={() => (window.location.href = '/tables')}>
        Jouer !!!
      </button>
    </div>
  );
};

export default Home;
