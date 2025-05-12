import React, { useState } from 'react';
import './../styles/Login.css';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pseudo, password }),
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        navigate('/profile');
        } catch (err: any) {
        setError(err.message);
        }
    };

  return (
    <div className="login-container">
        <div className="login-box">
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
                <label htmlFor="pseudo">Pseudo</label>
                <input
                id="pseudo"
                type="text"
                placeholder="Votre pseudo"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="form-input"
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">mdp</label>
                <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                />
            </div>
            <button type="submit" className="login-button" >Login</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    </div>

  );
};

export default Login;