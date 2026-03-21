"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Tag, Repeat } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createHabit, updateHabit, deleteHabit, type Habit, type HabitCategory, type HabitFrequency } from "@/lib/api/habits";

// Zod Schema perfectly aligned with Prisma
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "custom"]),
  category: z.enum(["health", "fitness", "productivity", "learning", "mindfulness", "finance", "social", "creativity", "other"]),
  color: z.string().min(1, "Color is required"),
});

type FormValues = z.infer<typeof schema>;

const colors = ["default", "blue", "green", "yellow", "purple"];
const categories: { label: string; value: HabitCategory }[] = [
  { label: "Health", value: "health" },
  { label: "Fitness", value: "fitness" },
  { label: "Productivity", value: "productivity" },
  { label: "Learning", value: "learning" },
  { label: "Mindfulness", value: "mindfulness" },
  { label: "Finance", value: "finance" },
  { label: "Social", value: "social" },
  { label: "Creativity", value: "creativity" },
  { label: "Other", value: "other" }
];

export function HabitEditor({ isOpen, onClose, habit }: { isOpen: boolean, onClose: () => void, habit: Habit | null }) {
  const queryClient = useQueryClient();
  const isEditing = !!habit;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { frequency: "daily", color: "blue", category: "other" }
  });

  const frequency = watch("frequency");
  const category = watch("category");
  const selectedColor = watch("color");

  useEffect(() => {
    if (isOpen) {
      reset(habit ? {
        name: habit.name,
        description: habit.description || "",
        frequency: habit.frequency,
        color: habit.color ?? "blue",
        category: habit.category,
      } : { name: "", description: "", frequency: "daily", color: "blue", category: "other" });
    }
  }, [isOpen, habit, reset]);

  const saveMut = useMutation({
    mutationFn: (data: any) => isEditing ? updateHabit(habit.id, data) : createHabit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast.success(isEditing ? "Habit updated" : "Habit created");
      onClose();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to save habit")
  });

  const delMut = useMutation({
    mutationFn: () => deleteHabit(habit!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast.success("Habit deleted");
      onClose();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] border border-border bg-background rounded-2xl p-0 shadow-2xl overflow-hidden gap-0">
        <DialogTitle className="sr-only">{isEditing ? "Edit Habit" : "New Habit"}</DialogTitle>
        
        <form onSubmit={handleSubmit((d) => saveMut.mutate(d))} className="flex flex-col">
          <div className="p-6 pb-4 space-y-4">
            <div>
              <Input 
                {...register("name")} 
                placeholder="e.g. Drink 2L of Water" 
                className={`text-2xl font-semibold border-none bg-transparent px-0 h-auto shadow-none focus-visible:ring-0 ${errors.name ? "placeholder:text-red-400" : ""}`} 
                autoFocus 
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            
            <Input 
              {...register("description")} 
              placeholder="Why are you building this habit?" 
              className="border-none bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm text-muted-foreground" 
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-y border-border grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
              <Select value={category} onValueChange={(v: any) => setValue("category", v)}>
                <SelectTrigger className="h-8 bg-background border-border flex-1 shadow-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4 text-muted-foreground shrink-0" />
              <Select value={frequency} onValueChange={(v: any) => setValue("frequency", v)}>
                <SelectTrigger className="h-8 bg-background border-border flex-1 shadow-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2 flex items-center gap-3 pt-2">
              <span className="text-xs text-muted-foreground font-medium w-16">Theme</span>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button key={c} type="button" onClick={() => setValue("color", c)}
                    className={`h-6 w-6 rounded-full border-2 transition-all ${selectedColor === c ? 'scale-110 border-foreground shadow-sm' : 'border-transparent'}`}
                    style={{ backgroundColor: c === 'default' ? 'var(--muted)' : `var(--${c}-500, ${c})` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-background">
            {isEditing ? (
              <Button type="button" variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 px-3 text-sm" onClick={() => delMut.mutate()}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            ) : <div />}
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
              <Button type="submit" size="sm" disabled={isSubmitting || saveMut.isPending} className="px-6">
                {isSubmitting || saveMut.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Save Habit
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}