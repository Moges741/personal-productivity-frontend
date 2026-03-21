"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/components/habits/habit-card";
import { HabitEditor } from "@/components/habits/habit-editor";
import { getHabits, type Habit } from "@/lib/api/habits";
import { isToday } from "date-fns";

export default function HabitsPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const { data: habits, isLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: getHabits,
  });

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingHabit(null);
    setIsEditorOpen(true);
  };

  const completedToday = habits?.filter(h => h.lastCompletedAt && isToday(new Date(h.lastCompletedAt))).length || 0;

  return (
    <div className="mx-auto max-w-[1200px] flex flex-col space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            You've completed <strong className="text-foreground">{completedToday}</strong> habits today. Keep it up! <Flame className="h-4 w-4 text-orange-500" />
          </p>
        </div>

        <Button onClick={handleCreate} className="rounded-full shadow-sm hover:shadow-md transition-all">
          <Plus className="mr-2 h-4 w-4" /> New Habit
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-[200px] rounded-2xl bg-muted/30 animate-pulse border border-border" />)}
        </div>
      ) : habits?.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl shadow-sm">
          <Flame className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Build your first habit</h3>
          <p className="text-muted-foreground mt-2 mb-6">Small daily actions lead to massive results.</p>
          <Button onClick={handleCreate} variant="outline" className="rounded-full">Create Habit</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits?.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onClick={() => handleEdit(habit)} />
          ))}
        </div>
      )}

      <HabitEditor isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} habit={editingHabit} />
    </div>
  );
}