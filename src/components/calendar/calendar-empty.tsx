"use client";

import { motion } from "framer-motion";
import { CalendarPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CalendarEmpty({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-border bg-background shadow-sm"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-300/35 via-fuchsia-300/14 to-amber-300/22 blur-3xl dark:from-indigo-500/18 dark:via-fuchsia-500/12 dark:to-amber-500/14" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-300/22 via-cyan-300/14 to-blue-300/22 blur-3xl dark:from-emerald-500/12 dark:via-cyan-500/10 dark:to-blue-500/12" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_55%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            A calm, luxurious day planner
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight">
            Schedule your first event.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Your calendar should feel like a journal: clear, beautiful, and motivating. Start with one meaningful block.
          </p>

          <div className="mt-6">
            <Button onClick={onCreate} className="rounded-xl shadow-sm hover:shadow-md transition-all">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Create an event
            </Button>
          </div>
        </div>

        <div className="h-40 sm:h-44 w-full sm:w-72 rounded-2xl border border-border bg-card/60 backdrop-blur overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(99,102,241,0.20),transparent_55%),radial-gradient(circle_at_75%_70%,rgba(236,72,153,0.16),transparent_55%)]" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-16 w-16 rounded-2xl border border-border bg-background/80 shadow-sm grid place-items-center">
              <CalendarPlus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}