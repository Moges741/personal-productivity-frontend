"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Flame,
  Target,
  CalendarDays,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useHabits, useTasks, useGoals } from "@/hooks/useEvolutionData";

// ── Greeting helper ───────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ── Skeleton card ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/40 bg-muted/30 p-5 animate-pulse space-y-3">
      <div className="w-9 h-9 rounded-xl bg-muted" />
      <div className="w-16 h-7 rounded-lg bg-muted" />
      <div className="w-24 h-3 rounded bg-muted" />
      <div className="w-20 h-3 rounded bg-muted" />
    </div>
  );
}

// ── Animation variants ────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const headAnim = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ── Main component ────────────────────────────────────────────
export default function DashboardPage() {
  const user        = useAuthStore((s) => s.user);
  const habitsQuery = useHabits();
  const tasksQuery  = useTasks();
  const goalsQuery  = useGoals();

  const isLoading =
    habitsQuery.isLoading ||
    tasksQuery.isLoading  ||
    goalsQuery.isLoading;

  // ── Compute real stats from API data ────────────────────────
  const stats = useMemo(() => {
    const habits = habitsQuery.data ?? [];
    const tasks  = tasksQuery.data  ?? [];
    const goals  = goalsQuery.data  ?? [];
    const now    = new Date();

    // Active habits (not deleted, not archived)
    const activeHabits = habits.filter((h) => !h.isDeleted && !h.isArchived);

    // Best current streak across all habits
    const bestStreak =
      activeHabits.length > 0
        ? Math.max(...activeHabits.map((h) => h.currentStreak))
        : 0;

    // Tasks due today
    const todayTasks = tasks.filter((t) => {
      if (!t.dueDate) return false;
      return new Date(t.dueDate).toDateString() === now.toDateString();
    });
    const todayDone      = todayTasks.filter((t) => t.status === "done").length;
    const todayRemaining = todayTasks.length - todayDone;

    // Tasks in progress right now
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;

    // Goals
    const activeGoals    = goals.filter((g) => g.status === "in_progress");
    const completedGoals = goals.filter((g) => g.status === "completed").length;

    // Average progress across active goals
    const avgGoalProgress =
      activeGoals.length > 0
        ? Math.round(
            activeGoals.reduce((sum, g) => sum + g.progressPercentage, 0) /
              activeGoals.length
          )
        : 0;

    // Upcoming goals with a target date
    const nextDeadline = activeGoals
      .filter((g) => g.targetDate)
      .sort(
        (a, b) =>
          new Date(a.targetDate!).getTime() -
          new Date(b.targetDate!).getTime()
      )[0];

    const daysToDeadline = nextDeadline?.targetDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(nextDeadline.targetDate).getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : null;

    // Habits completed today
    const habitsToday = activeHabits.filter((h) => {
      if (!h.lastCompletedAt) return false;
      return new Date(h.lastCompletedAt).toDateString() === now.toDateString();
    }).length;

    return {
      // Tasks card
      todayTasksTotal:   todayTasks.length,
      todayDone,
      todayRemaining,
      inProgress,

      // Habits card
      bestStreak,
      habitsToday,
      totalActiveHabits: activeHabits.length,

      // Goals card
      activeGoals:    activeGoals.length,
      completedGoals,
      avgGoalProgress,
      nextGoalTitle:  nextDeadline?.title ?? null,
      daysToDeadline,

      // Overall
      totalTasks: tasks.length,
      totalGoals: goals.length,
    };
  }, [habitsQuery.data, tasksQuery.data, goalsQuery.data]);

  const firstName = user?.name
    ? user.name.trim().split(" ")[0]
    : "there";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month:   "long",
    day:     "numeric",
  });

  // shorthand for tasks array in card 4 sub line
  const tasks = tasksQuery.data ?? [];

  // ── Card definitions (built from real stats) ─────────────────
  const cards = [
    {
      title:    "Tasks Today",
      value:    isLoading ? "—" : String(stats.todayTasksTotal),
      sub:      isLoading
        ? "Loading..."
        : stats.todayRemaining > 0
        ? `${stats.todayRemaining} remaining · ${stats.inProgress} in progress`
        : stats.todayTasksTotal > 0
        ? "All done for today 🎉"
        : "No tasks due today",
      icon:     CheckSquare,
      color:    "#6366f1",
      gradient: "from-violet-500/15 to-violet-600/5",
      border:   "rgba(99,102,241,0.2)",
      glow:     "rgba(99,102,241,0.10)",
      badge:    stats.todayDone > 0 && !isLoading
        ? `${stats.todayDone} done`
        : null,
      badgeColor: "#6366f1",
    },
    {
      title:    "Habit Streak",
      value:    isLoading ? "—" : `${stats.bestStreak}`,
      sub:      isLoading
        ? "Loading..."
        : stats.habitsToday > 0
        ? `${stats.habitsToday} of ${stats.totalActiveHabits} done today`
        : stats.totalActiveHabits > 0
        ? `${stats.totalActiveHabits} active habits`
        : "No habits yet",
      icon:     Flame,
      color:    "#f97316",
      gradient: "from-orange-500/15 to-orange-600/5",
      border:   "rgba(249,115,22,0.2)",
      glow:     "rgba(249,115,22,0.10)",
      badge:    stats.bestStreak > 0 && !isLoading ? "days" : null,
      badgeColor: "#f97316",
    },
    {
      title:    "Goals Progress",
      value:    isLoading ? "—" : `${stats.avgGoalProgress}%`,
      sub:      isLoading
        ? "Loading..."
        : stats.daysToDeadline !== null
        ? `"${stats.nextGoalTitle}" · ${stats.daysToDeadline}d left`
        : stats.activeGoals > 0
        ? `${stats.activeGoals} active · ${stats.completedGoals} completed`
        : "No active goals",
      icon:     Target,
      color:    "#10b981",
      gradient: "from-emerald-500/15 to-emerald-600/5",
      border:   "rgba(16,185,129,0.2)",
      glow:     "rgba(16,185,129,0.10)",
      badge:    stats.activeGoals > 0 && !isLoading
        ? `${stats.activeGoals} active`
        : null,
      badgeColor: "#10b981",
    },
    {
      title:    "Overall Tasks",
      value:    isLoading ? "—" : String(stats.totalTasks),
      sub:      isLoading
        ? "Loading..."
        : `${stats.inProgress} in progress · ${
            tasks?.filter?.((t) => t.status === "done").length ?? 0
          } completed`,
      icon:     TrendingUp,
      color:    "#3b82f6",
      gradient: "from-blue-500/15 to-blue-600/5",
      border:   "rgba(59,130,246,0.2)",
      glow:     "rgba(59,130,246,0.10)",
      badge:    null,
      badgeColor: "#3b82f6",
    },
  ];

  return (
    <section className="space-y-8 px-1">

      {/* ── Header ─────────────────────────────────────────── */}
      <motion.div
        variants={headAnim}
        initial="hidden"
        animate="show"
        className="space-y-1"
      >
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
          {today}
        </p>

        <h1
          className="text-3xl md:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {getGreeting()},{" "}
          <span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            {firstName}.
          </span>
        </h1>

        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          {isLoading
            ? "Loading your progress..."
            : stats.todayRemaining > 0
            ? `You have ${stats.todayRemaining} task${
                stats.todayRemaining > 1 ? "s" : ""
              } left today. Keep pushing.`
            : stats.bestStreak > 0
            ? `${stats.bestStreak}-day streak. Consistency is your superpower.`
            : "Every action today builds a stronger you. Let's go."}
        </p>
      </motion.div>

      {/* ── Stat cards ─────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              whileHover={{
                scale: 1.025,
                y: -4,
                transition: { type: "spring", stiffness: 340, damping: 22 },
              }}
              className={`
                relative rounded-2xl p-5 border overflow-hidden
                bg-gradient-to-br ${card.gradient}
                backdrop-blur-sm cursor-default
              `}
              style={{
                borderColor: card.border,
                boxShadow: `0 4px 24px ${card.glow}`,
              }}
            >
              {/* Corner glow */}
              <div
                className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl pointer-events-none"
                style={{ background: card.glow }}
              />

              {/* Icon row */}
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${card.color}20` }}
                >
                  <card.icon size={20} style={{ color: card.color }} strokeWidth={2} />
                </div>

                {/* Badge */}
                {card.badge && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${card.badgeColor}18`,
                      color: card.badgeColor,
                      border: `1px solid ${card.badgeColor}30`,
                    }}
                  >
                    {card.badge}
                  </span>
                )}
              </div>

              {/* Value */}
              <p
                className="relative z-10 text-3xl font-black tracking-tight leading-none tabular-nums"
                style={{ color: card.color }}
              >
                {card.value}
              </p>

              {/* Title */}
              <p className="relative z-10 mt-1.5 text-sm font-semibold text-foreground">
                {card.title}
              </p>

              {/* Sub */}
              <p className="relative z-10 mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {card.sub}
              </p>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
                style={{
                  background: `linear-gradient(90deg, transparent, ${card.color}80, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Quick context row ───────────────────────────────── */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          className="flex flex-wrap gap-3"
        >
          {[
            {
              icon: Clock,
              label: `${stats.inProgress} task${stats.inProgress !== 1 ? "s" : ""} in progress`,
              color: "#6366f1",
            },
            {
              icon: Flame,
              label: `Best streak: ${stats.bestStreak} days`,
              color: "#f97316",
            },
            {
              icon: CalendarDays,
              label: `${stats.totalGoals} total goals`,
              color: "#10b981",
            },
          ].map((chip) => (
            <div
              key={chip.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
              style={{
                background: `${chip.color}08`,
                borderColor: `${chip.color}25`,
                color: chip.color,
              }}
            >
              <chip.icon size={12} />
              {chip.label}
            </div>
          ))}
        </motion.div>
      )}
    </section>
  );
}