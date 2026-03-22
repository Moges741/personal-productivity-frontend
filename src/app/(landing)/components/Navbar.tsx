"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, Sparkles } from "lucide-react";
const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
];

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3 backdrop-blur-2xl border-b" : "py-5"
        }`}
        style={{
          background: scrolled
            ? isDark
              ? "rgba(10,10,15,0.85)"
              : "rgba(255,255,255,0.85)"
            : "transparent",
          borderColor: scrolled
            ? isDark
              ? "rgba(99,102,241,0.15)"
              : "rgba(99,102,241,0.1)"
            : "transparent",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* ── Left: Logo ──────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* <motion.div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 0 20px rgba(99,102,241,0.4)",
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Sparkles size={16} className="text-white" />
            </motion.div> */}
            <span
              className={`text-xl font-bold tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Evolve
            </span>
          </Link>

          {/* ── Center: Nav links ────────────────────────────── */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? isDark
                          ? "text-white"
                          : "text-slate-900"
                        : isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Active background pill */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: isDark
                            ? "rgba(99,102,241,0.15)"
                            : "rgba(99,102,241,0.08)",
                          border: `1px solid ${
                            isDark
                              ? "rgba(99,102,241,0.3)"
                              : "rgba(99,102,241,0.2)"
                          }`,
                        }}
                        layoutId="activeNavPill"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Hover background (non-active) */}
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity"
                        style={{
                          background: isDark
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.04)",
                        }}
                      />
                    )}

                    <span className="relative z-10">{link.label}</span>

                    {/* Active dot indicator */}
                    {isActive && (
                      <motion.span
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400"
                        layoutId="activeNavDot"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* ── Right: Theme toggle + auth ───────────────────── */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            {mounted && (
              <motion.button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isDark
                    ? "text-slate-400 hover:text-white hover:bg-white/10"
                    : "text-slate-500 hover:text-slate-900 hover:bg-black/5"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isDark ? "moon" : "sun"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? <Moon size={18} /> : <Sun size={18} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            )}

            {/* Divider */}
            <div
              className="w-px h-5 mx-2"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              }}
            />

            {/* Login */}
            <Link href="/progress">
              <motion.button
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/8"
                    : "text-slate-600 hover:text-slate-900 hover:bg-black/5"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                My Progress
              </motion.button>
            </Link>

            {/* Sign up */}
            <Link href="/notes">
              <motion.button
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 6px 28px rgba(99,102,241,0.5)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  className="absolute inset-0 bg-white/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.4 }}
                />
                Take your note
              </motion.button>
            </Link>
          </div>

          {/* ── Mobile: hamburger ────────────────────────────── */}
          <motion.button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={22} className={isDark ? "text-white" : "text-slate-900"} />
            ) : (
              <Menu size={22} className={isDark ? "text-white" : "text-slate-900"} />
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* ── Mobile menu ───────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden pt-20"
            style={{
              background: isDark
                ? "rgba(10,10,15,0.97)"
                : "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center gap-6 pt-12">

              {/* Center nav links on mobile too */}
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-lg font-medium transition-colors ${
                      isActive
                        ? "text-violet-400"
                        : isDark
                        ? "text-slate-200 hover:text-white"
                        : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Divider */}
              <div
                className="w-16 h-px"
                style={{
                  background: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
              />

              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className={`flex items-center gap-2 text-sm font-medium ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {isDark ? <Moon size={16} /> : <Sun size={16} />}
                  {isDark ? "Light mode" : "Dark mode"}
                </button>
              )}

              {/* Auth */}
              <Link
                href="/progress"
                onClick={() => setMobileOpen(false)}
                className={`text-lg font-medium ${
                  isDark ? "text-slate-200" : "text-slate-700"
                }`}
              >
                My Progress
              </Link>

              <Link href="/notes" onClick={() => setMobileOpen(false)}>
                <button
                  className="px-8 py-3 rounded-2xl text-base font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                  }}
                >
                  Take your Note
                </button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}