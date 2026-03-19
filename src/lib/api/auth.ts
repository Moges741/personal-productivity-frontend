import { api } from "@/lib/api/client";
import type { User } from "@/store/auth-store";

export type AuthResponse = {
  access_token: string;
  user: User;
};

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function signup(payload: { email: string; password: string; name: string }) {
  await api.post("/users/signup", payload);
  return login({ email: payload.email, password: payload.password });
}

export async function refreshAccessToken() {
  const { data } = await api.post<AuthResponse>("/auth/refresh");
  return data;
}