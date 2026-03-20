import api from "../axios/axiosInstance";

export interface CreateReservationRequest {
  space_id: string;
  start_time: string;
  end_time: string;
  vehicle_id?: string; // ← agrega esto
}

export interface Reservation {
  id: string;
  spaceId: string;
  userId: string;
  vehicleId?: string;
  start_time: string;
  end_time: string;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  qr_code: string;
  created_at: string;
}

export const createReservation = async (
  data: CreateReservationRequest
): Promise<Reservation> => {
  const response = await api.api.post<Reservation>("/reservations", data);
  return response.data;
};

export const getMyReservations = async (): Promise<Reservation[]> => {
  const response = await api.api.get<Reservation[]>("/reservations/my");
  return response.data;
};

export const getReservationById = async (id: string): Promise<Reservation> => {
  const response = await api.api.get<Reservation>(`/reservations/${id}`);
  return response.data;
};

export const cancelReservation = async (id: string): Promise<Reservation> => {
  const response = await api.api.patch<Reservation>(`/reservations/${id}/cancel`, {});
  return response.data;
};