"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/api/calendar-events";

const tone = {
  default: {
    bg: "bg-indigo-600/10 dark:bg-indigo-500/12",
    border: "border-indigo-600/20 dark:border-indigo-400/20",
    text: "text-indigo-700 dark:text-indigo-300",
    dot: "bg-indigo-500",
  },
  rose: {
    bg: "bg-rose-600/10 dark:bg-rose-500/12",
    border: "border-rose-600/20 dark:border-rose-400/20",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  emerald: {
    bg: "bg-emerald-600/10 dark:bg-emerald-500/12",
    border: "border-emerald-600/20 dark:border-emerald-400/20",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  amber: {
    bg: "bg-amber-600/12 dark:bg-amber-500/12",
    border: "border-amber-600/20 dark:border-amber-400/20",
    text: "text-amber-800 dark:text-amber-300",
    dot: "bg-amber-500",
  },
};

function resolveTone(color?: string | null) {
  // accept named palette keys or fallback
  if (!color) return tone.default;
  const c = color.toLowerCase();
  if (c.includes("rose") || c.includes("pink")) return tone.rose;
  if (c.includes("green") || c.includes("emerald")) return tone.emerald;
  if (c.includes("amber") || c.includes("yellow") || c.includes("orange")) return tone.amber;
  return tone.default;
}

export function EventBlock({
  event,
  variant = "pill",
  onOpen,
}: {
  event: CalendarEvent;
  variant?: "pill" | "block";
  onOpen: () => void;
}) {
  const t = resolveTone(event.color);
  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime);

  const timeLabel = event.isAllDay ? "All day" : `${format(start, "p")}–${format(end, "p")}`;

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onOpen}
      className={cn(
        "w-full text-left rounded-xl border px-3 py-2 transition-all shadow-sm hover:shadow-md",
        t.bg,
        t.border,
        variant === "pill" ? "py-1.5 px-2 rounded-lg" : "rounded-2xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      aria-label={`Open event ${event.title}`}
    >
      <div className="flex items-start gap-2">
        <span className={cn("mt-1 h-2 w-2 rounded-full", t.dot)} aria-hidden />
        <div className="min-w-0 flex-1">
          <div className={cn("text-xs font-semibold tracking-tight truncate", t.text)}>
            {event.title}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="tabular-nums">{timeLabel}</span>
            {event.location && (
              <span className="inline-flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{event.location}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}