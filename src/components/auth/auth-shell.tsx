"use client";

import { motion } from "framer-motion";
import Link from "next/link"; // ✅ FIXED
import Image from "next/image";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl p-6 shadow-xl"
      >
        {/* 🔷 Logo */}
        <Link
          href="/"
          className="flex flex-col items-center gap-2 mb-6 group"
        >
          <div className="relative h-16 w-16 overflow-hidden">
            <Image
              src="/images/logo1.png"
              alt="Evolve"
              fill
              className="object-contain scale-[1.8] object-center"
              priority
            />
          </div>
        </Link>

        {/* 🔷 Title */}
        <h1 className="text-2xl font-semibold tracking-tight text-center">
          {title}
        </h1>

        {/* 🔷 Subtitle */}
        <p className="mt-1 text-sm text-muted-foreground text-center">
          {subtitle}
        </p>

        {/* 🔷 Content */}
        <div className="mt-6">{children}</div>
      </motion.div>
    </main>
  );
}