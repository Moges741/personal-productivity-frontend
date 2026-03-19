"use client"


import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import {refreshAccessToken} from "@/lib/api/auth";


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setAuthReady = useAuthStore((s) => s.setAuthReady);

  useEffect(() => {
    (async () => {
      try {
        const data = await refreshAccessToken(); // uses httpOnly refresh cookie
        setAuth({ accessToken: data.access_token, user: data.user });
      } catch {
        clearAuth();
      } finally {
        setAuthReady(true);
      }
    })();
  }, [setAuth, clearAuth, setAuthReady]);

  return children;
}