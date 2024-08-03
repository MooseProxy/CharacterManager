import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('https://character-manager-app-backend-8b80d2ec8475.herokuapp.com//routes//auth/me')
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('https://character-manager-app-backend-8b80d2ec8475.herokuapp.com//routes//auth/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userResponse = await axios.get('https://character-manager-app-backend-8b80d2ec8475.herokuapp.com//routes//auth/me');
      setUser(userResponse.data);
    } catch (error) {
      console.error('Failed to login:', error);
      throw error;
    }
  };

  const register = async (username, password, discordId) => {
    await axios.post('https://character-manager-app-backend-8b80d2ec8475.herokuapp.com//routes//auth/register', { username, password, discordId });
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
