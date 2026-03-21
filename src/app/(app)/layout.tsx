"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/app-shell/sidebar";
import { TopNavbar } from "@/components/app-shell/top-navbar";
import { useAuthStore } from "@/store/auth-store";
import { ReactQueryProvider } from "@/components/providers/query-provider";
// import type { LucideIcon } from "lucide-react";
// Define NavItem type locally since it's not exported from sidebar
type NavItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarItems: NavItem[] = [
    // Example:
    // { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
    // Add your NavItem objects as needed
  ];

  const router = useRouter();
  const { accessToken, isAuthReady } = useAuthStore();

  // Route Protection fallback (in addition to proxy.ts)
  useEffect(() => {
    if (isAuthReady && !accessToken) router.replace("/login");
  }, [isAuthReady, accessToken, router]);

  if (!isAuthReady || !accessToken) return null;

  return (
    <ReactQueryProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className={`transition-all duration-300 ${collapsed ? "md:pl-20" : "md:pl-[260px]"}`}>
          <TopNavbar onToggleSidebar={() => setCollapsed(!collapsed)} onOpenMobileSidebar={() => setMobileOpen(true)} />

          <main className="min-h-[calc(100vh-4rem)] p-4 md:p-8 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </ReactQueryProvider>
  );
}