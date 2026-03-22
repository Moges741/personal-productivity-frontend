"use client";

import { motion } from "framer-motion";

interface Props {
  currentStreak: number;
  bestStreak: number;
}

export function StreakFlame({ currentStreak, bestStreak }: Props) {
  // Flame intensity grows with streak
  const intensity = Math.min(currentStreak / 30, 1);
  const flameColor = intensity > 0.7
    ? ["#f97316", "#ef4444"]
    : intensity > 0.4
    ? ["#f59e0b", "#f97316"]
    : ["#fbbf24", "#f59e0b"];

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-medium">
        Streak Fire
      </p>

      {/* Flame SVG */}
      <div className="relative w-32 h-44 flex items-end justify-center">

        {/* Glow base */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-10 rounded-full blur-xl"
          style={{ background: `${flameColor[0]}60` }}
          animate={{ scaleX: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        <svg viewBox="0 0 60 80" width="80" height="110" className="relative z-10">
          <defs>
            <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={flameColor[0]} />
              <stop offset="100%" stopColor={flameColor[1]} stopOpacity="0.4" />
            </linearGradient>
            <filter id="flameBlur">
              <feGaussianBlur stdDeviation="1" />
            </filter>
          </defs>

          {/* Outer flame */}
          <motion.path
            d="M30 75 C10 65 5 50 15 35 C20 25 18 15 22 8 C25 18 28 20 26 30 C32 22 35 12 33 2 C42 12 50 25 45 40 C50 30 52 20 50 12 C56 25 58 45 50 60 C45 70 35 75 30 75Z"
            fill="url(#flameGrad)"
            animate={{
              d: [
                "M30 75 C10 65 5 50 15 35 C20 25 18 15 22 8 C25 18 28 20 26 30 C32 22 35 12 33 2 C42 12 50 25 45 40 C50 30 52 20 50 12 C56 25 58 45 50 60 C45 70 35 75 30 75Z",
                "M30 75 C8 63 6 48 16 33 C21 23 17 13 21 6 C24 17 29 21 25 31 C33 21 36 11 34 1 C43 11 51 24 46 39 C51 29 53 19 51 11 C57 24 59 46 51 61 C46 71 36 75 30 75Z",
                "M30 75 C10 65 5 50 15 35 C20 25 18 15 22 8 C25 18 28 20 26 30 C32 22 35 12 33 2 C42 12 50 25 45 40 C50 30 52 20 50 12 C56 25 58 45 50 60 C45 70 35 75 30 75Z",
              ],
            }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Inner bright core */}
          <motion.path
            d="M30 72 C20 65 16 55 22 42 C25 35 24 28 27 22 C29 30 31 32 30 40 C34 33 36 25 35 18 C41 28 44 42 40 54 C43 46 44 38 43 32 C47 42 47 56 42 65 C38 70 33 72 30 72Z"
            fill={flameColor[1]}
            opacity={0.6}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scaleX: [1, 0.9, 1],
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{ transformOrigin: "30px 72px" }}
          />
        </svg>

        {/* Streak number floating in flame */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-20"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span
            className="text-3xl font-black tabular-nums"
            style={{
              color: "white",
              textShadow: `0 0 20px ${flameColor[0]}`,
            }}
          >
            {currentStreak}
          </span>
        </motion.div>
      </div>

      {/* Labels */}
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-white">
          {currentStreak === 0
            ? "Light the flame"
            : currentStreak === 1
            ? "Spark ignited"
            : `${currentStreak} days burning`}
        </p>
        <p className="text-xs text-slate-500">
          Best: {bestStreak} days
        </p>
      </div>
    </div>
  );
}