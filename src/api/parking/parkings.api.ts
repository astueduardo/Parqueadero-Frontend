import apiService from "../axios/axiosInstance";
// ← importa ParkingSpace desde parking-space para no duplicar
import { ParkingSpace } from "./parking-space";

export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  totalSpaces: number;
  availableSpaces: number;
  rating?: number;
  price?: number;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  parkingLotId: string;
  parkingLot: ParkingLot;
  createdAt: string;
}

export interface CreateParkingLotDto {
  name: string;
  address: string;
  totalSpaces: number;
  availableSpaces: number;
  rating?: number;
  price?: number;
  latitude?: number;
  longitude?: number;
}

export interface UpdateParkingLotDto {
  name?: string;
  address?: string;
  totalSpaces?: number;
  availableSpaces?: number;
  rating?: number;
  price?: number;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
}

export interface CreateParkingSpaceDto {
  lotId: string;
  code: string;
  type: string;
  floor?: number;
}

export interface UpdateParkingSpaceDto {
  code?: string;
  type?: string;
  floor?: number;
  isActive?: boolean;
}

// ═══════════════════════════════════════════════
//  PARKING LOTS
// ═══════════════════════════════════════════════

export const getAllParkingLots = async (): Promise<ParkingLot[]> => {
  const response = await apiService.api.get("/parking-lots");
  return response.data;
};

export const getParkingLotById = async (id: string): Promise<ParkingLot> => {
  const response = await apiService.api.get(`/parking-lots/${id}`);
  return response.data;
};

export const getMyParkingLots = async (): Promise<ParkingLot[]> => {
  const response = await apiService.api.get("/parking-lots/owner/my");
  return response.data;
};

export const createParkingLot = async (data: CreateParkingLotDto): Promise<ParkingLot> => {
  const response = await apiService.api.post("/parking-lots", data);
  return response.data;
};

export const updateParkingLot = async (id: string, data: UpdateParkingLotDto): Promise<ParkingLot> => {
  const response = await apiService.api.patch(`/parking-lots/${id}`, data);
  return response.data;
};

export const deleteParkingLot = async (id: string): Promise<{ message: string }> => {
  const response = await apiService.api.delete(`/parking-lots/${id}`);
  return response.data;
};

// ═══════════════════════════════════════════════
//  PARKING SPACES — CRUD básico
// ═══════════════════════════════════════════════

export const getSpacesByLot = async (lotId: string): Promise<ParkingSpace[]> => {
  const response = await apiService.api.get(`/parking-spaces/lot/${lotId}`);
  return response.data;
};

export const getParkingSpaceById = async (id: string): Promise<ParkingSpace> => {
  const response = await apiService.api.get(`/parking-spaces/${id}`);
  return response.data;
};

export const createParkingSpace = async (data: CreateParkingSpaceDto): Promise<ParkingSpace> => {
  const response = await apiService.api.post("/parking-spaces", data);
  return response.data;
};

export const updateParkingSpace = async (id: string, data: UpdateParkingSpaceDto): Promise<ParkingSpace> => {
  const response = await apiService.api.patch(`/parking-spaces/${id}`, data);
  return response.data;
};

export const deleteParkingSpace = async (id: string): Promise<{ message: string }> => {
  const response = await apiService.api.delete(`/parking-spaces/${id}`);
  return response.data;
};

// ═══════════════════════════════════════════════
//  FAVORITES
// ═══════════════════════════════════════════════

export const getMyFavorites = async (): Promise<Favorite[]> => {
  const response = await apiService.api.get("/favorites");
  return response.data;
};

export const checkIsFavorite = async (parkingLotId: string): Promise<{ isFavorite: boolean }> => {
  const response = await apiService.api.get(`/favorites/${parkingLotId}/check`);
  return response.data;
};

export const toggleFavorite = async (parkingLotId: string): Promise<{ isFavorite: boolean; message: string }> => {
  const response = await apiService.api.post(`/favorites/${parkingLotId}/toggle`);
  return response.data;
};

export const addFavorite = async (parkingLotId: string): Promise<Favorite> => {
  const response = await apiService.api.post(`/favorites/${parkingLotId}`);
  return response.data;
};

export const removeFavorite = async (parkingLotId: string): Promise<{ message: string }> => {
  const response = await apiService.api.delete(`/favorites/${parkingLotId}`);
  return response.data;
};