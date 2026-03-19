"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type SidebarProps = {
  items: NavItem[];
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({ items, collapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onCloseMobile}
      />

      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 84 : 272,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r border-border/60 bg-background/80 backdrop-blur-xl",
          "hidden md:block"
        )}
      >
        <SidebarContent items={items} pathname={pathname} collapsed={collapsed} />
      </motion.aside>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-[88%] max-w-[320px] border-r border-border/60 bg-background/95 backdrop-blur-xl p-3",
          "transform transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent items={items} pathname={pathname} collapsed={false} onNavigate={onCloseMobile} />
      </aside>
    </>
  );
}

function SidebarContent({
  items,
  pathname,
  collapsed,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex h-full flex-col p-3" aria-label="Main navigation">
      <div className="mb-6 px-2 pt-2">
        <p className={cn("text-sm font-semibold tracking-tight", collapsed && "sr-only")}>
          Productivity
        </p>
      </div>

      <ul className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-all",
                  "focus-visible:ring-2 focus-visible:ring-blue-500/60",
                  active
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}