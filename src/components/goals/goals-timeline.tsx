"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Flag, Pin } from "lucide-react";
import type { Goal } from "@/lib/api/goals";
import { cn } from "@/lib/utils";
import { ProgressRing } from "@/components/goals/progress-ring";
import { Badge } from "@/components/ui/badge";

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const statusLabel: Record<Goal["status"], string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
  abandoned: "Abandoned",
};

export function GoalsTimeline({ goals, onOpenGoal }: { goals: Goal[]; onOpenGoal: (g: Goal) => void }) {
  // sort by targetDate (soonest first), pinned first
  const sorted = [...goals].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;

    const ad = a.targetDate ? new Date(a.targetDate).getTime() : Number.POSITIVE_INFINITY;
    const bd = b.targetDate ? new Date(b.targetDate).getTime() : Number.POSITIVE_INFINITY;
    if (ad !== bd) return ad - bd;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="relative">
      {/* timeline spine */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-4">
        {sorted.map((g, idx) => (
          <motion.button
            key={g.id}
            type="button"
            onClick={() => onOpenGoal(g)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.4, ease: "easeOut" }}
            className={cn(
              "relative w-full text-left rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label={`Open goal ${g.title}`}
          >
            {/* node */}
            <div className="absolute left-4 top-6 h-3 w-3 -translate-x-1/2 rounded-full bg-background border border-border shadow-sm" />

            <div className="p-5 pl-10">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="rounded-full">
                      {cap(g.category)}
                    </Badge>
                    <Badge variant="secondary" className="rounded-full">
                      {statusLabel[g.status]}
                    </Badge>
                    {g.isPinned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] font-semibold">
                        <Pin className="h-3 w-3" /> pinned
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 text-lg font-semibold tracking-tight line-clamp-2">
                    {g.title}
                  </h3>

                  {g.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {g.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {g.startDate ? format(new Date(g.startDate), "MMM d, yyyy") : "No start"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Flag className="h-3.5 w-3.5" />
                      {g.targetDate ? format(new Date(g.targetDate), "MMM d, yyyy") : "No target"}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <ProgressRing value={g.progressPercentage ?? 0} size={64} stroke={8} />
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}