"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckSquare,
  Gauge,
  Goal,
  NotebookPen,
  Train,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard",  icon: Gauge       },
  { label: "Notes",     href: "/notes",      icon: NotebookPen },
  { label: "Tasks",     href: "/tasks",      icon: CheckSquare },
  { label: "Habits",    href: "/habits",     icon: Zap         },
  { label: "Goals",     href: "/goals",      icon: Goal        },
  { label: "Calendar",  href: "/calendar",   icon: Calendar    },
  { label: "My Progress", href: "/progress", icon: Train       },
];

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({ collapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onCloseMobile}
      />

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 84 : 260 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r border-border/40",
          "bg-background/80 backdrop-blur-2xl flex-col hidden md:flex"
        )}
      >
        <SidebarContent
          pathname={pathname}
          collapsed={collapsed}
          instanceId="desktop"
        />
      </motion.aside>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[88%] max-w-[300px] flex-col",
          "border-r border-border/40 bg-background/95 backdrop-blur-xl",
          "transform transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          pathname={pathname}
          collapsed={false}
          onNavigate={onCloseMobile}
          instanceId="mobile"
        />
      </aside>
    </>
  );
}

function SidebarContent({
  pathname,
  collapsed,
  onNavigate,
  instanceId,
}: {
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
  instanceId: string;
}) {
  return (
    <nav className="flex h-full flex-col p-3" aria-label="Main navigation">

      {/* ── Logo ──────────────────────────────────────────────── */}
      <div className="mb-6 mt-2 flex h-14 items-center px-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl overflow-hidden">
          <Image
            src="/images/logo1.png"  
            alt="Evolve logo"
            width={100}
            height={100}
            className="object-contain"
            priority
          />
        </div>

        {!collapsed && (
          <Link
            href="/"
            className="ml-3 font-semibold tracking-tight text-foreground line-clamp-1 hover:text-primary transition-colors"
          >
            Home
          </Link>
        )}
      </div>

      {/* ── Nav items ─────────────────────────────────────────── */}
      <ul className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  "outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {/* Animated active background */}
                {isActive && (
                  <motion.div
                    layoutId={`activeNav-${instanceId}`}
                    className="absolute inset-0 rounded-xl bg-blue-500/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon
                  className={cn(
                    "z-10 h-[18px] w-[18px] shrink-0 transition-transform group-hover:scale-110",
                    isActive && "text-blue-600 dark:text-blue-400"
                  )}
                />
                {!collapsed && <span className="z-10">{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}