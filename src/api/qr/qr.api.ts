import apiService from "../axios/axiosInstance";


export interface GeneratedQrResponse {
    qr_code: string;
    qr_image_url: string;
}

export interface ValidateQrResponse {
    success: boolean;
    type: "ENTRY" | "EXIT";
    message: string;
}

export const qrApi = {

    async generate(reservationId: string): Promise<GeneratedQrResponse> {
        try {
            const response = await apiService.get<GeneratedQrResponse>(
                "/qr/generate",
                {
                    params: { reservation_id: reservationId },
                }
            );
            return response.data;
        } catch (err) {
            throw new Error("Error generando QR");
        }
    },

    async validate(reservationId: string): Promise<ValidateQrResponse> {
        try {
            const response = await apiService.post<ValidateQrResponse>(
                "/qr/validate",
                {
                    reservation_id: reservationId,
                }
            );
            return response.data;
        } catch (err) {
            throw new Error("Error validando QR");
        }
    },
};
