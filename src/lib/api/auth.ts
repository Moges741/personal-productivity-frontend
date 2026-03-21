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
    // 1. Tell backend to clear the httpOnly refresh token cookie
    // (Make sure your NestJS backend has a POST /auth/logout endpoint)
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Backend logout failed, clearing local state anyway", error);
  } finally {
    // 2. Clear the middleware hint cookie
    document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";
    
    // 3. Clear Zustand memory state
    useAuthStore.getState().clearAuth();
  }
}