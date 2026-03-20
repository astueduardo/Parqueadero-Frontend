// shared/hooks/useRealtime.ts - Versión ultra simple
import { useEffect } from 'react';
import { AppState } from 'react-native';

export const useRealtime = <T>(
    fetchFunction: () => Promise<T>,
    onUpdate: (data: T) => void,
    intervalMs: number = 5000
) => {
    useEffect(() => {
        // Función para obtener datos
        const fetchData = async () => {
            try {
                const data = await fetchFunction();
                onUpdate(data);
            } catch (error) {
                console.error('Error en tiempo real:', error);
            }
        };

        // Llamada inicial
        fetchData();

        // Configurar intervalo
        const intervalId = setInterval(fetchData, intervalMs);

        // Escuchar cuando la app vuelve a primer plano
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                fetchData();
            }
        });

        // Limpiar al desmontar
        return () => {
            clearInterval(intervalId);
            subscription.remove();
        };
    }, []); // Solo se ejecuta una vez
};