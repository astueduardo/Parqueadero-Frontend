import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/auth/auth.api';

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  role?: string;
  created_at?: string;
  auth_provider?: "local" | "google";
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: (idToken: string) => Promise<any>;
  register: (name: string, username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true hasta que verificamos sesión
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Al montar: si hay token, verificamos contra el servidor (no solo AsyncStorage)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await authApi.getToken();
        if (token) {
          // Refresca desde el servidor — detecta si el usuario fue modificado o eliminado
          const profile = await authApi.getProfile();
          setUser(profile);
          setIsLoggedIn(true);
        }
      } catch {
        // Token inválido o expirado — limpiamos sesión
        await authApi.logout();
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
      setIsLoggedIn(true);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    setIsLoading(true);
    try {
      const response = await authApi.register({ name, username, email, password, confirmPassword });
      // Solo seteamos sesión si el backend devuelve token al registrarse
      if (response?.user) {
        setUser(response.user);
        setIsLoggedIn(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    setIsLoading(true);
    try {
      // authApi.googleLogin ya persiste el token en AsyncStorage
      const response = await authApi.googleLogin(idToken);
      setUser(response.user);
      setIsLoggedIn(true);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresca el perfil del usuario desde el servidor (útil después de editar perfil)
  const refreshProfile = async () => {
    setIsLoading(true);
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isLoggedIn,
      login,
      loginWithGoogle,
      register,
      logout,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};