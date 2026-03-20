// shared/hooks/useLocation.ts
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationData {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    error?: string;
}

const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();

        if (data?.address) {
            const a = data.address;

            const street =
                a.road ||
                a.pedestrian ||
                a.footway ||
                a.street ||
                a.neighbourhood ||
                a.suburb ||
                null;

            const city =
                a.city || a.town || a.village || a.county || 'Loja';

            return {
                address: street ?? city,
                city,
            };
        }
        return { address: 'Loja', city: 'Loja' };
    } catch {
        return { address: 'Loja', city: 'Loja' };
    }
};

export const useLocation = () => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [permissionDenied, setPermissionDenied] = useState(false);

    const getLocation = async () => {
        setLoading(true);
        setPermissionDenied(false);

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setPermissionDenied(true);
                setLoading(false);
                return;
            }

            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = position.coords;
            const addressInfo = await getAddressFromCoordinates(latitude, longitude);

            setLocation({ latitude, longitude, ...addressInfo });
            console.log('📍 Ubicación:', { latitude, longitude, ...addressInfo });
        } catch (error: any) {
            console.error('Error obteniendo ubicación:', error);
            setLocation({
                latitude: -3.9931,
                longitude: -79.2042,
                address: 'Centro',
                city: 'Loja',
                error: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLocation();
        const interval = setInterval(getLocation, 30000);
        return () => clearInterval(interval);
    }, []);

    return { location, loading, permissionDenied, retry: getLocation };
};