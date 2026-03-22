'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvolutionStats } from '@/hooks/useEvolutionData';
import { ProgressForge } from './ProgressForge';
import { EvolvingAvatar } from './EvolvingAvatar';
import { GrowthSpiral } from './GrowthSpiral';
import { DailyStrengthPulse } from './DailyStrengthPulse';
import { MotivationalEcho } from './MotivationalEcho';
import { StreakFlame } from './StreakFlame';
import { MilestoneConfetti } from './MilestoneConfetti';
import { ParticleField } from './ParticleField';
import { EmptyEvolutionState } from './EmptyEvolutionState';

export function SettingsShell() {
  const { isLoading, isError, stats } = useEvolutionStats();
  const [showConfetti, setShowConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (stats?.milestoneJustHit) {
      const t = setTimeout(() => setShowConfetti(true), 1800);
      return () => clearTimeout(t);
    }
  }, [stats?.milestoneJustHit]);

  if (!mounted) return null;

  // ── Loading state ─────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <motion.div
            className="relative w-24 h-24"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-violet-500" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              ✦
            </div>
          </motion.div>
          <motion.p
            className="text-sm text-slate-400 tracking-widest uppercase"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading your evolution...
          </motion.p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-6">
          <p className="text-4xl">⚡</p>
          <h2 className="text-xl font-semibold text-slate-200">
            Could not reach your data
          </h2>
          <p className="text-slate-500 text-sm">
            Make sure your backend is running on{' '}
            <code className="text-violet-400 bg-violet-400/10 px-1 rounded">
              http://localhost:3001
            </code>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ── Empty state — brand new user with zero activity ───────
  const hasActivity =
    stats!.totalTasksCompleted > 0 ||
    stats!.currentStreak > 0 ||
    stats!.goalsCompleted > 0;

  if (!hasActivity) {
    return <EmptyEvolutionState name={stats!.name} />;
  }

  // ── Milestone data for spiral ─────────────────────────────
  const milestones = [
    { day: 1,   label: 'First step',    achieved: stats!.joinedDaysAgo >= 1  },
    { day: 7,   label: 'One week',      achieved: stats!.joinedDaysAgo >= 7  },
    { day: 14,  label: 'Two weeks',     achieved: stats!.joinedDaysAgo >= 14 },
    { day: 21,  label: 'Habit formed',  achieved: stats!.joinedDaysAgo >= 21 },
    {
      day: stats!.joinedDaysAgo,
      label: 'Today',
      achieved: true,
      isNow: true,
    },
    { day: 90,  label: '3 months',      achieved: stats!.joinedDaysAgo >= 90  },
    { day: 180, label: 'Transformed',   achieved: stats!.joinedDaysAgo >= 180 },
    { day: 365, label: 'A new you',     achieved: stats!.joinedDaysAgo >= 365 },
  ].filter(
    // Deduplicate if joinedDaysAgo matches a fixed milestone
    (m, i, arr) =>
      arr.findIndex((x) => x.day === m.day) === i
  );

  const completionRate = Math.round(stats!.todayProgress * 100);

  // ── Full render ───────────────────────────────────────────
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Ambient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl"
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-500/8 blur-3xl"
          animate={{ x: [0, -25, 15, 0], y: [0, 20, -25, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
        <motion.div
          className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full bg-amber-500/6 blur-3xl"
          animate={{ x: [0, 20, -10, 0], y: [0, -15, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
        />
        <ParticleField count={40} />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-20">

        {/* Hero */}
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="text-xs uppercase tracking-[0.3em] text-violet-400/70 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Day {stats!.joinedDaysAgo} of Your Evolution
          </motion.p>

          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="bg-gradient-to-r from-white via-violet-200 to-indigo-300 bg-clip-text text-transparent">
              {stats!.name},
            </span>
            <br />
            <span className="text-slate-400 text-4xl md:text-5xl font-light italic">
              you are becoming.
            </span>
          </motion.h1>

          <MotivationalEcho
            progress={stats!.todayProgress}
            streak={stats!.currentStreak}
          />
        </motion.div>

        {/* Central trinity */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <EvolvingAvatar
              level={stats!.level}
              streak={stats!.currentStreak}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProgressForge
              todayProgress={stats!.todayProgress}
              level={stats!.level}
              completionRate={completionRate}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <StreakFlame
              currentStreak={stats!.currentStreak}
              bestStreak={stats!.bestStreak}
            />
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <DailyStrengthPulse
            weeklyProgress={stats!.weeklyProgress}
            tasksCompleted={stats!.totalTasksCompleted}
            habitsCompleted={stats!.totalHabitsCompleted}
            goalsInProgress={stats!.goalsInProgress}
            goalsCompleted={stats!.goalsCompleted}
            notesCreated={stats!.notesCreated}
          />
        </motion.div>

        {/* Growth spiral */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <GrowthSpiral
            joinedDaysAgo={stats!.joinedDaysAgo}
            level={stats!.level}
            milestones={milestones}
          />
        </motion.div>

        {/* Live habits breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          <HabitsBreakdown habits={stats!.habits} />
        </motion.div>

        {/* Live goals breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <GoalsBreakdown goals={stats!.goals} />
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center pb-20 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-violet-500/40 to-transparent mx-auto" />
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-medium">
            Evolve · Every day, a stronger you
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showConfetti && (
          <MilestoneConfetti onComplete={() => setShowConfetti(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Inline sub-components (small enough to stay here) ────────

function HabitsBreakdown({ habits }: { habits: import('@/hooks/useEvolutionData').Habit[] }) {
  if (habits.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-medium">
          Your Active Habits
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit, i) => (
          <motion.div
            key={habit.id}
            className="rounded-2xl p-5 border space-y-3"
            style={{
              background: `${habit.color}10`,
              borderColor: `${habit.color}25`,
              backdropFilter: 'blur(10px)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 + i * 0.08 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{habit.icon ?? '✦'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-200 truncate">
                  {habit.name}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {habit.frequency} · {habit.category}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p
                  className="text-2xl font-black"
                  style={{ color: habit.color }}
                >
                  {habit.currentStreak}
                </p>
                <p className="text-xs text-slate-500">streak</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-400">
                  {habit.bestStreak}
                </p>
                <p className="text-xs text-slate-500">best</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">
                  {habit.lastCompletedAt
                    ? new Date(habit.lastCompletedAt).toLocaleDateString(
                        undefined,
                        { month: 'short', day: 'numeric' }
                      )
                    : 'Not yet'}
                </p>
                <p className="text-xs text-slate-600">last done</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GoalsBreakdown({ goals }: { goals: import('@/hooks/useEvolutionData').Goal[] }) {
  if (goals.length === 0) return null;

  const statusColor = {
    not_started: '#6b7280',
    in_progress:  '#6366f1',
    completed:    '#10b981',
    abandoned:    '#ef4444',
  };

  const statusLabel = {
    not_started: 'Not Started',
    in_progress:  'In Progress',
    completed:    'Completed',
    abandoned:    'Abandoned',
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-medium">
          Your Goals
        </p>
      </div>
      <div className="space-y-3">
        {goals.map((goal, i) => {
          const color = statusColor[goal.status];
          return (
            <motion.div
              key={goal.id}
              className="rounded-2xl p-5 border"
              style={{
                background: `${color}08`,
                borderColor: `${color}20`,
                backdropFilter: 'blur(10px)',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + i * 0.08 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: `${color}20`,
                        color,
                      }}
                    >
                      {statusLabel[goal.status]}
                    </span>
                    <span className="text-xs text-slate-500 capitalize">
                      {goal.category}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-200">{goal.title}</p>
                  {goal.targetDate && (
                    <p className="text-xs text-slate-500">
                      Target:{' '}
                      {new Date(goal.targetDate).toLocaleDateString(undefined, {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                {/* Progress ring */}
                <div className="flex-shrink-0 relative w-14 h-14">
                  <svg viewBox="0 0 48 48" className="-rotate-90" width="56" height="56">
                    <circle
                      cx="24" cy="24" r="20"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="24" cy="24" r="20"
                      fill="none"
                      stroke={color}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 20}
                      initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                      animate={{
                        strokeDashoffset:
                          2 * Math.PI * 20 * (1 - goal.progressPercentage / 100),
                      }}
                      transition={{ delay: 1.5 + i * 0.1, duration: 1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold" style={{ color }}>
                      {goal.progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}