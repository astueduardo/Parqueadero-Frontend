import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth/auth.api';

export interface User {
  id: string;
  avatar_url?: string;   // ← base64 o URL de Google
  picture?: string;
  name: string;
  username: string;
  email: string;
  role?: string;
  role_id?: string;
  created_at?: string;
  updated_at?: string;
  auth_provider?: 'local' | 'google';
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: (idToken: string) => Promise<any>;
  register: (name: string, username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Función helper centralizada — un solo lugar para guardar sesión
const saveSession = async (access_token: string, user: User) => {
  await AsyncStorage.setItem('access_token', access_token);
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificar sesión al iniciar
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          const userData = await authApi.getUser();
          if (userData) {
            setUser(userData);
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        await AsyncStorage.multiRemove(['access_token', 'user']);
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
        await saveSession(response.access_token, response.user); // ✅ centralizado
        setUser(response.user);
        setIsLoggedIn(true);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, username: string, email: string, password: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.register({ name, username, email, password, confirmPassword });
      if (response) {
        await saveSession(response.access_token, response.user); // ✅ centralizado
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
        await saveSession(response.access_token, response.user); // ✅ centralizado
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
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  };

  const getProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await authApi.getProfile();
      if (profile) {
        setUser(profile);
        await AsyncStorage.setItem('user', JSON.stringify(profile));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading, isLoggedIn,
      login, loginWithGoogle, register, logout, getProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};