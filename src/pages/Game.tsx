import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './../styles/Game.css';
import { useNavigate } from 'react-router-dom';

interface Table {
  id: number;
  name: string;
  status: string;
  round: number;
  turn: number;
  currentBlind: number;
  smallBlind: number;
  bigBlind: number;
  currentBet: number;
  pot: number;
  dealerPosition: number;
  river: any[];
  players: any[];
  maxPlayers: number;
  minPlayers: number;
  gameLog: any[];
}

const GamePage: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const [table, setTable] = useState<Table | null>(null);
  const [startingGame, setStartingGame] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [raiseAmount, setRaiseAmount] = useState<number>(0);
  const [processingAction, setProcessingAction] = useState<boolean>(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Fonction pour afficher les messages d'erreur
  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };
  
  // Fonction pour afficher les messages de succès
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };
  
  useEffect(() => {
    let isMounted = true;
    // console.log('Effet exécuté, tableId:', tableId);

    const fetchTable = async () => {
      if (!tableId) {
        if (isMounted) {
          setError('ID de table non spécifié');
          setLoading(false);
        }
        return;
      }

      try {
        if (isMounted) setLoading(true);
        const response = await fetch(`http://localhost:3000/tables/${tableId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        // console.log('Réponse API:', response);

        if (!response.ok) {
          throw new Error('Impossible de récupérer les détails de la table');
        }

        const data = await response.json();
        // console.log('Données de la table reçues:', data);
        if (isMounted) setTable(data);
      } catch (err: any) {
        // console.error('Erreur lors de la récupération:', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTable();

    return () => {
      isMounted = false;
    };
  }, [tableId]);
  // Effet pour rafraîchir périodiquement l'état de la table
  useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout;
    
    // Toujours rafraîchir, même si la partie n'est pas en cours
    interval = setInterval(async () => {
      if (!tableId || !isMounted) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/tables/${tableId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (response.ok && isMounted) {
          const updatedData = await response.json();
          setTable(updatedData);
        }
      } catch (err) {
        console.error('Erreur lors du rafraîchissement de la table:', err);
      }
    }, 3000); // Rafraîchir toutes les 3 secondes
    
    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [tableId]);

  const handleStartGame = async (tableId: number) => {
    let isMounted = true;

    try {
      setStartingGame(true);
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Vous devez être connecté pour démarrer une partie');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:3000/tables/${tableId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Impossible de démarrer la partie');
      }

      const updatedTableResponse = await fetch(`http://localhost:3000/tables/${tableId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (updatedTableResponse.ok && isMounted) {
        const updatedData = await updatedTableResponse.json();
        setTable(updatedData);
      }    } catch (err: any) {
      if (isMounted) {
        setError(err.message);
        showError(err.message);
      }
    } finally {
      if (isMounted) {
        setStartingGame(false);
      }
    }

    return () => {
      isMounted = false;
    };
  };

  // Fonction pour gérer les actions du joueur (suivre, relancer, se coucher)
  const handleAction = async (action: string, amount?: number) => {
    if (!tableId || !table || processingAction) return;
    
    let isMounted = true;
    setProcessingAction(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Vous devez être connecté pour jouer');
        navigate('/login');
        return;
      }
      
      const actionData: any = {
        action: action
      };
      
      // Si c'est une relance, ajouter le montant
      if (action === 'raise' && amount) {
        actionData.amount = amount;
      }
      
      const response = await fetch(`http://localhost:3000/tables/${tableId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(actionData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Impossible d'effectuer cette action`);
      }
      
      // Mettre à jour l'état de la table après l'action
      const updatedTableResponse = await fetch(`http://localhost:3000/tables/${tableId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (updatedTableResponse.ok && isMounted) {
        const updatedData = await updatedTableResponse.json();
        setTable(updatedData);
        
        // Si le joueur se couche, rediriger vers la page de fin de partie
        if (action === 'fold') {
          setTimeout(() => {
            if (isMounted) navigate('/endGame');
          }, 1500);
        }
      }    } catch (err: any) {
      if (isMounted) {
        setError(err.message);
        showError(err.message);
      }
    } finally {
      if (isMounted) {
        setProcessingAction(false);
        setRaiseAmount(0); // Réinitialiser le montant de relance
      }
    }
    
    return () => {
      isMounted = false;
    };
  };
  
  // Fonction pour traiter le changement du montant de relance
  const handleRaiseAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setRaiseAmount(value);
    }
  };

  //! ici le return !!!!!
  return (    
    <div className="game-container">
      {errorMessage && (
        <div className="error-notification">
          <span className="message">{errorMessage}</span>
          <button className="close-btn" onClick={() => setErrorMessage(null)}>×</button>
        </div>
      )}
      
      {successMessage && (
        <div className="success-notification">
          <span className="message">{successMessage}</span>
          <button className="close-btn" onClick={() => setSuccessMessage(null)}>×</button>
        </div>
      )}
      
      {loading ? (
        <p>Chargement de la partie...</p>
      ) : error ? (
        <p className="error-message">{error}</p>      ) : !table ? (
        <p>Aucune information disponible pour cette table.</p>
      ) : (
        <>
          <div className="table-header container-block">
            <div className="table-info">
              <h3>{table.name}</h3>
              <div className="table-status">
                {table.status === 'En cours' ? (
                  <span className="status-badge active">Partie en cours</span>
                ) : (
                  <span className="status-badge waiting">En attente</span>
                )}
              </div>
            </div>          <div className="table-stats">
              <div className="stat-item">
                <span className="stat-label">Tour:</span>
                <span className="stat-value">{table.turn}/4</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Pot:</span>
                <span className="stat-value pot">{table.pot}€</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Mise:</span>
                <span className="stat-value bet">{table.currentBet}€</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Blindes:</span>
                <span className="stat-value">{table.smallBlind}€ / {table.bigBlind}€</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Joueurs:</span>
                <span className="stat-value">{table.players.length}/{table.maxPlayers}</span>
              </div>
            </div>
          </div>

          <div className="game-main-content">
            <div className="game-left-column">
              <div className="game-log container-block">
                <h4>Avancement de la partie (Tour {table.turn}/4)</h4>
                <ul className="logs">
                  {table.gameLog && table.gameLog.length > 0 ? (
                    table.gameLog.map((log, index) => (
                      <li key={index}>
                        {typeof log === 'string'
                          ? log
                          : log.message
                            ? `${log.timestamp ? new Date(log.timestamp).toLocaleTimeString() + ' - ' : ''}${log.message}`
                            : JSON.stringify(log)
                        }
                      </li>
                    ))
                  ) : (
                    <li>La partie n'a pas encore commencé</li>
                  )}
                </ul>
              </div>
              
              <div className="cards-container">
                <div className="player-cards container-block">
                  <h4>Vos cartes</h4>
                  <div className="cards">
                    {table.players.find(p => p.isHuman)?.hand?.length > 0 ? (
                      table.players.find(p => p.isHuman).hand.map((card: any, index: number) => {
                        let suitSymbol = card.suit;
                        if (card.suit === 'Spade') suitSymbol = '♠';
                        else if (card.suit === 'Heart') suitSymbol = '♥';
                        else if (card.suit === 'Diamond') suitSymbol = '♦';
                        else if (card.suit === 'Clover') suitSymbol = '♣';

                        const isRed = suitSymbol === '♥' || suitSymbol === '♦';

                        return (
                          <div className={`card ${isRed ? 'red-card' : 'black-card'}`} key={index}>
                            <span className="card-value">{card.value}</span>
                            <span className="card-suit">{suitSymbol}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-cards-message">Vos cartes apparaîtront ici</div>
                    )}
                  </div>
                </div>
                
                <div className="river-cards container-block">
                  <h4>Les cartes de la table</h4>
                  <div className="cards">
                    {table.river && table.river.length > 0 ? (
                      table.river.map((card: any, index: number) => {
                        let suitSymbol = card.suit;
                        if (card.suit === 'Spade') suitSymbol = '♠';
                        else if (card.suit === 'Heart') suitSymbol = '♥';                        else if (card.suit === 'Diamond') suitSymbol = '♦';
                        else if (card.suit === 'Club') suitSymbol = '♣';
                        else if (card.suit === 'Clover') suitSymbol = '♣';

                        const isRed = suitSymbol === '♥' || suitSymbol === '♦';

                        return (
                          <div className={`card ${isRed ? 'red-card' : 'black-card'}`} key={index}>
                            <span className="card-value">{card.value}</span>
                            <span className="card-suit">{suitSymbol}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-cards-message">Les cartes seront révélées pendant la partie</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="game-actions container-block">
                {table.status === 'En cours' ? (
                  <div className="action-buttons">
                    <button 
                      className="action-button check"
                      onClick={() => handleAction('check')}
                      disabled={processingAction || table.currentBet !== 0}
                    >
                      {processingAction ? 'En cours...' : 'Faire parole'}
                    </button>
                    
                    <button 
                      className="action-button follow"
                      onClick={() => handleAction('call')}
                      disabled={processingAction}
                    >
                      {processingAction ? 'En cours...' : `Suivre (${table.currentBet}€)`}
                    </button>
                    
                    <div className="raise-container">
                      <button 
                        className="action-button raise"
                        onClick={() => handleAction('raise', raiseAmount)}
                        disabled={processingAction || raiseAmount < table.currentBet}
                      >
                        {processingAction ? 'En cours...' : 'Relancer'}
                      </button>
                      <input 
                        type="number" 
                        min={table.currentBet} 
                        step={table.smallBlind}
                        value={raiseAmount} 
                        onChange={handleRaiseAmountChange}
                        className="raise-amount"
                        placeholder={`Min ${table.currentBet}€`}
                      />
                    </div>
                    
                    <button 
                      className="action-button fold"
                      onClick={() => handleAction('fold')}
                      disabled={processingAction}
                    >
                      {processingAction ? 'En cours...' : 'Se coucher'}
                    </button>
                  </div>
                ) : (
                  <button
                    className="action-button start"
                    onClick={() => handleStartGame(table.id)}
                    disabled={startingGame || table.players.length < table.minPlayers}
                  >
                    {startingGame ? 'Démarrage...' : 'Démarrer la partie'}
                  </button>
                )}
              </div>
            </div>
            
            <div className="players-section container-block">
              <h4>Joueurs à la table</h4>
              <div className="players-list">
                {table.players.map((player, index) => (
                  <div 
                    key={index} 
                    className={`player-item ${player.isCurrentPlayer ? 'current-player' : ''} ${player.hasFolded ? 'folded-player' : ''}`}
                  >
                    <div className="player-info">
                      <span className="player-name">{player.name}</span>
                      <span className="player-chips">{player.chips}€</span>
                      
                      <div className="player-roles">
                        {table.dealerPosition === index && (
                          <span className="player-role dealer">Dealer</span>
                        )}
                        {(table.dealerPosition + 1) % table.players.length === index && (
                          <span className="player-role small-blind">Petite Blinde</span>
                        )}
                        {(table.dealerPosition + 2) % table.players.length === index && (
                          <span className="player-role big-blind">Grande Blinde</span>
                        )}
                        {player.isCurrentPlayer && (
                          <span className="player-role current">Tour actuel</span>
                        )}
                      </div>
                      
                      {player.currentBet > 0 && (
                        <span className="player-bet">Mise: {player.currentBet}€</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GamePage;
