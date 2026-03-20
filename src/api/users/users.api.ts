import api from "../axios/axiosInstance";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin" | "owner" | "operator";
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}

export interface SetRoleDto {
  role?: "user" | "admin" | "owner" | "operator";
}
export const usersApi = {
  list: () => api.api.get("/users").then((r) => r.data as User[]),
  get: (id: string) => api.api.get(`/users/${id}`).then((r) => r.data as User),
  create: (payload: CreateUserDto) =>
    api.api.post("/users", payload).then((r) => r.data as User),
  update: (id: string, payload: UpdateUserDto) =>
    api.api.patch(`/users/${id}`, payload).then((r) => r.data as User),
  setRole: (id: string, payload: SetRoleDto) =>
    api.api.patch(`/users/${id}/role`, payload).then((r) => r.data as User),
  remove: (id: string) => api.api.delete(`/users/${id}`).then((r) => r.data),
};
