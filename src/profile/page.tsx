import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import UserCard from '../components/UserCard';

interface User {
  id: number;
  pseudo: string;
  email: string;
  bank: number;
  victoryStats: number;
}

const UserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    fetch(`${apiUrl}/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
        setLoading(false);
      });
  }, [userId]);

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

