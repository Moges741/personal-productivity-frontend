import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // withCredentials removed — no longer sending cookies
});

let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

// Attach accessToken from localStorage (via Zustand) to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error?.response?.status !== 401 || original?._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push((token) => {
          if (!token) return reject(error);
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;

    try {
      // Read refreshToken directly from localStorage
      const refreshToken = localStorage.getItem("evolve-refresh-token");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        { refreshToken }, // send in body, not cookie
      );

      useAuthStore.getState().setAuth({
        accessToken: data.access_token,
        user: data.user,
      });

      // Save the new refresh token if backend rotates it
      if (data.refresh_token) {
        localStorage.setItem("evolve-refresh-token", data.refresh_token);
      }

      processQueue(data.access_token);
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return api(original);
    } catch (refreshErr) {
      // Refresh failed — full logout
      localStorage.removeItem("evolve-refresh-token");
      useAuthStore.getState().clearAuth();
      processQueue(null);

      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);