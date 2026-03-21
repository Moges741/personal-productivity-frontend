"use client";

import { format, isToday } from "date-fns";
import { motion } from "framer-motion";
import { Check, Flame, Trophy, Calendar } from "lucide-react";
import confetti from "canvas-confetti";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // <--- ADDED TOAST
import { completeHabit, type Habit } from "@/lib/api/habits";

const colorMap: Record<string, { bg: string, text: string, ring: string }> = {
  blue: { bg: "bg-blue-50/50 dark:bg-blue-900/10", text: "text-blue-600 dark:text-blue-400", ring: "#3b82f6" },
  green: { bg: "bg-emerald-50/50 dark:bg-emerald-900/10", text: "text-emerald-600 dark:text-emerald-400", ring: "#10b981" },
  yellow: { bg: "bg-amber-50/50 dark:bg-amber-900/10", text: "text-amber-600 dark:text-amber-400", ring: "#f59e0b" },
  purple: { bg: "bg-purple-50/50 dark:bg-purple-900/10", text: "text-purple-600 dark:text-purple-400", ring: "#8b5cf6" },
  default: { bg: "bg-slate-50/50 dark:bg-slate-900/20", text: "text-slate-600 dark:text-slate-400", ring: "#64748b" },
};

export function HabitCard({ habit, onClick }: { habit: Habit, onClick: () => void }) {
  const queryClient = useQueryClient();
  
  const themeKey = habit.color?.startsWith("#") ? "blue" : (habit.color || "default");
  const theme = colorMap[themeKey] || colorMap.default;
  
  const isDoneToday = habit.lastCompletedAt ? isToday(new Date(habit.lastCompletedAt)) : false;

  const completeMut = useMutation({
    mutationFn: () => completeHabit(habit.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["habits"] });
      const prev = queryClient.getQueryData<Habit[]>(["habits"]);
      
      // Optimistically update the UI instantly
      queryClient.setQueryData<Habit[]>(["habits"], old => 
        old?.map(h => h.id === habit.id ? { ...h, currentStreak: h.currentStreak + 1, lastCompletedAt: new Date().toISOString() } : h)
      );
      return { prev };
    },
    // FIX: IF IT FAILS, SHOW THE ERROR INSTEAD OF FAILING SILENTLY
    onError: (err: any, newHabit, context) => {
      queryClient.setQueryData(["habits"], context?.prev); // Rollback UI
      toast.error(err?.response?.data?.message || err?.message || "Failed to mark as done in backend");
      console.error("Complete Error:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (isDoneToday || completeMut.isPending) return;
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({ particleCount: 60, spread: 70, origin: { x, y }, colors: [theme.ring, "#ffffff"] });
    completeMut.mutate();
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "group cursor-pointer relative overflow-hidden rounded-2xl border border-border bg-background dark:bg-card p-5 shadow-sm transition-all hover:shadow-md",
        theme.bg,
        isDoneToday && "opacity-70"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-background/80 border border-border/50", theme.text)}>
              {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {habit.frequency}
            </span>
          </div>
          <h3 className="font-semibold text-lg leading-tight tracking-tight mt-2 text-foreground">{habit.name}</h3>
          {habit.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{habit.description}</p>}
        </div>
        
        <button
          onClick={handleComplete}
          disabled={isDoneToday}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
            isDoneToday 
              ? `scale-110 shadow-md` 
              : "border-border hover:bg-muted"
          )}
          style={{ 
            backgroundColor: isDoneToday ? theme.ring : 'var(--background)',
            borderColor: isDoneToday ? theme.ring : undefined 
          }}
        >
          <Check className={cn("h-5 w-5 transition-transform", isDoneToday ? "scale-100 text-white" : "scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-50")} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Current Streak</span>
            <div className="flex items-center gap-1.5 font-bold text-lg mt-0.5 text-foreground">
              <StreakRing streak={habit.currentStreak} color={theme.ring} />
              <span>{habit.currentStreak}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Best Streak</span>
            <div className="flex items-center gap-1.5 font-bold text-lg mt-0.5 text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>{habit.bestStreak}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StreakRing({ streak, color }: { streak: number, color: string }) {
  const max = 30; 
  const progress = Math.min(streak, max);
  const circumference = 2 * Math.PI * 8; 
  const offset = circumference - (progress / max) * circumference;

  return (
    <div className="relative flex items-center justify-center h-5 w-5">
      <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-muted/30" />
        <motion.circle
          cx="10" cy="10" r="8" stroke={color} strokeWidth="2.5" fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: streak === 0 ? circumference : offset }}
          transition={{ duration: 1, type: "spring" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <Flame className={cn("h-3 w-3 z-10", streak > 0 ? "text-orange-500" : "text-muted-foreground/30")} />
    </div>
  );
}