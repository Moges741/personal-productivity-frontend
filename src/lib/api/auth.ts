import { api } from "@/lib/api/client";
import  {useAuthStore, type User } from "@/store/auth-store";

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

export async function logout() {
  try {
    // Tell backend to clear the httpOnly refresh cookie
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Backend logout failed, forcing client logout", error);
  } finally {
    // This will now clear memory AND the middleware cookie!
    useAuthStore.getState().clearAuth();
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await api.get<User>("/users/me");
    return data;
  } catch (error) {
    console.error("Failed to fetch current user", error);
    return null;
  }
}