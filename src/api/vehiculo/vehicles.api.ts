import apiService from "../axios/axiosInstance";

/* ========= INTERFACES ========= */

export interface Vehicle {
  id: string;
  user_id: string;
  plate_number: string;
  brand?: string;        // ✅ Campo agregado
  model?: string;
  color: string;
  vehicle_type: string;
  year?: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateVehicleDto {
  plate_number: string;
  brand?: string;        // ✅ Campo agregado
  model?: string;
  color: string;
  vehicle_type: string;
  year?: number;
}

export interface UpdateVehicleDto {
  plate_number?: string;
  brand?: string;
  model?: string;
  color?: string;
  vehicle_type?: string;
  year?: number;
  is_active?: boolean;
}

/* ========= API CALLS ========= */

export const getMyVehicles = async (): Promise<Vehicle[]> => {
  const response = await apiService.api.get("/vehicles/my");
  return response.data;
};

export const createVehicle = async (data: CreateVehicleDto): Promise<Vehicle> => {
  const response = await apiService.api.post("/vehicles", data);
  return response.data;
};

export const updateVehicle = async (
  id: string,
  data: UpdateVehicleDto
): Promise<Vehicle> => {
  const response = await apiService.api.patch(`/vehicles/${id}`, data);
  return response.data;
};

export const deleteVehicle = async (id: string): Promise<void> => {
  await apiService.api.delete(`/vehicles/${id}`);
};