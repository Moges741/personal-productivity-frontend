"use client";

import { motion } from "framer-motion";
import {
  CheckSquare, Repeat, Target, FileText,
  TrendingUp, Calendar
} from "lucide-react";

interface Props {
  weeklyProgress: number[];
  tasksCompleted: number;
  habitsCompleted: number;
  goalsInProgress: number;
  goalsCompleted: number;
  notesCreated: number;
}

const days = ["M", "T", "W", "T", "F", "S", "S"];

export function DailyStrengthPulse({
  weeklyProgress,
  tasksCompleted,
  habitsCompleted,
  goalsInProgress,
  goalsCompleted,
  notesCreated,
}: Props) {

  const stats = [
    {
      label: "Tasks Done",
      value: tasksCompleted,
      icon: CheckSquare,
      color: "#6366f1",
      suffix: "",
    },
    {
      label: "Habits Logged",
      value: habitsCompleted,
      icon: Repeat,
      color: "#8b5cf6",
      suffix: "",
    },
    {
      label: "Goals Active",
      value: goalsInProgress,
      icon: Target,
      color: "#f59e0b",
      suffix: "",
    },
    {
      label: "Goals Won",
      value: goalsCompleted,
      icon: TrendingUp,
      color: "#10b981",
      suffix: "",
    },
    {
      label: "Notes Created",
      value: notesCreated,
      icon: FileText,
      color: "#3b82f6",
      suffix: "",
    },
  ];

  return (
    <div className="space-y-10">

      {/* Section header */}
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-medium">
          This Week's Discipline
        </p>
      </div>

      {/* Weekly progress bars */}
      <div
        className="rounded-2xl p-6 border"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-end justify-between gap-3 h-24">
          {weeklyProgress.map((val, i) => {
            const isToday = i === new Date().getDay() - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                {/* Bar */}
                <div className="relative w-full flex items-end justify-center h-16">
                  <div className="w-full rounded-full bg-white/5 absolute bottom-0 h-full" />
                  <motion.div
                    className="w-full rounded-full absolute bottom-0"
                    style={{
                      background: isToday
                        ? "linear-gradient(to top, #6366f1, #a78bfa)"
                        : val >= 1
                        ? "linear-gradient(to top, #10b981, #34d399)"
                        : "linear-gradient(to top, #4b5563, #6b7280)",
                      boxShadow: isToday ? "0 0 12px #6366f180" : "none",
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(val * 100, 4)}%` }}
                    transition={{
                      delay: 0.8 + i * 0.1,
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>

                {/* Day label */}
                <span
                  className={`text-xs font-medium ${
                    isToday ? "text-violet-400" : "text-slate-500"
                  }`}
                >
                  {days[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="rounded-2xl p-5 border text-center space-y-3 group"
            style={{
              background: `${stat.color}08`,
              borderColor: `${stat.color}20`,
              backdropFilter: "blur(10px)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 + i * 0.1, duration: 0.6 }}
            whileHover={{
              scale: 1.04,
              boxShadow: `0 8px 30px ${stat.color}25`,
              borderColor: `${stat.color}50`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto"
              style={{ background: `${stat.color}15` }}
            >
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>

            <motion.span
              className="block text-3xl font-black tabular-nums"
              style={{ color: stat.color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.1 }}
            >
              {stat.value}
            </motion.span>

            <span className="text-xs text-slate-500 font-medium leading-tight block">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}