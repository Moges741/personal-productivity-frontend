"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Flag, Pin, Sparkle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Goal, GoalCategory, GoalPriority, GoalStatus } from "@/lib/api/goals";
import { ProgressRing } from "@/components/goals/progress-ring";
import { Badge } from "@/components/ui/badge";

const washes: Record<GoalCategory, { wash: string; accent: string }> = {
  personal: { wash: "from-rose-200/60 via-white to-amber-100/60 dark:from-rose-900/30 dark:via-slate-950/20 dark:to-amber-900/20", accent: "text-rose-700 dark:text-rose-400" },
  career: { wash: "from-indigo-200/60 via-white to-fuchsia-100/50 dark:from-indigo-900/35 dark:via-slate-950/20 dark:to-fuchsia-900/20", accent: "text-indigo-700 dark:text-indigo-400" },
  health: { wash: "from-emerald-200/55 via-white to-cyan-100/55 dark:from-emerald-900/30 dark:via-slate-950/20 dark:to-cyan-900/18", accent: "text-emerald-700 dark:text-emerald-400" },
  finance: { wash: "from-amber-200/60 via-white to-rose-100/50 dark:from-amber-900/30 dark:via-slate-950/20 dark:to-rose-900/18", accent: "text-amber-700 dark:text-amber-400" },
  learning: { wash: "from-violet-200/60 via-white to-sky-100/55 dark:from-violet-900/30 dark:via-slate-950/20 dark:to-sky-900/18", accent: "text-violet-700 dark:text-violet-400" },
  other: { wash: "from-slate-200/60 via-white to-slate-100/60 dark:from-slate-900/35 dark:via-slate-950/20 dark:to-slate-900/25", accent: "text-indigo-700 dark:text-indigo-400" },
};

const statusLabel: Record<GoalStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
  abandoned: "Abandoned",
};

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function GoalCard({ goal, onOpen }: { goal: Goal; onOpen: () => void }) {
  const theme = washes[goal.category ?? "other"];

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative w-full text-left overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      aria-label={`Open goal ${goal.title}`}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", theme.wash)} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.78),transparent_45%)] dark:bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.08),transparent_45%)]" />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full bg-background/70">
                {cap(goal.category)}
              </Badge>

              <Badge variant="secondary" className="rounded-full bg-background/70">
                {statusLabel[goal.status]}
              </Badge>

              {goal.isPinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1 text-[10px] font-semibold">
                  <Pin className="h-3 w-3" /> pinned
                </span>
              )}
            </div>

            <h3 className="mt-3 text-lg font-semibold tracking-tight line-clamp-2">
              {goal.title}
            </h3>

            {goal.description && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {goal.description}
              </p>
            )}
          </div>

          <div className="shrink-0">
            <ProgressRing value={goal.progressPercentage ?? 0} size={58} stroke={7} accentClassName={theme.accent} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Flag className="h-3.5 w-3.5" />
              {goal.targetDate ? format(new Date(goal.targetDate), "MMM d, yyyy") : "No target"}
            </span>
          </div>

          <PriorityBadge priority={goal.priority} accentClassName={theme.accent} />
        </div>
      </div>
    </motion.button>
  );
}

function PriorityBadge({ priority, accentClassName }: { priority: GoalPriority; accentClassName: string }) {
  const stars = priority === "high" ? 3 : priority === "medium" ? 2 : 1;
  return (
    <div className={cn("inline-flex items-center gap-1", accentClassName)} aria-label={`Priority ${priority}`}>
      {[1, 2, 3].map((i) => (
        <Star key={i} className={cn("h-4 w-4", i <= stars ? "fill-current" : "opacity-25")} />
      ))}
    </div>
  );
}