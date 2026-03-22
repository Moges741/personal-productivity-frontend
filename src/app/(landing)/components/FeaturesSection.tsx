"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTheme } from "next-themes";
import {
  FileText, CheckSquare, Repeat,
  Target, Calendar, Zap,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Notes",
    tagline: "Think without limits",
    description:
      "Capture ideas, insights, and breakthroughs the moment they arrive. Rich, linked, alive.",
    color: "#3b82f6",
    gradient: "from-blue-500/20 to-blue-600/5",
    delay: 0,
  },
  {
    icon: CheckSquare,
    title: "Tasks",
    tagline: "Execute with precision",
    description:
      "Turn intentions into actions. Prioritize ruthlessly, complete consistently, compound results.",
    color: "#6366f1",
    gradient: "from-violet-500/20 to-violet-600/5",
    delay: 0.1,
  },
  {
    icon: Repeat,
    title: "Habits",
    tagline: "Build the unbreakable",
    description:
      "Track streaks, measure consistency, and watch small daily acts forge the strongest version of you.",
    color: "#10b981",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    delay: 0.2,
  },
  {
    icon: Target,
    title: "Goals",
    tagline: "See what you're becoming",
    description:
      "Set north stars with milestones and progress tracking. Bridge who you are to who you're meant to be.",
    color: "#f59e0b",
    gradient: "from-amber-500/20 to-amber-600/5",
    delay: 0.3,
  },
  {
    icon: Calendar,
    title: "Calendar",
    tagline: "Own every hour",
    description:
      "Your time is your most precious resource. Plan it with intention — every block a brick in your evolution.",
    color: "#ec4899",
    gradient: "from-pink-500/20 to-pink-600/5",
    delay: 0.4,
  },
  {
    icon: Zap,
    title: "Intelligence",
    tagline: "Everything connected",
    description:
      "Every module talks to every other. Habits feed goals. Tasks become calendar events. Progress compounds.",
    color: "#8b5cf6",
    gradient: "from-purple-500/20 to-purple-600/5",
    delay: 0.5,
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={`relative rounded-3xl p-7 border overflow-hidden group cursor-default`}
      style={{
        background: isDark
          ? `linear-gradient(135deg, ${feature.color}08, transparent)`
          : `linear-gradient(135deg, ${feature.color}05, transparent)`,
        borderColor: isDark
          ? `${feature.color}20`
          : `${feature.color}15`,
        backdropFilter: "blur(20px)",
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: feature.delay,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: 1.025,
        borderColor: `${feature.color}45`,
        boxShadow: `0 20px 60px ${feature.color}18`,
      }}
    >
      {/* Corner glow on hover */}
      <motion.div
        className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${feature.color}25, transparent)`,
        }}
      />

      {/* Icon */}
      <motion.div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: `${feature.color}18` }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <feature.icon size={22} style={{ color: feature.color }} />
      </motion.div>

      {/* Content */}
      <div className="space-y-2">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: feature.color }}
        >
          {feature.tagline}
        </p>
        <h3
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {feature.title}
        </h3>
        <p
          className={`text-sm leading-relaxed ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {feature.description}
        </p>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-3xl"
        style={{
          background: `linear-gradient(90deg, transparent, ${feature.color}60, transparent)`,
        }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ delay: feature.delay + 0.3, duration: 0.6 }}
      />
    </motion.div>
  );
}

export function FeaturesSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      className="relative py-32 px-6"
      aria-label="Features"
      id="features"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          ref={ref}
          className="text-center space-y-5 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-xs uppercase tracking-[0.35em] font-semibold"
            style={{ color: "#818cf8" }}
          >
            Everything in one place
          </p>
          <h2
            className={`text-4xl md:text-6xl font-bold tracking-tight leading-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The complete system
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              for self-mastery
            </span>
          </h2>
          <p
            className={`text-lg max-w-xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Five interconnected modules that work together, not in silos.
            Because real growth is never linear.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}