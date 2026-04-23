"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  avatarUrl?: string | null;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthReady: boolean;
  setTokens: (access: string, refresh: string) => void;
  setAuth: (payload: { accessToken: string; user: User }) => void;
  clearAuth: () => void;
  setAuthReady: (v: boolean) => void;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthReady: false,

      setUser: (user) => set({ user }),
   setTokens: (access: string, refresh: string) => 
  set({ accessToken: access, refreshToken: refresh }),
      setAuth: ({ accessToken, user }) => set({ accessToken, user }),

      clearAuth: () => {
        // Clear the middleware hint cookie
        if (typeof document !== "undefined") {
          document.cookie =
            "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";
        }
        set({ accessToken: null, refreshToken: null, user: null });
      },

      setAuthReady: (v) => set({ isAuthReady: v }),
    }),
    {
      name: "evolve-auth",          // localStorage key
      // Only persist token + user — never persist isAuthReady
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);