"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
export function CtaSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="relative py-32 px-6 overflow-hidden"
      aria-label="Call to action"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center border"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))"
              : "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))",
            borderColor: isDark
              ? "rgba(99,102,241,0.3)"
              : "rgba(99,102,241,0.2)",
            backdropFilter: "blur(30px)",
            boxShadow: isDark
              ? "0 40px 120px rgba(99,102,241,0.15)"
              : "0 40px 120px rgba(99,102,241,0.08)",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glow orbs inside card */}
          <motion.div
            className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.25), transparent)",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.2), transparent)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />

          {/* Icon */}
         
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-6">
 <Link href="/" className="flex items-center group">
  <div className="relative h-10 w-36 shrink-0 overflow-hidden">
    <Image
      src="/images/logo1.png"
      alt="Evolve"
      width={100}
      height={140}
      className="object-contain  object-center"
      priority
    />
  </div>
</Link>
          </div>
         

          {/* Headline */}
          <motion.h2
            className={`text-4xl md:text-6xl font-bold tracking-tight mb-5 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Your strongest self
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              starts today.
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            className={`text-lg mb-10 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            Free to start. No credit card. Cancel any time.
            <br />
            Just you, your goals, and a system that works.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link href="/signup">
              <motion.button
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-semibold text-white relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 8px 40px rgba(99,102,241,0.5)",
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 12px 60px rgba(99,102,241,0.65)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                Begin Your Evolution
                <motion.span className="group-hover:translate-x-1.5 transition-transform">
                  <ArrowRight size={20} />
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}