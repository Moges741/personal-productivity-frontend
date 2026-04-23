"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { refreshAccessToken } from "@/lib/api/auth";
import { usePathname } from "next/navigation";


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth      = useAuthStore((s) => s.setAuth);
  const clearAuth    = useAuthStore((s) => s.clearAuth);
  const setAuthReady = useAuthStore((s) => s.setAuthReady);
  const accessToken  = useAuthStore((s) => s.accessToken);
    const pathname     = usePathname();


  useEffect(() => {
    (async () => {
      try {
        // accessToken already rehydrated from localStorage by Zustand persist.
        // If it exists, try to get a fresh one using the refresh token.
        // If no refresh token exists, refreshAccessToken() will throw
        // and we fall through to clearAuth().
         if (pathname === "/auth/callback") {
      return;
    }

        if (accessToken) {
          const data = await refreshAccessToken();
          setAuth({ accessToken: data.access_token, user: data.user });
        } else {
          // No token at all — definitely logged out
          clearAuth();
        }
      } catch {
        // Refresh token expired or missing — log out cleanly
        clearAuth();
      } finally {
        setAuthReady(true);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  return <>{children}</>;
}