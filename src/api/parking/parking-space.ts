import apiService from "../axios/axiosInstance";

export interface ParkingSpace {
    id: string;
    number: string;
    status: "available" | "reserved" | "o   ccupied";
    floor: number;
    type: string;
}

/**
 * 🌍 PÚBLICO - Obtener espacios de un parqueadero
 * Ruta actualizada para coincidir con el backend
 */
export const getParkingSpaces = async (lotId: string): Promise<ParkingSpace[]> => {
    const response = await apiService.api.get(`/parking-spaces/lot/${lotId}`);
    return response.data;
};

/**
 * 🌍 PÚBLICO - Obtener detalle de un espacio
 */
export const getParkingSpace = async (spaceId: string): Promise<ParkingSpace> => {
    const response = await apiService.api.get(`/parking-spaces/${spaceId}`);
    return response.data;
};