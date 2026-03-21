"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressRing({
  value,
  size = 64,
  stroke = 8,
  accentClassName = "text-indigo-700 dark:text-indigo-400",
}: {
  value: number;
  size?: number;
  stroke?: number;
  accentClassName?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeWidth={stroke} fill="transparent" className="text-muted/25" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          strokeLinecap="round"
          className={cn(accentClassName)}
          style={{ strokeDasharray: c, strokeDashoffset: offset }}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
        />
      </svg>
      <div className="absolute text-xs font-semibold tabular-nums text-foreground">{clamped}%</div>
    </div>
  );
}