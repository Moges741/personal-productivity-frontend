"use client";

import {create} from 'zustand';

export type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null   ;
}
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
  clearAuth: () => set({ accessToken: null, user: null }),
  setAuthReady: (v) => set({ isAuthReady: v }),
}));