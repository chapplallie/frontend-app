import React, { useEffect, useState } from 'react';
import '../styles/UserBoard.css';


interface User {
  id: number;
  pseudo: string;
  email: string;
  bank: number;
  victoryStats: number;
}

const UserBoard: React.FC = () => {
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    console.log('API URL:', apiUrl);
    // Fetch user data from the API
    fetch(`${apiUrl}/users/`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched users:', data);
        setUsers(data);
        setLoading(false);
      })
      
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-board">
      <h1>User Board</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Pseudo</th>
            <th>Email</th>
            <th>Bank</th>
            <th>Victory Stats</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.pseudo}</td>
              <td>{user.email}</td>
              <td>{user.bank}</td>
              <td>{user.victoryStats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserBoard;