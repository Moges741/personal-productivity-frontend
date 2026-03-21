"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Trash2, AlignLeft, CheckCircle2, Clock, Circle, SignalHigh, SignalMedium, SignalLow, Palette } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createTask, updateTask, deleteTask, type Task as ApiTask } from "@/lib/api/tasks";
  import type { SubmitHandler } from "react-hook-form";

// Ensure Task type has color: string (not color?: string)
type Task = Omit<ApiTask, "color"> & { color: string };

const schema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  color: z.string().min(1, "Color is required"), 
  dueDate: z.date().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

const colors = ["default", "blue", "green", "yellow", "purple"];

export function TaskEditor({ isOpen, onClose, task }: { isOpen: boolean, onClose: () => void, task: Task | null }) {
  const queryClient = useQueryClient();
  const isEditing = !!task;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: "todo", priority: "medium", color: "default" }
  });

  const dueDate = watch("dueDate");
  const status = watch("status");
  const priority = watch("priority");
  const selectedColor = watch("color");

  useEffect(() => {
    if (isOpen) {
      reset(task ? {
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        color: task.color, 
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      } : { title: "", description: "", status: "todo", priority: "medium", color: "default", dueDate: null });
    }
  }, [isOpen, task, reset]);

  const saveMut = useMutation({
    mutationFn: (data: any) => isEditing ? updateTask(task.id, data) : createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(isEditing ? "Task updated" : "Task created");
      onClose();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to save task")
  });

  const delMut = useMutation({
    mutationFn: () => deleteTask(task!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
      onClose();
    },
  });


  const onSubmit: SubmitHandler<FormValues> = (data) => {
    saveMut.mutate({ ...data, dueDate: data.dueDate ? data.dueDate.toISOString() : null });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] border border-border bg-background rounded-2xl p-0 shadow-2xl overflow-hidden gap-0">
        <DialogTitle className="sr-only">{isEditing ? "Edit Task" : "Create Task"}</DialogTitle>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="p-6 pb-4 space-y-4">
            <div>
              <Input 
                {...register("title")} 
                placeholder="Task Title" 
                className={`text-2xl font-semibold border-none bg-transparent px-0 h-auto shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40 ${errors.title ? "placeholder:text-red-400" : ""}`} 
                autoFocus 
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div className="flex gap-3">
              <AlignLeft className="h-5 w-5 mt-2 text-muted-foreground shrink-0" />
              <Textarea 
                {...register("description")} 
                placeholder="Add description..." 
                className="min-h-[120px] resize-none border-none bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm leading-relaxed" 
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-y border-border grid grid-cols-2 gap-4">
            
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">Status</span>
              <Select value={status} onValueChange={(v: any) => setValue("status", v)}>
                <SelectTrigger className="h-8 border border-border bg-background hover:bg-muted shadow-sm focus:ring-1 px-3 flex-1 rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo"><div className="flex items-center"><Circle className="h-3.5 w-3.5 mr-2 text-slate-500"/> To Do</div></SelectItem>
                  <SelectItem value="in_progress"><div className="flex items-center"><Clock className="h-3.5 w-3.5 mr-2 text-blue-500"/> In Progress</div></SelectItem>
                  <SelectItem value="done"><div className="flex items-center"><CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-500"/> Done</div></SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">Priority</span>
              <Select value={priority} onValueChange={(v: any) => setValue("priority", v)}>
                <SelectTrigger className="h-8 border border-border bg-background hover:bg-muted shadow-sm focus:ring-1 px-3 flex-1 rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low"><div className="flex items-center"><SignalLow className="h-3.5 w-3.5 mr-2 text-slate-500"/> Low</div></SelectItem>
                  <SelectItem value="medium"><div className="flex items-center"><SignalMedium className="h-3.5 w-3.5 mr-2 text-amber-500"/> Medium</div></SelectItem>
                  <SelectItem value="high"><div className="flex items-center"><SignalHigh className="h-3.5 w-3.5 mr-2 text-red-500"/> High</div></SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">Due Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={`h-8 border-border bg-background hover:bg-muted shadow-sm px-3 flex-1 justify-start font-normal rounded-md ${!dueDate && "text-muted-foreground"}`}>
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {dueDate ? format(dueDate, "MMM d, yyyy") : "No date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-border" align="start">
                  <Calendar mode="single" selected={dueDate || undefined} onSelect={(d) => setValue("dueDate", d)} />
                </PopoverContent>
              </Popover>
            </div>

            {/* NEW: Color Picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-16 flex items-center gap-1"><Palette className="h-3 w-3"/> Color</span>
              <div className="flex gap-2 flex-1 items-center px-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setValue("color", c)}
                    className={`h-5 w-5 rounded-full border transition-all hover:scale-110 ${selectedColor === c ? 'scale-110 ring-2 ring-blue-500 ring-offset-1 ring-offset-background' : 'border-border/50'}`}
                    style={{
                      backgroundColor: c === 'default' ? 'var(--background)' : `var(--${c}-500, ${c})`
                    }}
                    title={c}
                  />
                ))}
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between p-4 bg-background">
            {isEditing ? (
              <Button type="button" variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 text-sm h-8 px-3" onClick={() => delMut.mutate()}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete Task
              </Button>
            ) : <div />}
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="border-border">Cancel</Button>
              <Button type="submit" size="sm" disabled={isSubmitting || saveMut.isPending} className="px-5 bg-foreground text-background hover:bg-foreground/90">
                {isSubmitting || saveMut.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Task
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}