import api from '../axios/axiosInstance';
export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  available: number;
  total: number;
  price: string;
  rating: number;
  isFavorite: boolean;
  distance?: number;
  etaMinutes?: number;
  tags: string[];
}

export const getParkings = async (): Promise<ParkingLot[]> => {
  const response = await api.api.get<ParkingLot[]>('/parking-lots');
  return response.data;
};
