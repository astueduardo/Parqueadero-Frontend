// utils/theme/theme.ts
export const lightTheme = {
    colors: {
        // Tus colores originales + los que ya usas en la app
        primary: '#2563EB',      // Tu azul del header
        success: '#34C759',       // Tu verde de register
        warning: '#f0b923',       // Tu amarillo de reservar
        danger: '#FF3B30',
        info: '#3B82F6',          // Tu azul de reservaciones
        vehicle: '#55c035',       // Tu verde de vehículos

        // Fondos (tus colores originales)
        background: '#f5f5f5',
        card: '#ffffff',
        header: '#2563EB',

        // Textos (tus colores originales)
        text: '#333333',
        textSecondary: '#666666',
        textMuted: '#999999',
        textLight: '#FFFFFF',

        // Bordes (tus colores originales)
        border: '#dddddd',
        borderLight: '#2020203f',

        // Estados
        disabled: '#999999',
        error: '#FF3B30',
    },

    // Tu spacing original mejorado
    spacing: {
        xs: 6,
        sm: 12,
        md: 16,
        lg: 24,
        xl: 32,
    },

    // Tu radius original (renombrado a plural para consistencia)
    radius: {
        sm: 8,
        md: 12,
        lg: 20,
        xl: 25,
        round: 9999,
    },

    // Tu fonts original
    fonts: {
        default: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        // Agregamos variantes por si las necesitas
        light: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        medium: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        bold: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    },

    // Tipografía basada en tus estilos actuales
    typography: {
        sizes: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 18,
            xl: 24,
            xxl: 32,
        },
        weights: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
    },
};

export const darkTheme = {
    colors: {
        primary: '#3B82F6',
        success: '#34C759',
        warning: '#f0b923',
        danger: '#FF453A',
        info: '#0A84FF',
        vehicle: '#32D74B',

        // Fondos modo oscuro
        background: '#1C1C1E',
        card: '#2C2C2E',
        header: '#1C1C1E',

        // Textos modo oscuro
        text: '#FFFFFF',
        textSecondary: '#EBEBF5',
        textMuted: '#8E8E93',
        textLight: '#FFFFFF',

        // Bordes modo oscuro
        border: '#3A3A3C',
        borderLight: '#38383A',

        // Estados
        disabled: '#666666',
        error: '#FF453A',
    },

    // Mantenemos igual todo lo demás
    spacing: { ...lightTheme.spacing },
    radius: { ...lightTheme.radius },
    fonts: { ...lightTheme.fonts },
    typography: { ...lightTheme.typography },
};

export type Theme = typeof lightTheme;