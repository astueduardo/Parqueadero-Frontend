import apiService from "../axios/axiosInstance";

/* ========= INTERFACES ========= */

export interface Vehicle {
  vehicle_id: string;
  user_id: string;
  plate_number: string;
  brand?: string;
  model?: string;
  color: string;
  vehicle_type: string;
  year?: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateVehicleDto {
  plate_number: string;
  brand?: string;
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
  console.log('📡 API - getMyVehicles');
  try {
    const response = await apiService.api.get("/vehicles/my");
    console.log('✅ API - getMyVehicles exitoso:', response.data.length, 'vehículos');
    return response.data;
  } catch (error) {
    console.error('❌ API - getMyVehicles error:', error);
    throw error;
  }
};

export const createVehicle = async (data: CreateVehicleDto): Promise<Vehicle> => {
  console.log('📡 API - createVehicle');
  console.log('  Datos enviados:', data);
  try {
    const response = await apiService.api.post("/vehicles", data);
    console.log('✅ API - createVehicle exitoso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ API - createVehicle error:', error.response?.data || error);
    throw error;
  }
};

export const updateVehicle = async (
  vehicle_id: string,
  data: UpdateVehicleDto
): Promise<Vehicle> => {
  console.log('📡 API - updateVehicle');
  console.log('  vehicle_id:', vehicle_id);
  console.log('  vehicle_id tipo:', typeof vehicle_id);
  console.log('  URL completa:', `/vehicles/${vehicle_id}`);
  console.log('  Datos a actualizar:', data);

  try {
    const response = await apiService.api.patch(`/vehicles/${vehicle_id}`, data);
    console.log('✅ API - updateVehicle exitoso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ API - updateVehicle error:');
    console.error('  Status:', error.response?.status);
    console.error('  Data:', error.response?.data);
    console.error('  Message:', error.response?.data?.message);
    throw error;
  }
};

export const deleteVehicle = async (vehicle_id: string): Promise<void> => {
  console.log('📡 API - deleteVehicle INICIANDO');
  console.log('  vehicle_id recibido:', vehicle_id);
  console.log('  vehicle_id tipo:', typeof vehicle_id);
  console.log('  vehicle_id length:', vehicle_id?.length);
  console.log('  vehicle_id es null/undefined:', vehicle_id == null);
  console.log('  URL que se va a llamar:', `/vehicles/${vehicle_id}`);

  // ✅ Validación adicional
  if (!vehicle_id || vehicle_id === 'undefined' || vehicle_id === 'null') {
    console.error('❌ vehicle_id inválido!');
    throw new Error('ID de vehículo inválido');
  }

  try {
    console.log('📤 Ejecutando DELETE request...');
    const response = await apiService.api.delete(`/vehicles/${vehicle_id}`);
    console.log('✅ API - deleteVehicle exitoso');
    console.log('  Response status:', response.status);
    console.log('  Response data:', response.data);
  } catch (error: any) {
    console.error('❌ API - deleteVehicle FALLÓ:');
    console.error('  Error completo:', error);
    console.error('  Error.response:', error.response);
    console.error('  Status code:', error.response?.status);
    console.error('  Error data:', error.response?.data);
    console.error('  Error message:', error.response?.data?.message);
    console.error('  Error stack:', error.stack);
    throw error;
  }
};