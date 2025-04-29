import React from 'react';
import '../styles/UserCard.css';

interface User {
  id: number;
  pseudo: string;
  email: string;
  bank: number;
  victoryStats: number;
}

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="user-card">
      <h2>{user.pseudo}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Bank:</strong> {user.bank}</p>
      <p><strong>Victory Stats:</strong> {user.victoryStats}</p>
    </div>
  );
};

export default UserCard;