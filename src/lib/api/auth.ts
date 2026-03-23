import { api } from "@/lib/api/client";
import { useAuthStore, type User } from "@/store/auth-store";

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};

function saveRefreshToken(token: string) {
  localStorage.setItem("evolve-refresh-token", token);
}

function clearRefreshToken() {
  localStorage.removeItem("evolve-refresh-token");
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);

  saveRefreshToken(data.refresh_token);

  // ✅ Store user + token in Zustand immediately after login
  useAuthStore.getState().setAuth({
    accessToken: data.access_token,
    user: data.user,
  });

  return data;
}

export async function signup(payload: {
  email: string;
  password: string;
  name: string;
}) {
  await api.post("/users/signup", payload);
  return login({ email: payload.email, password: payload.password });
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("evolve-refresh-token");

  if (!refreshToken) {
    throw new Error("No refresh token in localStorage");
  }

  const { data } = await api.post<AuthResponse>("/auth/refresh", {
    refreshToken,
  });

  if (data.refresh_token) {
    saveRefreshToken(data.refresh_token);
  }

  // ✅ Also update Zustand when token is refreshed
  useAuthStore.getState().setAuth({
    accessToken: data.access_token,
    user: data.user,
  });

  return data;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Backend logout failed, forcing client logout", error);
  } finally {
    clearRefreshToken();
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