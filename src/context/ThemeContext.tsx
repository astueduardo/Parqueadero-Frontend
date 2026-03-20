// context/ThemeContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { lightTheme, darkTheme, Theme } from '../utils/theme';

export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  colors: Theme['colors'];
  spacing: Theme['spacing'];
  radius: Theme['radius'];
  fonts: Theme['fonts'];
  typography: Theme['typography'];
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'light'
}) => {
  const [themeType, setThemeType] = useState<ThemeType>(initialTheme);

  const currentTheme = themeType === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setThemeType(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themeType,
        colors: currentTheme.colors,
        spacing: currentTheme.spacing,
        radius: currentTheme.radius,
        fonts: currentTheme.fonts,
        typography: currentTheme.typography,
        toggleTheme,
        isDark: themeType === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};