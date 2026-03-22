'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface Props {
  name: string;
}

export function EmptyEvolutionState({ name }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg space-y-10">

        {/* Animated seed */}
        <motion.div
          className="mx-auto w-32 h-32 relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-violet-500/10 blur-xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <svg viewBox="0 0 80 80" width="80" height="80">
            {/* Single seed/sprout */}
            <motion.ellipse
              cx="40" cy="65" rx="8" ry="5"
              fill="#6366f1" opacity={0.3}
              animate={{ rx: [8, 10, 8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.line
              x1="40" y1="60" x2="40" y2="30"
              stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 1.2 }}
            />
            <motion.path
              d="M40 42 Q 30 35 28 25 Q 38 26 40 35"
              fill="#6366f1" opacity={0.7}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
            <motion.path
              d="M40 38 Q 50 31 52 21 Q 42 22 40 31"
              fill="#8b5cf6" opacity={0.7}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ delay: 1.3, duration: 0.8 }}
            />
          </svg>
        </motion.div>

        {/* Headline */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {name}, your seed is planted.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Every great forest begins with one seed.
            Complete your first habit, task, or goal —
            and watch your evolution begin.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {[
            { href: '/habits', label: '🔥 Start a Habit', primary: true },
            { href: '/goals',  label: '🎯 Set a Goal',    primary: false },
            { href: '/tasks',  label: '✅ Add a Task',    primary: false },
          ].map((btn) => (
            <Link
              key={btn.href}
              href={btn.href}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                btn.primary
                  ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                  : 'border border-slate-700 hover:border-violet-500/50 text-slate-300 hover:text-white'
              }`}
            >
              {btn.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}