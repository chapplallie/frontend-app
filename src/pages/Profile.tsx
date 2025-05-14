import React, { useEffect, useState } from 'react';
//import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';
import UserCard from '../components/UserCard';

interface User {
  id: number;
  pseudo: string;
  email: string;
  bank: number;
  victoryStats: number;
}

const UserPage: React.FC = () => {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   

    fetch(`${API_BASE_URL}/users/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
        setLoading(false);
      });
  }, [token]);
  console.log("user", user);

      // fetch(`${API_BASE_URL}/users/${user?.id}`, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      // },
  // })

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>user inconnu</div>;
  }

  return (
    <div>
      <h1>Profile de {user.pseudo}</h1>
      <UserCard user={user} />
    </div>
  );
};


export default UserPage;

