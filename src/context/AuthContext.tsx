import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth/auth.api';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: (idToken: string) => Promise<any>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          const userData = await authApi.getUser();
          if (userData) {
            setUser(userData);
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.login({ email, password });
      if (response) {
        setUser(response.user);
        setIsLoggedIn(true);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.register({ name, email, password, confirmPassword });
      if (response) {
        setUser(response.user);
        setIsLoggedIn(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.googleLogin(idToken);
      if (response) {
        // store token and user similar to login
        await AsyncStorage.setItem('access_token', response.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setIsLoggedIn(true);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await authApi.getProfile();
      if (profile) {
        setUser(profile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        login,
        loginWithGoogle,
        register,
        logout,
        getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
