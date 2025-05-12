import './../styles/App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col bg-red h-screen">
        <header className="bg-gray-800 text-white p-4 flex justify-end space-x-4">
          <Link to="/login">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
              Register
            </button>
          </Link>
        </header>
        <main className="flex-grow flex items-center justify-center bg-gray-100">
          <Routes>
            <Route
              path="/"
              element={
                <h1 className="text-3xl font-bold text-gray-800">
                  Bienvenue sur l'application de Poker
                </h1>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/register"
              element={
                <h1 className="text-2xl font-semibold text-gray-700">
                  Register Page (Coming Soon)
                </h1>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;