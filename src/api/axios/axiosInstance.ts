import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Función para obtener la URL según la plataforma
const getApiUrl = () => {
    console.log('📱 Platform.OS:', Platform.OS); // Para debug

    //https://parqueadero-bakend.onrender.com parqueadero en la nube

    if (Platform.OS === 'web') {
        return 'https://parqueadero-bakend.onrender.com';
    }

    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:3001/api';
    }

    return 'http://192.168.10.104:3001/api';
};

const API_BASE_URL = getApiUrl();
console.log('🔗 API_BASE_URL:', API_BASE_URL); // Debe mostrar puerto 3001

class ApiService {
    api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
        });

        this.api.interceptors.request.use(
            async (config) => {
                const token = await AsyncStorage.getItem('access_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log('[ApiService] Token:', token);
                }
                console.log('[ApiService] Request:', config.method?.toUpperCase(), config.url);
                const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
                console.log('[ApiService] Full URL:', fullUrl);
                // Debug adicional
                return config;
            },
            (error) => Promise.reject(error),
        );

        this.api.interceptors.response.use(
            (resp) => resp,
            (error) => {
                console.error('[ApiService] Response error:', error?.config?.method?.toUpperCase(), error?.config?.url, error?.message);
                return Promise.reject(error);
            },
        );
    }

    async login(email: string, password: string) {
        try {
            const response = await this.api.post('/auth/login', { email, password });
            if (response.data.access_token) {
                await AsyncStorage.setItem('access_token', response.data.access_token);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getMyVehicles() {
        try {
            const response = await this.api.get('/vehicles/my');
            return response.data; // Devuelve los vehículos del usuario
        } catch (error) {
            console.error('[VehicleService] Error al obtener vehículos:', error);
            throw error; // Puedes manejar errores aquí si es necesario
        }
    }

    async register(name: string, email: string, password: string, confirmPassword: string) {
        try {
            const response = await this.api.post('/auth/register', {
                name,
                email,
                password,
                confirmPassword,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getProfile() {
        try {
            const response = await this.api.get('/auth/profile');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('user');
    }

    async getToken() {
        return await AsyncStorage.getItem('access_token');
    }

    async getUser() {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}

const apiService = new ApiService();
export default apiService;