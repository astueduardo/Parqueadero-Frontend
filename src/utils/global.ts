// utils/global.ts
import { Dimensions } from 'react-native';
import { lightTheme } from './theme';

const { width, height } = Dimensions.get('window');

// Constantes globales útiles
export const global = {
  // Dimensiones de pantalla
  screen: {
    width,
    height,
    isSmallDevice: width < 375,
  },

  // Tu tema por defecto (light)
  theme: lightTheme,

  // Funciones de utilidad
  formatCurrency: (amount: number) => {
    return `$${amount.toFixed(2)}`;
  },

  formatDate: (date: Date) => {
    return date.toLocaleDateString('es-ES');
  },

  // Validaciones comunes
  validators: {
    email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    password: (password: string) => password.length >= 6,
  },
};

export default global;