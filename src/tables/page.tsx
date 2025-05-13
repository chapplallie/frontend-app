import React from 'react';
import './../styles/Tables.css';
import Nav from '../components/Nav';


const tables = [
  {
    id: 1,
    name: 'Table 1',
    smallBlind: 10,
    bigBlind: 20,
    players: 5,
    status: 'Open',
  },
  {
    id: 2,
    name: 'Table 2',
    smallBlind: 50,
    bigBlind: 100,
    players: 3,
    status: 'In Progress',
  },
  {
    id: 3,
    name: 'Table 3',
    smallBlind: 100,
    bigBlind: 200,
    players: 6,
    status: 'Closed',
  },
];

const Page: React.FC = () => {
  return (
    <div className="page-container">
      <Nav />

      {/* Tables Section */}
      <div className="tables-container">
        {tables.map((table) => (
          <div key={table.id} className="table-card">
            <h3>{table.name}</h3>
            <p>Small Blind: {table.smallBlind}</p>
            <p>Big Blind: {table.bigBlind}</p>
            <p>Players: {table.players}</p>
            <p>Status: {table.status}</p>
            {/* todo */}
            <button className="join-button">Rejoindre</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;