import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Shopkeeper } from '../types';

type AuthUser = User | Shopkeeper | null;

interface AuthContextType {
  user: AuthUser;
  login: (credentials: { name: string; password: string }) => Promise<boolean>;
  logout: () => void;
  register: (userData: any, type: 'user' | 'shopkeeper') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('ecofinder-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (credentials: { name: string; password: string }): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('ecofinder-users') || '[]');
    const shopkeepers = JSON.parse(localStorage.getItem('ecofinder-shopkeepers') || '[]');
    
    const foundUser = [...users, ...shopkeepers].find(
      u => u.name === credentials.name && u.password === credentials.password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('ecofinder-user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecofinder-user');
  };

  const register = async (userData: any, type: 'user' | 'shopkeeper'): Promise<boolean> => {
    const storageKey = type === 'user' ? 'ecofinder-users' : 'ecofinder-shopkeepers';
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      role: type,
      ...(type === 'shopkeeper' && {
        rating: 0,
        totalRatings: 0,
        wasteTypes: userData.wasteTypes || []
      })
    };
    
    existingData.push(newUser);
    localStorage.setItem(storageKey, JSON.stringify(existingData));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};