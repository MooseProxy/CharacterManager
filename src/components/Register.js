import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [discordId, setDiscordId] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password, discordId);
      navigate('/login');
    } catch (error) {
      console.error('Failed to register:', error);
    }
  };

  return (
    <div className="auth-container">
      <h1>Shadowrun Character Manager</h1>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Discord ID"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <div className="auth-link">
        <Link to="/login">Already have an account? Login here</Link>
      </div>
    </div>
  );
};

export default Register;
