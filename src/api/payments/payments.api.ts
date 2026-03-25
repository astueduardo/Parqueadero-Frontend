import apiService from "../axios/axiosInstance";

export interface PaymentIntentResponse {
    client_secret: string;
    amount: number;
    currency: string;
    reservation_id: string;
}

export interface ConfirmPaymentResponse {
    message: string;
    payment: {
        id: string;
        amount: number;
        status: string;
        created_at: string;
    };
}

export const paymentsApi = {
    // Obtener publishable key
    getConfig: async (): Promise<{ publishable_key: string }> => {
        const response = await apiService.api.get('/payments/config');
        return response.data;
    },

    // Crear PaymentIntent → devuelve client_secret
    createIntent: async (reservation_id: string): Promise<PaymentIntentResponse> => {
        const response = await apiService.api.post('/payments/create-intent', {
            reservation_id,
        });
        return response.data;
    },

    // Confirmar pago al backend
    confirm: async (payment_intent_id: string): Promise<ConfirmPaymentResponse> => {
        const response = await apiService.api.post('/payments/confirm', {
            payment_intent_id,
        });
        return response.data;
    },

    // Historial de pagos
    getMyPayments: async () => {
        const response = await apiService.api.get('/payments/my');
        return response.data;
    },
};