"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Evolve replaced five apps for me. Now I start every morning knowing exactly what to do and why it matters.",
    name: "Sarah K.",
    role: "Founder & Builder",
    rating: 5,
    delay: 0,
  },
  {
    quote:
      "I've tried every productivity app. None of them made me feel like I was actually growing — until this.",
    name: "Marcus T.",
    role: "Software Engineer",
    rating: 5,
    delay: 0.15,
  },
  {
    quote:
      "The habit streaks alone changed my life. But seeing my goals connected to my daily tasks? Game over.",
    name: "Priya M.",
    role: "Designer & Creator",
    rating: 5,
    delay: 0.3,
  },
];

const stats = [
  { value: "12K+", label: "People evolving daily" },
  { value: "94%",  label: "Report better consistency" },
  { value: "4.9",  label: "Average rating" },
  { value: "5×",   label: "More goals completed" },
];

function TestimonialCard({
  t,
}: {
  t: (typeof testimonials)[0];
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative rounded-3xl p-7 border"
      style={{
        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
        borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
        backdropFilter: "blur(20px)",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: t.delay,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: 1.02,
        borderColor: "rgba(99,102,241,0.25)",
        boxShadow: "0 20px 60px rgba(99,102,241,0.08)",
      }}
    >
      {/* Quote icon */}
      <Quote
        size={20}
        className="text-violet-400/40 mb-4"
      />

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className="fill-amber-400 text-amber-400"
          />
        ))}
      </div>

      {/* Quote text */}
      <p
        className={`text-base leading-relaxed mb-6 ${
          isDark ? "text-slate-300" : "text-slate-600"
        }`}
      >
        "{t.quote}"
      </p>

      {/* Attribution */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          }}
        >
          {t.name[0]}
        </div>
        <div>
          <p
            className={`text-sm font-semibold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {t.name}
          </p>
          <p
            className={`text-xs ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {t.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function SocialProofSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef  = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });
  const isStatsInView  = useInView(statsRef,  { once: true, margin: "-60px" });

  return (
    <section
      className="relative py-32 px-6"
      aria-label="Social proof and testimonials"
    >
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Stats row */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <p
                className="text-4xl md:text-5xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div
          className="w-full h-px"
          style={{
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)"
              : "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)",
          }}
        />

        {/* Section header */}
        <motion.div
          ref={headerRef}
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 24 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-xs uppercase tracking-[0.35em] font-semibold"
            style={{ color: "#818cf8" }}
          >
            Real people, real growth
          </p>
          <h2
            className={`text-4xl md:text-5xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            They started.{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              They evolved.
            </span>
          </h2>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}