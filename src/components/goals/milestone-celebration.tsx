"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function MilestoneCelebration({ progress }: { progress: number }) {
  const done = progress >= 100;
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={done ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      className="pointer-events-none absolute -right-2 -top-2"
    >
      <div className="rounded-full border border-border bg-background/70 backdrop-blur-md p-1 shadow-sm">
        <Sparkles className="h-4 w-4 text-amber-500" />
      </div>
    </motion.div>
  );
}