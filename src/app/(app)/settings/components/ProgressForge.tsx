"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Props {
  todayProgress: number; // 0–1
  level: number;
  completionRate: number;
}

export function ProgressForge({ todayProgress, level, completionRate }: Props) {
  const size = 220;
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, { stiffness: 40, damping: 20 });
  const strokeDashoffset = useTransform(
    smoothProgress,
    [0, 1],
    [circumference, 0]
  );

  useEffect(() => {
    const timer = setTimeout(() => rawProgress.set(todayProgress), 500);
    return () => clearTimeout(timer);
  }, [todayProgress, rawProgress]);

  const levelColors: Record<number, string[]> = {
    1: ["#6366f1", "#818cf8"],
    2: ["#8b5cf6", "#a78bfa"],
    3: ["#7c3aed", "#c084fc"],
    4: ["#6d28d9", "#f59e0b"],
    5: ["#4c1d95", "#f97316"],
  };

  const colors = levelColors[Math.min(level, 5)] ?? levelColors[1];

  return (
    <div className="flex flex-col items-center gap-6">

      {/* Label */}
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-medium">
        Today's Forge
      </p>

      {/* Ring */}
      <div className="relative" style={{ width: size, height: size }}>

        {/* Glow pulse behind ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors[0]}20 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* SVG Ring */}
        <svg
          width={size}
          height={size}
          className="absolute inset-0 -rotate-90"
          style={{ filter: `drop-shadow(0 0 12px ${colors[0]}60)` }}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />

          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#forgeGradient-${level})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient
              id={`forgeGradient-${level}`}
              x1="0%" y1="0%" x2="100%" y2="0%"
            >
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          {/* Percentage */}
          <motion.span
            className="text-4xl font-bold text-white tabular-nums"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {completionRate}%
          </motion.span>

          <span className="text-xs text-slate-400 font-medium">complete</span>

          {/* Level badge */}
          <motion.div
            className="mt-2 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: `linear-gradient(135deg, ${colors[0]}30, ${colors[1]}20)`,
              border: `1px solid ${colors[0]}40`,
              color: colors[1],
            }}
            animate={{
              boxShadow: [
                `0 0 0px ${colors[0]}00`,
                `0 0 12px ${colors[0]}60`,
                `0 0 0px ${colors[0]}00`,
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            Level {level}
          </motion.div>
        </div>

        {/* Outer rotating accent dots */}
        {[0, 120, 240].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: colors[i % 2],
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
            }}
            animate={{ rotate: [angle, angle + 360] }}
            transition={{
              duration: 12 + i * 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Sublabel */}
      <p className="text-xs text-slate-500 text-center max-w-[160px]">
        {todayProgress >= 1
          ? "🔥 Perfect day. Forged."
          : todayProgress >= 0.7
          ? "Nearly there. Keep going."
          : todayProgress >= 0.4
          ? "Good momentum. Push on."
          : "The forge is warming up."}
      </p>
    </div>
  );
}