import apiService from "../axios/axiosInstance";

// ═══════════════════════════════════════════════
//  INTERFACES
// ═══════════════════════════════════════════════

export type SpaceStatus = "available" | "reserved" | "occupied";

export interface ParkingSpace {
    id: string;
    lotId: string;
    code: string;      // ej: A1, B2
    type: string;      // regular | discapacitado | moto
    isActive: boolean;
    floor: number;
    createdAt: string;
    status: SpaceStatus; // calculado desde reservaciones en el backend
}

export interface ParkingAvailability {
    lotId: string;
    totalSpaces: number;
    availableCount: number;
    reservedCount: number;
    occupiedCount: number;
    spaces: ParkingSpace[];
    lastUpdated: string;
}

// ═══════════════════════════════════════════════
//  API CALLS
// ═══════════════════════════════════════════════

// Espacios de un parqueadero con status real calculado desde reservaciones
export const getParkingSpaces = async (lotId: string): Promise<ParkingSpace[]> => {
    const response = await apiService.api.get(`/parking-spaces/lot/${lotId}`);
    return response.data;
};

// Disponibilidad completa — usado por el polling
export const getParkingAvailability = async (lotId: string): Promise<ParkingAvailability> => {
    const response = await apiService.api.get(`/parking-spaces/lot/${lotId}/availability`);
    return response.data;
};

// Verificar si un espacio puntual sigue disponible (antes de confirmar reserva)
export const checkSpaceAvailable = async (spaceId: string): Promise<boolean> => {
    const response = await apiService.api.get(`/parking-spaces/${spaceId}/check`);
    return response.data;
};

// ═══════════════════════════════════════════════
//  POLLING — Actualización en tiempo real
// ═══════════════════════════════════════════════

/**
 * Inicia polling de disponibilidad para un parqueadero.
 * Retorna una función para detener el polling.
 *
 * Uso en componente:
 *   useEffect(() => {
 *     const stop = startAvailabilityPolling(lotId, (data) => setSpaces(data.spaces));
 *     return () => stop();
 *   }, [lotId]);
 */
export const startAvailabilityPolling = (
    lotId: string,
    onUpdate: (data: ParkingAvailability) => void,
    onError?: (error: any) => void,
    intervalMs: number = 5000
): (() => void) => {
    let isActive = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const poll = async () => {
        if (!isActive) return;
        try {
            const data = await getParkingAvailability(lotId);
            if (isActive) onUpdate(data);
        } catch (error) {
            if (isActive && onError) onError(error);
        }
        if (isActive) {
            timeoutId = setTimeout(poll, intervalMs);
        }
    };

    poll(); // primera llamada inmediata
    return () => {
        isActive = false;
        clearTimeout(timeoutId);
    };
};
export const getAllLotsAvailability = async (): Promise<{ lotId: string; availableCount: number }[]> => {
    const response = await apiService.api.get("/parking-spaces/availability/all");
    return response.data;
};   // Disponibilidad de todos los parqueaderos — 