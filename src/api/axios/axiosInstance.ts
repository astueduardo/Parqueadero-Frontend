import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getApiUrl = () => {
    // ✅ Variable de entorno primero — para producción
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    // ✅ Para desarrollo local
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:3001/api';
    }


};

console.log('🔗 Conectando a:', getApiUrl());

class ApiService {
    api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: getApiUrl(),
        });

        this.api.interceptors.request.use(
            async (config) => {
                const token = await AsyncStorage.getItem('access_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        this.api.interceptors.response.use(
            (resp) => resp,
            (error) => Promise.reject(error),
        );
    }

    // ─── Persistencia ────────────────────────────────────────────────────────

    async saveSession(access_token: string, user: object) {
        await AsyncStorage.setItem('access_token', access_token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
    }

    async clearSession() {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('user');
    }

    async getToken(): Promise<string | null> {
        return AsyncStorage.getItem('access_token');
    }

    async getUser(): Promise<any | null> {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // ─── Auth ─────────────────────────────────────────────────────────────────

    async login(email: string, password: string) {
        const response = await this.api.post('/auth/login', { email, password });
        await this.saveSession(response.data.access_token, response.data.user);
        return response.data;
    }

    async register(name: string, username: string, email: string, password: string, confirmPassword: string) {
        const response = await this.api.post('/auth/register', {
            name,
            username,
            email,
            password,
            confirmPassword,
        });
        // Si el backend devuelve token al registrarse, persistimos la sesión
        if (response.data.access_token) {
            await this.saveSession(response.data.access_token, response.data.user);
        }
        return response.data;
    }

    async getProfile() {
        const response = await this.api.get('/auth/profile');
        return response.data;
    }

    async logout() {
        await this.clearSession();
    }
}

const apiService = new ApiService();
export default apiService;