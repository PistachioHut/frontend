import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { refreshAccessToken } from '../utils/auth';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true); // Added loading state for user data

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      fetchUserData(token); // Fetch user data if the token exists
    } else {
      setUserLoading(false); // No token means no user, set loading to false
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/user/data`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          setIsAuthenticated(true);
          fetchUserData(newAccessToken);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } finally {
      setUserLoading(false); // Always set loading to false once fetch is complete
    }
  };

  const login = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
    setUserLoading(true); // Set loading to true while fetching user data
    fetchUserData(accessToken);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    setUserLoading(false); // Ensure loading is false after logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
