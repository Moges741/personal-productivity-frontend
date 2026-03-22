"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { motivationalQuotes } from "./mockData";

interface Props {
  progress: number;
  streak: number;
}

export function MotivationalEcho({ progress, streak }: Props) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Select a quote weighted toward progress & streak context
  useEffect(() => {
    const index = (Math.floor(progress * 10) + streak) % motivationalQuotes.length;
    setQuoteIndex(index);
  }, [progress, streak]);

  // Cycle quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
        setVisible(true);
      }, 600);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const quote = motivationalQuotes[quoteIndex];

  return (
    <div className="max-w-xl mx-auto min-h-[80px] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={quoteIndex}
            className="text-center space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-base md:text-lg text-slate-300 dark:text-slate-300 text-slate-600 font-light leading-relaxed italic">
              "{quote.text}"
            </p>
            <p className="text-xs text-slate-500 font-medium">
              — {quote.author}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}