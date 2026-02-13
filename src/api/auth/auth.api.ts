import api from "../axios/axiosInstance";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: "user" | "admin";
    auth_provider?: "local" | "google";
    createdAt: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

export const authApi = {
  login: (data: LoginRequest) => api.login(data.email, data.password),

  register: (data: RegisterRequest) =>
    api.register(data.name, data.email, data.password, data.confirmPassword),

  getProfile: () => api.getProfile(),

  logout: () => api.logout(),

  getToken: () => api.getToken(),

  getUser: () => api.getUser(),

  // Google (mobile): send idToken to backend
  googleLogin: (idToken: string) =>
    api.api.post("/auth/google", { idToken }).then((r) => r.data),
};
