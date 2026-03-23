import api from "../axios/axiosInstance";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin" | "owner" | "operator";
  created_at?: string;
  updated_at?: string;
  auth_provider?: "local" | "google";
  username?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

export interface SetRoleDto {
  role: "user" | "admin" | "owner" | "operator";
}

export const usersApi = {
  // ─── Admin ──────────────────────────────────────────────────────────────
  list: () =>
    api.api.get<User[]>('/users').then(r => r.data),

  get: (id: string) =>
    api.api.get<User>(`/users/${id}`).then(r => r.data),

  create: (payload: CreateUserDto) =>
    api.api.post<User>('/users', payload).then(r => r.data),

  // Solo admins — actualiza cualquier usuario por ID
  update: (id: string, payload: UpdateUserDto) =>
    api.api.patch<User>(`/users/${id}`, payload).then(r => r.data),

  setRole: (id: string, payload: SetRoleDto) =>
    api.api.patch<User>(`/users/${id}/role`, payload).then(r => r.data),

  remove: (id: string) =>
    api.api.delete(`/users/${id}`).then(r => r.data),

  // ─── Usuario normal ──────────────────────────────────────────────────────
  // Usa PATCH /users/profile — protegido solo con JWT, sin RolesGuard
  updateMyProfile: (payload: Pick<UpdateUserDto, 'username'>) =>
    api.api.patch<User>('/users/profile', payload).then(r => r.data),
};