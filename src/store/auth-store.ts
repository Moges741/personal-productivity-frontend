"use client";

import { create } from "zustand";

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  avatarUrl?: string | null;
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthReady: boolean;
  setAuth: (payload: { accessToken: string; user: User }) => void;
  clearAuth: () => void;
  setAuthReady: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthReady: false,
  
  setAuth: ({ accessToken, user }) => set({ accessToken, user }),
  
  clearAuth: () => {
    // THE FIX: Destroy the middleware hint cookie so proxy.ts lets us reach /login!
    if (typeof document !== "undefined") {
      document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";
    }
    // Clear memory
    set({ accessToken: null, user: null });
  },
  
  setAuthReady: (v) => set({ isAuthReady: v }),
}));