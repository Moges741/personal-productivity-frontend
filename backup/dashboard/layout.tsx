"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { accessToken, isAuthReady } = useAuthStore();

  useEffect(() => {
    if (isAuthReady && !accessToken) {
      router.replace("/login");
    }
  }, [isAuthReady, accessToken, router]);

  if (!isAuthReady) {
    return <div className="p-6 text-sm text-muted-foreground">Checking session...</div>;
  }

  if (!accessToken) return null;

  return <>{children}</>;
}