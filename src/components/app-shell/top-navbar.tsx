"use client";

import { useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  User as UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth-store";

type TopNavbarProps = {
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
};

export function TopNavbar({ onToggleSidebar, onOpenMobileSidebar }: TopNavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  // ── Read directly from Zustand (persisted to localStorage) ───
  // login() calls setAuth() which stores user here.
  // persist middleware rehydrates it on page refresh automatically.
  // No fetch needed — data is already here.
  const user = useAuthStore((s) => s.user);

  const displayName  = user?.name  ?? "";
  const displayEmail = user?.email ?? "";
  const avatarUrl    = user?.avatarUrl ?? "";
  const avatarInitial = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : "?";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/40 bg-background/60 backdrop-blur-2xl">
      <div className="flex h-full items-center gap-4 px-4 md:px-8">

        {/* Mobile Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileSidebar}
          className="md:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hidden md:flex text-muted-foreground hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="relative hidden w-full max-w-md md:block group">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-500" />
          <Input
            placeholder="Search notes, tasks, habits... (Cmd+K)"
            className="rounded-full bg-muted/40 border-none pl-10 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-border"
          />
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">

          <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark"
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />
            }
          </Button>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="relative h-9 w-9 rounded-full ml-2 ring-2 ring-border/50 hover:ring-border"
                aria-label="User menu"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                    {avatarInitial}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 rounded-xl border-border/60 bg-background/95 backdrop-blur-xl shadow-xl"
              align="end"
            >
              <DropdownMenuLabel className="p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground leading-none mt-1">
                    {displayEmail}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer rounded-lg mx-1">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-lg mx-1 text-red-500 focus:text-red-500 focus:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}