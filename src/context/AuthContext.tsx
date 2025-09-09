import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('stockwise-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock authentication - in production, this would be an actual API call
        if (email && password.length >= 6) {
          const userData = {
            id: '1',
            name: email.split('@')[0],
            email: email
          };
          setUser(userData);
          localStorage.setItem('stockwise-user', JSON.stringify(userData));
          resolve();
        } else {
          reject('Invalid credentials');
        }
      }, 1500);
    });
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock signup - in production, this would be an actual API call
        if (name && email && password.length >= 6) {
          resolve();
        } else {
          reject('Invalid signup data');
        }
      }, 1500);
    });
  };

  const logout = () => {
    console.log('Logout function called'); // Debug log
    setUser(null);
    localStorage.removeItem('stockwise-user');
    localStorage.removeItem('stockwise-watchlist');
    localStorage.removeItem('stockwise-portfolio');
    // Force navigation to login page
    window.location.href = '/';
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};