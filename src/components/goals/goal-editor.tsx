"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";

import {
  createGoal,
  updateGoal,
  deleteGoal,
  type Goal,
  type GoalCategory,
  type GoalPriority,
  type GoalStatus,
} from "@/lib/api/goals";
import { ProgressRing } from "@/components/goals/progress-ring";
import { MilestoneCelebration } from "@/components/goals/milestone-celebration";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["personal", "career", "health", "finance", "learning", "other"]),
  status: z.enum(["not_started", "in_progress", "completed", "abandoned"]),
  priority: z.enum(["low", "medium", "high"]),
  startDate: z.date().optional().nullable(),
  targetDate: z.date().optional().nullable(),
  progressPercentage: z.number().min(0).max(100).default(0).optional(),
  isPinned: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const categories: { value: GoalCategory; label: string }[] = [
  { value: "personal", label: "Personal" },
  { value: "career", label: "Career" },
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
  { value: "learning", label: "Learning" },
  { value: "other", label: "Other" },
];

const statuses: { value: GoalStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "abandoned", label: "Abandoned" },
];

const priorities: { value: GoalPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function GoalEditor({
  isOpen,
  onClose,
  goal,
}: {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}) {
  const queryClient = useQueryClient();
  const isEditing = !!goal;
  const confettiFired = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      category: "other",
      status: "not_started",
      priority: "medium",
      startDate: null,
      targetDate: null,
      progressPercentage: 0,
      isPinned: false,
    },
  });

  const progress = watch("progressPercentage");
  const category = watch("category");
  const status = watch("status");
  const priority = watch("priority");
  const startDate = watch("startDate");
  const targetDate = watch("targetDate");
  const isPinned = watch("isPinned");

  useEffect(() => {
    confettiFired.current = false;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (goal) {
      reset({
        title: goal.title,
        description: goal.description ?? "",
        category: goal.category,
        status: goal.status,
        priority: goal.priority,
        startDate: goal.startDate ? new Date(goal.startDate) : null,
        targetDate: goal.targetDate ? new Date(goal.targetDate) : null,
        progressPercentage: goal.progressPercentage ?? 0,
        isPinned: typeof goal.isPinned === "boolean" ? goal.isPinned : false,
      });
    } else {
      reset({
        title: "",
        description: "",
        category: "other",
        status: "not_started",
        priority: "medium",
        startDate: null,
        targetDate: null,
        progressPercentage: 0,
        isPinned: false,
      });
    }
  }, [isOpen, goal, reset]);

  useEffect(() => {
    if ((progress ?? 0) >= 100 && !confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.55, y: 0.2 },
        colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981"],
      });
    }
    if ((progress ?? 0) < 100) confettiFired.current = false;
  }, [progress]);

  const saveMut = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        ...data,
        startDate: data.startDate ? data.startDate.toISOString() : null,
        targetDate: data.targetDate ? data.targetDate.toISOString() : null,
      };
      return isEditing ? updateGoal(goal!.id, payload) : createGoal(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success(isEditing ? "Goal updated" : "Goal created");
      onClose();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed to save goal"),
  });

  const delMut = useMutation({
    mutationFn: async () => deleteGoal(goal!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Goal deleted");
      onClose();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed to delete goal"),
  });

  const onSubmit: import("react-hook-form").SubmitHandler<FormValues> = (data) => saveMut.mutate(data);

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      {/* KEY FIX: constrain height + make inside scroll */}
      <DialogContent className="sm:max-w-[760px] p-0 overflow-hidden rounded-3xl border border-border bg-background shadow-2xl max-h-[90vh]">
        <DialogTitle className="sr-only">{isEditing ? "Edit Goal" : "New Goal"}</DialogTitle>
        <DialogDescription className="sr-only">Create or edit a goal.</DialogDescription>

        {/* Scrollable container */}
        <div className="flex h-full max-h-[90vh] flex-col">
          {/* Cinematic header (compact) */}
          <div className="relative border-b border-border px-6 py-5 sm:px-8 sm:py-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(99,102,241,0.22),transparent_50%),radial-gradient(circle_at_70%_0%,rgba(236,72,153,0.16),transparent_55%)]" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" />
                  Make it visible · make it inevitable
                </div>

                <Input
                  {...register("title")}
                  placeholder="Your goal title…"
                  className="mt-3 text-xl sm:text-2xl font-semibold border-none bg-transparent px-0 h-auto shadow-none focus-visible:ring-0"
                  autoFocus
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div className="shrink-0 pt-1">
                <div className="relative">
                  <ProgressRing value={progress ?? 0} size={74} stroke={9} accentClassName="text-indigo-700 dark:text-indigo-400" />
                  <MilestoneCelebration progress={progress ?? 0} />
                </div>
              </div>
            </div>

            <Textarea
              {...register("description")}
              placeholder="Describe what success looks like…"
              className="relative mt-3 min-h-[86px] border-none bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm leading-relaxed"
            />
          </div>

          {/* BODY (scrolls) */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold tracking-tight">Progress</p>
                  <p className="text-sm text-muted-foreground tabular-nums">{progress}%</p>
                </div>
                <div className="mt-3">
                  <Slider
                    value={[progress ?? 0]}
                    onValueChange={(v) => setValue("progressPercentage", v[0])}
                    max={100}
                    step={1}
                    aria-label="Progress percentage"
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Drag the slider — the ring updates live.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldCard title="Category">
                  <Select value={category} onValueChange={(v) => setValue("category", v as GoalCategory)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldCard>

                <FieldCard title="Status">
                  <Select value={status} onValueChange={(v) => setValue("status", v as GoalStatus)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldCard>

                <FieldCard title="Priority">
                  <Select value={priority} onValueChange={(v) => setValue("priority", v as GoalPriority)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {priorities.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldCard>

                <FieldCard title="Start date">
                  <DateField value={startDate} onChange={(d) => setValue("startDate", d)} placeholder="Pick start date" />
                </FieldCard>

                <FieldCard title="Target date">
                  <DateField value={targetDate} onChange={(d) => setValue("targetDate", d)} placeholder="Pick target date" />
                </FieldCard>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-tight">Pin this goal</p>
                  <p className="text-xs text-muted-foreground">Keep it at the top of your dashboard.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPinned}
                  onClick={() => setValue("isPinned", !isPinned)}
                  className={cn("h-9 w-16 rounded-full border border-border transition-colors relative", isPinned ? "bg-indigo-700" : "bg-muted")}
                >
                  <span className={cn("absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background shadow-sm transition-transform", isPinned ? "translate-x-8" : "translate-x-1")} />
                </button>
              </div>

              {/* Add a little bottom padding so content never hides behind sticky footer */}
              <div className="h-2" />
            </div>

            {/* STICKY FOOTER (always visible) */}
            <div className="sticky bottom-0 border-t border-border bg-background/90 backdrop-blur px-6 py-4 sm:px-8 flex items-center justify-between">
              {isEditing ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => delMut.mutate()}
                  className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl" disabled={saveMut.isPending}>
                  {saveMut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save goal
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FieldCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function DateField({
  value,
  onChange,
  placeholder,
}: {
  value: Date | null | undefined;
  onChange: (d: Date | null) => void;
  placeholder: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start rounded-xl", !value && "text-muted-foreground")}>
          {value ? format(value, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value ?? undefined} onSelect={(d) => onChange(d ?? null)} initialFocus />
      </PopoverContent>
    </Popover>
  );
}