"use client";

import { useState } from "react";
import {
  Calendar,
  CheckSquare,
  Gauge,
  Goal,
  NotebookPen,
  Settings,
  Zap,
} from "lucide-react";
import { Sidebar } from "@/components/app-shell/sidebar";
import { TopNavbar } from "@/components/app-shell/top-navbar";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Gauge },
  { label: "Notes", href: "/notes", icon: NotebookPen },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Habits", href: "/habits", icon: Zap },
  { label: "Goals", href: "/goals", icon: Goal },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      >
        {/* Pass navItems as children if Sidebar is designed to render them this way */}
        {/* Example: */}
        {/* <SidebarNav navItems={navItems} /> */}
      </Sidebar>

      <div className={collapsed ? "md:pl-[84px]" : "md:pl-[272px]"}>
        <TopNavbar
          onToggleSidebar={() => setCollapsed((v) => !v)}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />

        <main
          id="main-content"
          className="h-[calc(100vh-4rem)] overflow-y-auto p-4 md:p-6 lg:p-8"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}