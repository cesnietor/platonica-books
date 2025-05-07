// src/api/auth.ts
import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_ROOT;

export interface TokenResponse {
  access: string;
  refresh: string;
}

const api = axios.create({
  baseURL: `${API_ROOT}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // set credentials in cookies
});

export async function login(
  username: string,
  password: string,
): Promise<TokenResponse> {
  return await api
    .post<TokenResponse>("/token/", { username, password })
    .then((res) => res.data);
}

export async function refreshToken(): Promise<TokenResponse> {
  return await api
    .post<TokenResponse>("/token/refresh/")
    .then((res) => res.data);
}

export async function logout() {
  return await api.post("/logout/").then(() => {});
}
