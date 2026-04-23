"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuthStore } from "@/store/auth-store";
import type { User } from "@/store/auth-store";

// ── Inner component — reads search params ─────────────────────
// Separated so Suspense can wrap it correctly (required by Next.js
// for any component using useSearchParams in App Router)
function CallbackHandler() {
  const router     = useRouter();
  const params     = useSearchParams();
  const setAuth    = useAuthStore((s) => s.setAuth);
  const setAuthReady = useAuthStore((s) => s.setAuthReady);

  // Prevent double-execution in React StrictMode
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const accessToken  = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const userParam    = params.get("user");

    // ── Validate all required params exist ────────────────────
    if (!accessToken || !refreshToken || !userParam) {
      console.error("OAuth callback: missing required params", {
        accessToken:  !!accessToken,
        refreshToken: !!refreshToken,
        user:         !!userParam,
      });
      router.replace("/login?error=oauth_failed");
      return;
    }

    // ── Parse user object from query param ────────────────────
    let user: User;
    try {
      user = JSON.parse(decodeURIComponent(userParam));
    } catch (e) {
      console.error("OAuth callback: failed to parse user param", e);
      router.replace("/login?error=oauth_failed");
      return;
    }

    // ── Persist refresh token to localStorage ─────────────────
    // Must match the key your axios interceptor reads from:
    // localStorage.getItem("evolve-refresh-token")
    localStorage.setItem("evolve-refresh-token", refreshToken);

    // ── Set the middleware hint cookie ────────────────────────
    // Your (app)/layout.tsx checks this cookie to decide whether
    // to show the protected page or redirect to /login
    document.cookie =
      "isAuthenticated=true; path=/; max-age=604800; samesite=lax";

    // ── Update Zustand store ──────────────────────────────────
    // setAuth calls set({ accessToken, user }) which triggers
    // the persist middleware to write to localStorage under
    // the "evolve-auth" key immediately and synchronously
    setAuth({ accessToken, user });

    // ── Mark auth as ready ────────────────────────────────────
    // This unblocks the (app)/layout.tsx guard which waits for
    // isAuthReady === true before deciding to redirect or render
    setAuthReady(true);

    // ── Redirect to dashboard ─────────────────────────────────
    // Use replace() not push() so the callback URL is removed
    // from browser history — user can't go "back" to it
    router.replace("/dashboard");
  }, [params, router, setAuth, setAuthReady]);

  // ── Loading UI while processing ───────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">
          Signing you in...
        </p>
      </div>
    </div>
  );
}

// ── Page export — Suspense required for useSearchParams ───────
export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-10 h-10 rounded-full border-2 border-t-violet-500 animate-spin" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}