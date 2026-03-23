"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { ArrowRight, Play, TrendingUp, Zap, Shield } from "lucide-react";

const floatingBadges = [
  { icon: TrendingUp, label: "12 day streak", color: "#10b981", delay: 0.8 },
  { icon: Zap,        label: "Task complete", color: "#6366f1", delay: 1.0 },
  { icon: Shield,     label: "Goal reached",  color: "#f59e0b", delay: 1.2 },
];

export function HeroSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const headlineY  = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const subY       = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const badgesY    = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const bgScale    = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Hero glow spot */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          scale: bgScale,
        }}
      />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow badge */}
        <motion.div variants={item} className="flex justify-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium"
            style={{
              background: isDark
                ? "rgba(99,102,241,0.1)"
                : "rgba(99,102,241,0.06)",
              borderColor: isDark
                ? "rgba(99,102,241,0.3)"
                : "rgba(99,102,241,0.2)",
              color: "#818cf8",
            }}
            whileHover={{ scale: 1.04 }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-violet-400"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            The platform for people who refuse to stay the same
          </motion.div>
        </motion.div>

        {/* Main headline */}
        <motion.div style={{ y: headlineY }} variants={item}>
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span
              className={isDark ? "text-white" : "text-slate-900"}
            >
              Every day,
            </span>
            <br />
            <span className="relative inline-block">
              <span
                className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
              >
                a stronger
              </span>
              {/* Underline accent */}
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
                  boxShadow: "0 0 20px rgba(99,102,241,0.6)",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
              />
            </span>
            <br />
            <span
              className={`font-light italic ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              you.
            </span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          className={`text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
          style={{ y: subY }}
          variants={item}
        >
         <span className="text-[50px]">A</span>ll in <span className="text-[50px]">O</span>ne unifies your notes, tasks, habits, goals, and calendar into
          one intelligent system —{" "}
          <span className={isDark ? "text-slate-200" : "text-slate-700"}>
            so discipline becomes effortless and growth becomes inevitable.
          </span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={item}
        >
          {/* Primary CTA */}
          <Link href="/signup">
            <motion.button
              className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold text-white overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 12px 40px rgba(99,102,241,0.55)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Shimmer sweep */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span>Start Evolving — Free</span>
              <motion.span
                className="group-hover:translate-x-1 transition-transform"
              >
                <ArrowRight size={18} />
              </motion.span>
            </motion.button>
          </Link>

          {/* Secondary CTA */}
          <motion.button
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-medium border transition-all ${
              isDark
                ? "text-slate-300 border-slate-700 hover:border-violet-500/50 hover:text-white hover:bg-white/5"
                : "text-slate-600 border-slate-200 hover:border-violet-400/50 hover:text-slate-900 hover:bg-black/3"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: isDark
                  ? "rgba(99,102,241,0.15)"
                  : "rgba(99,102,241,0.1)",
              }}
              whileHover={{
                scale: 1.2,
                background: "rgba(99,102,241,0.3)",
              }}
            >
              <Play size={12} className="text-violet-400 ml-0.5" />
            </motion.span>
            Watch 60s Demo
          </motion.button>
        </motion.div>

        {/* Floating achievement badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 pt-4"
          style={{ y: badgesY }}
          variants={item}
        >
          {floatingBadges.map((badge, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium"
              style={{
                background: isDark
                  ? `${badge.color}12`
                  : `${badge.color}08`,
                borderColor: `${badge.color}30`,
                color: badge.color,
              }}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: badge.delay,
                duration: 0.5,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.06, y: -2 }}
            >
              <badge.icon size={14} />
              {badge.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="flex flex-col items-center gap-2 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
            style={{
              borderColor: isDark
                ? "rgba(255,255,255,0.15)"
                : "rgba(0,0,0,0.15)",
            }}
          >
            <motion.div
              className="w-1 h-2 rounded-full bg-violet-400"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          <span
            className={`text-xs tracking-widest uppercase ${
              isDark ? "text-slate-600" : "text-slate-400"
            }`}
          >
            Scroll
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}