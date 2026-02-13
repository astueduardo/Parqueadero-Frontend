import api from "../axios/axiosInstance";

export interface CreateReservationRequest {
  space_id: string;
  start_time: string; // ISO string
  end_time: string;   // ISO string
}

export interface Reservation {
  id: string;
  space_id: string;
  start_time: string;
  end_time: string;
  status: "pending" | "paid" | "cancelled";
  qr_code: string;
  created_at: string;
}

/* Crear reserva */
export const createReservation = async (
  data: CreateReservationRequest
): Promise<Reservation> => {
  const response = await api.api.post<Reservation>("/reservations", data);
  return response.data;
};

/* Obtener mis reservas */
export const getMyReservations = async (): Promise<Reservation[]> => {
  const response = await api.api.get<Reservation[]>("/reservations/my");
  return response.data;
};

/* Obtener detalle de una reserva */
export const getReservationById = async (
  id: string
): Promise<Reservation> => {
  const response = await api.api.get<Reservation>(`/reservations/${id}`);
  return response.data;
};
