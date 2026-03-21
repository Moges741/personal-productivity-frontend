"use client";

import { format, isPast, isToday } from "date-fns";
import { AlertCircle, Calendar, CheckCircle2, Circle, Clock, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority, TaskStatus } from "@/lib/api/tasks";

type TaskCardProps = {
  task: Task;
  isDragging?: boolean;
};

const statusConfig: Record<TaskStatus, { icon: any; color: string }> = {
  todo: { icon: Circle, color: "text-slate-400 dark:text-slate-500" },
  in_progress: { icon: Clock, color: "text-blue-500" },
  done: { icon: CheckCircle2, color: "text-emerald-500" },
};

const priorityConfig: Record<TaskPriority, { icon: any; color: string }> = {
  high: { icon: SignalHigh, color: "text-red-500" },
  medium: { icon: SignalMedium, color: "text-amber-500" },
  low: { icon: SignalLow, color: "text-slate-400 dark:text-slate-500" },
};

// Premium tint colors
const colorMap: Record<string, string> = {
  blue: "bg-blue-50/80 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50",
  green: "bg-green-50/80 dark:bg-green-900/10 border-green-200 dark:border-green-800/50",
  yellow: "bg-amber-50/80 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50",
  purple: "bg-purple-50/80 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/50",
  while: "  bg-white/80 border-white/50",
  default: "bg-background dark:bg-card border-border",
};

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const StatusIcon = statusConfig[task.status]?.icon || Circle;
  const PriorityIcon = priorityConfig[task.priority]?.icon || SignalMedium;
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== "done";
  
  // Get color or fallback to default
  const themeClasses = colorMap[task.color || "default"] || colorMap.default;

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border p-4 text-left shadow-sm transition-all hover:shadow-md",
        themeClasses,
        isDragging && "opacity-80 ring-2 ring-blue-500 shadow-xl rotate-2 scale-105 cursor-grabbing z-50",
        task.status === "done" && "opacity-60 grayscale-[0.5]"
      )}
    >
      <div className="flex items-start gap-3">
        <StatusIcon className={cn("mt-0.5 h-4 w-4 shrink-0", statusConfig[task.status]?.color)} />
        <div className="flex-1 space-y-1.5">
          <h4 className={cn("text-sm font-semibold leading-tight text-foreground", task.status === "done" && "line-through text-muted-foreground")}>
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-1 flex items-center gap-3 pl-7">
        <div className="flex items-center gap-1.5 rounded-md bg-black/5 dark:bg-white/5 px-2 py-1 transition-colors">
          <PriorityIcon className={cn("h-3.5 w-3.5", priorityConfig[task.priority]?.color)} />
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{task.priority}</span>
        </div>

        {task.dueDate && (
          <div className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
            isOverdue ? "text-red-600 bg-red-100 dark:bg-red-500/10 dark:text-red-400" : "text-slate-600 bg-black/5 dark:bg-white/5 dark:text-slate-400"
          )}>
            {isOverdue ? <AlertCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
            {format(new Date(task.dueDate), "MMM d")}
          </div>
        )}
      </div>
    </div>
  );
}