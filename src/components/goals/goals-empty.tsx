"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GoalsEmpty({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-border bg-background shadow-sm"
    >
      {/* dreamy background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-300/35 via-fuchsia-300/15 to-amber-300/25 blur-3xl dark:from-indigo-500/18 dark:via-fuchsia-500/12 dark:to-amber-500/14" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-300/25 via-cyan-300/15 to-blue-300/25 blur-3xl dark:from-emerald-500/14 dark:via-cyan-500/10 dark:to-blue-500/14" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_55%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="relative p-8 sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Your future deserves a plan
            </div>

            <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight">
              Set your first goal.
            </h2>

            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Goals are more than tasks — they’re narratives. Create one meaningful outcome, make progress visible,
              and let the interface reward you for showing up.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button onClick={onCreate} className="rounded-xl shadow-sm hover:shadow-md transition-all">
                <Target className="mr-2 h-4 w-4" />
                Set your first goal
              </Button>
              <Button variant="outline" onClick={onCreate} className="rounded-xl">
                Explore the editor <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Illustration block */}
          <div className="relative h-40 w-full sm:h-48 sm:w-64 rounded-2xl border border-border bg-card/60 backdrop-blur overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(99,102,241,0.25),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.18),transparent_55%)]" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative">
                <div className="h-20 w-20 rounded-3xl bg-background/80 border border-border shadow-sm grid place-items-center">
                  <Target className="h-9 w-9 text-indigo-600 dark:text-indigo-400" />
                </div>
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 18 }}
                  className="absolute -right-3 -top-3 rounded-full border border-border bg-background/80 p-1.5 shadow-sm"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}