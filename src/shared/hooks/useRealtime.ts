import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export const useRealtime = <T>(
    fetchFunction: () => Promise<T>,
    onUpdate: (data: T) => void,
    intervalMs: number = 5000
) => {
    // ← useRef para evitar re-renders innecesarios
    const fetchRef = useRef(fetchFunction);
    const updateRef = useRef(onUpdate);

    useEffect(() => {
        fetchRef.current = fetchFunction;
        updateRef.current = onUpdate;
    }, [fetchFunction, onUpdate]);

    useEffect(() => {
        let isActive = true;

        const fetchData = async () => {
            if (!isActive) return;
            try {
                const data = await fetchRef.current();
                if (isActive) updateRef.current(data);
            } catch (error) {
                console.error('Error en tiempo real:', error);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, intervalMs);

        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') fetchData();
        });

        return () => {
            isActive = false;
            clearInterval(intervalId);
            subscription.remove();
        };
    }, [intervalMs]); // ← solo intervalMs como dep, funciones via ref
};