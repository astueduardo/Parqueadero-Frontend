import api from "../axios/axiosInstance";

export const favoritesApi = {
    addFavorite: async (parkingId: string) => {
        const response = await api.api.post(`/favorites/${parkingId}`);
        return response.data;
    },

    removeFavorite: async (parkingId: string) => {
        const response = await api.api.delete(`/favorites/${parkingId}`);
        return response.data;
    },

    getFavorites: async () => {
        const response = await api.api.get(`/favorites`);
        return response.data;
    },
};
