import React, { createContext, useContext, useState, useEffect } from 'react';
import { config } from '../config/config';

interface AuthContextType {
  token: string | null;
  user: any | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem(config.tokenKey);
    console.log('Initial token from storage:', storedToken);
    return storedToken;
  });
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          console.log('Fetching user data with token:', token);
          const response = await fetch(`${config.apiBaseUrl}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            console.log('User data fetched:', userData);
            setUser(userData);
          } else {
            console.log('Invalid token, clearing auth state');
            localStorage.removeItem(config.tokenKey);
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUser();
  }, [token]);

  const login = (newToken: string) => {
    console.log('Logging in with token:', newToken);
    localStorage.setItem(config.tokenKey, newToken);
    setToken(newToken);
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem(config.tokenKey);
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token
  };

  console.log('Auth state:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 