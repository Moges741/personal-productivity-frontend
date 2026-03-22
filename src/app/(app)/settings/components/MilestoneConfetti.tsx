"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  onComplete: () => void;
}

export function MilestoneConfetti({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#6366f1", "#8b5cf6", "#f59e0b", "#10b981", "#f97316", "#3b82f6"][
      Math.floor(Math.random() * 6)
    ],
    size: Math.random() * 8 + 4,
    delay: Math.random() * 1.5,
    duration: Math.random() * 2 + 2,
    rotate: Math.random() * 720 - 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Milestone message */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.1, 1, 0.9] }}
        transition={{ duration: 3, times: [0, 0.2, 0.7, 1] }}
      >
        <div
          className="px-8 py-5 rounded-2xl border backdrop-blur-xl"
          style={{
            background: "rgba(99,102,241,0.2)",
            borderColor: "rgba(99,102,241,0.4)",
          }}
        >
          <p className="text-4xl mb-2">🔥</p>
          <p className="text-xl font-bold text-white">Milestone Reached</p>
          <p className="text-sm text-violet-300 mt-1">You are becoming stronger.</p>
        </div>
      </motion.div>

      {/* Confetti pieces */}
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size * 0.4,
            backgroundColor: piece.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 0],
            rotate: piece.rotate,
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            delay: piece.delay,
            duration: piece.duration,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}