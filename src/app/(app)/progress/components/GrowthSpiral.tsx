"use client";

import { motion } from "framer-motion";
import { Check, Star, MapPin } from "lucide-react";

interface Milestone {
  day: number;
  label: string;
  achieved: boolean;
  isNow?: boolean;
}

interface Props {
  joinedDaysAgo: number;
  level: number;
  milestones: Milestone[];
}

export function GrowthSpiral({ joinedDaysAgo, level, milestones }: Props) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-medium">
          Your Path
        </p>
        <p className="text-sm text-slate-500">
          {joinedDaysAgo} days of intentional living
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">

        {/* Connecting line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-px">
          <div className="h-full bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent" />
        </div>

        <div className="space-y-6">
          {milestones.map((milestone, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={milestone.day}
                className={`flex items-center gap-4 ${
                  isLeft ? "flex-row" : "flex-row-reverse"
                }`}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 1.2 + i * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Content card */}
                <div className={`flex-1 ${isLeft ? "text-right" : "text-left"}`}>
                  <motion.div
                    className="inline-block rounded-xl px-4 py-3 border"
                    style={{
                      background: milestone.isNow
                        ? "rgba(99,102,241,0.15)"
                        : milestone.achieved
                        ? "rgba(16,185,129,0.08)"
                        : "rgba(255,255,255,0.02)",
                      borderColor: milestone.isNow
                        ? "rgba(99,102,241,0.4)"
                        : milestone.achieved
                        ? "rgba(16,185,129,0.2)"
                        : "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(10px)",
                    }}
                    whileHover={milestone.achieved ? { scale: 1.02 } : {}}
                  >
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: milestone.isNow
                          ? "#818cf8"
                          : milestone.achieved
                          ? "#34d399"
                          : "#4b5563",
                      }}
                    >
                      Day {milestone.day}
                    </p>
                    <p
                      className="text-sm font-semibold mt-0.5"
                      style={{
                        color: milestone.isNow
                          ? "#c7d2fe"
                          : milestone.achieved
                          ? "#a7f3d0"
                          : "#374151",
                      }}
                    >
                      {milestone.label}
                    </p>
                  </motion.div>
                </div>

                {/* Center node */}
                <div className="relative z-10 flex-shrink-0">
                  <motion.div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                    style={{
                      background: milestone.isNow
                        ? "#6366f1"
                        : milestone.achieved
                        ? "#10b981"
                        : "rgba(15,23,42,0.8)",
                      borderColor: milestone.isNow
                        ? "#818cf8"
                        : milestone.achieved
                        ? "#34d399"
                        : "#374151",
                      boxShadow: milestone.isNow
                        ? "0 0 20px #6366f180"
                        : milestone.achieved
                        ? "0 0 10px #10b98140"
                        : "none",
                    }}
                    animate={
                      milestone.isNow
                        ? {
                            boxShadow: [
                              "0 0 10px #6366f160",
                              "0 0 25px #6366f190",
                              "0 0 10px #6366f160",
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {milestone.isNow ? (
                      <MapPin size={14} className="text-white" />
                    ) : milestone.achieved ? (
                      <Check size={14} className="text-white" />
                    ) : (
                      <Star size={12} className="text-slate-600" />
                    )}
                  </motion.div>
                </div>

                {/* Spacer for opposite side */}
                <div className="flex-1" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}