// shared/utils/distanceUtils.ts
interface Coordinates {
    latitude: number;
    longitude: number;
}

/**
 * Fórmula de Haversine - Calcula distancia entre dos puntos
 */
export const calculateDistance = (
    point1: Coordinates,
    point2: Coordinates
): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
};

/**
 * Calcula tiempo estimado de llegada
 * @param distanceKm Distancia en kilómetros
 * @param speedKmh Velocidad promedio en km/h (default: 30)
 */
export const calculateTime = (distanceKm: number, speedKmh: number = 30): number => {
    const timeInHours = distanceKm / speedKmh;
    return Math.round(timeInHours * 60); // Minutos
};

/**
 * Formatea distancia para mostrar
 */
export const formatDistance = (distanceKm: number): string => {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
};

/**
 * Formatea tiempo para mostrar
 */
export const formatTime = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
};