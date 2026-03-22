"use client";

import { motion } from "framer-motion";

interface Props {
  level: number;
  streak: number;
}

// Each level = more branches, richer color, deeper glow
const levelConfig = {
  1: { branches: 2, color: "#6366f1", glow: "#6366f130", label: "Seedling" },
  2: { branches: 3, color: "#8b5cf6", glow: "#8b5cf640", label: "Sapling" },
  3: { branches: 4, color: "#7c3aed", glow: "#7c3aed50", label: "Growing" },
  4: { branches: 5, color: "#f59e0b", glow: "#f59e0b40", label: "Flourishing" },
  5: { branches: 6, color: "#f97316", glow: "#f9731650", label: "Ancient" },
};

export function EvolvingAvatar({ level, streak }: Props) {
  const config = levelConfig[Math.min(level, 5) as keyof typeof levelConfig];
  const branchAngles = Array.from({ length: config.branches }, (_, i) =>
    (i * 360) / config.branches
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-medium">
        Your Tree of Growth
      </p>

      {/* Tree container */}
      <div className="relative w-40 h-40 flex items-center justify-center">

        {/* Glow behind tree */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ background: config.glow }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glass circle background */}
        <div
          className="absolute inset-0 rounded-full border"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: `${config.color}30`,
            backdropFilter: "blur(10px)",
          }}
        />

        {/* SVG Tree */}
        <svg viewBox="0 0 100 100" width="100" height="100" className="relative z-10">

          {/* Trunk */}
          <motion.rect
            x="47" y="55" width="6" height="30"
            rx="3"
            fill={config.color}
            initial={{ scaleY: 0, originY: 1 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "50px 85px" }}
          />

          {/* Root spread */}
          <motion.path
            d="M 40 82 Q 30 88 25 85 M 60 82 Q 70 88 75 85"
            stroke={config.color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity={0.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />

          {/* Branches — grow outward */}
          {branchAngles.map((angle, i) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const len = 18 + (i % 2) * 5;
            const x2 = 50 + Math.cos(rad) * len;
            const y2 = 50 + Math.sin(rad) * len;
            return (
              <motion.line
                key={i}
                x1="50" y1="55"
                x2={x2} y2={y2}
                stroke={config.color}
                strokeWidth="2"
                strokeLinecap="round"
                opacity={0.8}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{
                  delay: 0.3 + i * 0.15,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            );
          })}

          {/* Leaf clusters at branch tips */}
          {branchAngles.map((angle, i) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const len = 18 + (i % 2) * 5;
            const cx = 50 + Math.cos(rad) * len;
            const cy = 50 + Math.sin(rad) * len;
            return (
              <motion.circle
                key={`leaf-${i}`}
                cx={cx} cy={cy} r={5}
                fill={config.color}
                opacity={0.6}
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  opacity: [0, 0.8, 0.6],
                }}
                transition={{
                  delay: 0.6 + i * 0.15,
                  duration: 0.6,
                }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
            );
          })}

          {/* Center glow dot */}
          <motion.circle
            cx="50" cy="55" r="4"
            fill={config.color}
            animate={{
              r: [4, 5.5, 4],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </div>

      {/* Level label */}
      <div className="text-center space-y-1">
        <motion.p
          className="text-sm font-semibold"
          style={{ color: config.color }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {config.label}
        </motion.p>
        <p className="text-xs text-slate-500">
          {streak > 0 ? `${streak} day streak` : "Plant your first seed"}
        </p>
      </div>
    </div>
  );
}