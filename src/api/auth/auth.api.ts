import api from "../axios/axiosInstance";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    role?: "user" | "admin" | "owner" | "operator";
    auth_provider?: "local" | "google";
    created_at?: string;
  };
}

export const authApi = {
  login: (data: LoginRequest) =>
    api.login(data.email, data.password),

  register: (data: RegisterRequest) =>
    api.register(data.name, data.username, data.email, data.password, data.confirmPassword),

  getProfile: () =>
    api.getProfile(),

  logout: () =>
    api.logout(),

  getToken: () =>
    api.getToken(),

  getUser: () =>
    api.getUser(),

  // Google: recibe idToken, backend responde con access_token + user
  // La persistencia la hace ApiService.saveSession para no duplicar lógica
  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const response = await api.api.post<AuthResponse>('/auth/google', { idToken });
    await api.saveSession(response.data.access_token, response.data.user);
    return response.data;
  },
};