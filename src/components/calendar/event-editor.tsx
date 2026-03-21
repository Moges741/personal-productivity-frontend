"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, Trash2, Sparkles, Repeat } from "lucide-react";

import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  type CalendarEvent,
  type CalendarEventCategory,
  type CalendarEventStatus,
} from "@/lib/api/calendar-events";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const HEX = /^#[0-9a-f]{6}$/i;

const schema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    location: z.string().optional(),

    startDate: z.string().min(1, "Start date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endDate: z.string().min(1, "End date is required"),
    endTime: z.string().min(1, "End time is required"),

    isAllDay: z.boolean(),

    status: z.enum(["tentative", "confirmed", "cancelled"]),
    category: z.enum(["personal", "work", "health", "family", "other"]),

    reminderMinutesBefore: z.number().nullable(),
    isPinned: z.boolean(),

    isRecurring: z.boolean(),
    recurrenceRule: z.string().nullable(),

    // Store hex by default (matches your DB default)
    color: z
      .string()
      .default("#3b82f6")
      .optional()
      .refine((v = "#3b82f6") => HEX.test(v.trim()), "Color must be a hex like #3b82f6"),
  })
  .refine(
    (v) => new Date(`${v.endDate}T${v.endTime}`).getTime() >= new Date(`${v.startDate}T${v.startTime}`).getTime(),
    { message: "End time must be after start time", path: ["endTime"] }
  )
  .refine(
    (v) => (v.isRecurring ? !!(v.recurrenceRule && v.recurrenceRule.trim()) : true),
    { message: "Recurrence rule is required when recurring is enabled", path: ["recurrenceRule"] }
  );

type FormValues = z.infer<typeof schema>;

const reminderOptions: { label: string; value: number | null }[] = [
  { label: "None", value: null },
  { label: "5 minutes before", value: 5 },
  { label: "10 minutes before", value: 10 },
  { label: "30 minutes before", value: 30 },
  { label: "1 hour before", value: 60 },
  { label: "1 day before", value: 1440 },
];

const categories: { value: CalendarEventCategory; label: string }[] = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "health", label: "Health" },
  { value: "family", label: "Family" },
  { value: "other", label: "Other" },
];

const statuses: { value: CalendarEventStatus; label: string }[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "tentative", label: "Tentative" },
  { value: "cancelled", label: "Cancelled" },
];

// Jewel-tone presets write HEX (so the DB is consistent)
const colorPresets: { label: string; hex: string; className: string }[] = [
  { label: "Blue", hex: "#3b82f6", className: "bg-blue-500" },
  { label: "Indigo", hex: "#6366f1", className: "bg-indigo-500" },
  { label: "Rose", hex: "#f43f5e", className: "bg-rose-500" },
  { label: "Emerald", hex: "#10b981", className: "bg-emerald-500" },
  { label: "Amber", hex: "#f59e0b", className: "bg-amber-500" },
];

export function EventEditor({
  isOpen,
  onClose,
  event,
}: {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
}) {
  const qc = useQueryClient();
  const isEditing = !!event;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startDate: "",
      startTime: "09:00",
      endDate: "",
      endTime: "10:00",
      isAllDay: false,

      status: "confirmed",
      category: "other",

      reminderMinutesBefore: null,
      isPinned: false,

      isRecurring: false,
      recurrenceRule: "",

      color: "#3b82f6",
    },
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = form;

  const isAllDay = watch("isAllDay");
  const status = watch("status");
  const category = watch("category");
  const reminder = watch("reminderMinutesBefore");
  const isPinned = watch("isPinned");
  const isRecurring = watch("isRecurring");
  const color = watch("color");

  useEffect(() => {
    if (!isOpen) return;

    if (event) {
      const s = new Date(event.startDateTime);
      const e = new Date(event.endDateTime);

      reset({
        title: event.title,
        description: event.description ?? "",
        location: event.location ?? "",

        startDate: format(s, "yyyy-MM-dd"),
        startTime: format(s, "HH:mm"),
        endDate: format(e, "yyyy-MM-dd"),
        endTime: format(e, "HH:mm"),

        isAllDay: !!event.isAllDay,

        status: event.status ?? "confirmed",
        category: event.category ?? "other",

        reminderMinutesBefore: event.reminderMinutesBefore ?? null,
        isPinned: !!event.isPinned,

        isRecurring: !!event.isRecurring,
        recurrenceRule: event.recurrenceRule ?? "",

        color: event.color && HEX.test(event.color) ? event.color : "#3b82f6",
      });
    } else {
      const now = new Date();
      const start = new Date(now);
      start.setMinutes(0, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      reset({
        title: "",
        description: "",
        location: "",
        startDate: format(start, "yyyy-MM-dd"),
        startTime: format(start, "HH:mm"),
        endDate: format(end, "yyyy-MM-dd"),
        endTime: format(end, "HH:mm"),
        isAllDay: false,

        status: "confirmed",
        category: "other",

        reminderMinutesBefore: null,
        isPinned: false,

        isRecurring: false,
        recurrenceRule: "",

        color: "#3b82f6",
      });
    }
  }, [isOpen, event, reset]);

  useEffect(() => {
    if (!isOpen) return;
    if (isAllDay) {
      setValue("startTime", "00:00", { shouldValidate: true });
      setValue("endTime", "23:59", { shouldValidate: true });
    }
  }, [isAllDay, isOpen, setValue]);

  const saveMut = useMutation({
    mutationFn: async (v: FormValues) => {
      const startISO = new Date(`${v.startDate}T${v.startTime}`).toISOString();
      const endISO = new Date(`${v.endDate}T${v.endTime}`).toISOString();

      const payload = {
        title: v.title,
        description: v.description || null,
        location: v.location || null,

        startDateTime: startISO,
        endDateTime: endISO,

        isAllDay: v.isAllDay,

        status: v.status,
        category: v.category,

        reminderMinutesBefore: v.reminderMinutesBefore ?? null,
        isPinned: v.isPinned,

        isRecurring: v.isRecurring,
        recurrenceRule: v.isRecurring ? (v.recurrenceRule ?? null) : null,

        color: v.color,
      };

      return isEditing
        ? updateCalendarEvent(event!.id, payload)
        : createCalendarEvent(payload as any);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar-events"] });
      toast.success(isEditing ? "Event updated" : "Event created");
      onClose();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed to save event"),
  });

  const delMut = useMutation({
    mutationFn: async () => deleteCalendarEvent(event!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar-events"] });
      toast.success("Event deleted");
      onClose();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Failed to delete event"),
  });

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[760px] p-0 overflow-hidden rounded-3xl border border-border bg-background shadow-2xl max-h-[90vh]">
        <DialogTitle className="sr-only">{isEditing ? "Edit event" : "New event"}</DialogTitle>
        <DialogDescription className="sr-only">Create or edit a calendar event.</DialogDescription>

        <div className="flex max-h-[90vh] flex-col">
          <div className="relative border-b border-border px-6 py-5 sm:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(circle_at_70%_0%,rgba(99,102,241,0.14),transparent_60%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Schedule something you’ll be proud to keep
              </div>

              <Input
                {...register("title")}
                placeholder="Event title…"
                className="mt-3 text-xl sm:text-2xl font-semibold border-none bg-transparent px-0 h-auto shadow-none focus-visible:ring-0"
                autoFocus
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
            </div>
          </div>

          <form onSubmit={handleSubmit((v: FormValues) => saveMut.mutate(v))} className="min-h-0 flex-1 flex flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field title="Start">
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" {...register("startDate")} />
                    <Input type="time" {...register("startTime")} disabled={isAllDay} />
                  </div>
                </Field>

                <Field title="End">
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" {...register("endDate")} />
                    <Input type="time" {...register("endTime")} disabled={isAllDay} />
                  </div>
                  {errors.endTime && <p className="mt-1 text-xs text-red-500">{errors.endTime.message as any}</p>}
                </Field>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-tight">All day</p>
                  <p className="text-xs text-muted-foreground">No time — just a meaningful day marker.</p>
                </div>
                <Switch checked={isAllDay} onCheckedChange={(v) => setValue("isAllDay", v)} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field title="Status">
                  <Select value={status} onValueChange={(v) => setValue("status", v as CalendarEventStatus)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field title="Category">
                  <Select value={category} onValueChange={(v) => setValue("category", v as CalendarEventCategory)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field title="Location (optional)">
                <Input placeholder="e.g. Home, Gym, Office…" {...register("location")} />
              </Field>

              <Field title="Description (optional)">
                <Textarea placeholder="A few details…" className="min-h-[96px]" {...register("description")} />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field title="Reminder">
                  <Select
                    value={reminder === null ? "none" : String(reminder)}
                    onValueChange={(v) => setValue("reminderMinutesBefore", v === "none" ? null : Number(v))}
                  >
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {reminderOptions.map((r) => (
                        <SelectItem key={r.label} value={r.value === null ? "none" : String(r.value)}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field title="Pin">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold tracking-tight">Pinned</p>
                      <p className="text-xs text-muted-foreground">Keep it prominent.</p>
                    </div>
                    <Switch checked={isPinned} onCheckedChange={(v) => setValue("isPinned", v)} />
                  </div>
                </Field>
              </div>

              <Field title="Color (hex)">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    {colorPresets.map((c) => {
                      const selected = color?.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setValue("color", c.hex, { shouldValidate: true })}
                          className={cn(
                            "h-8 w-8 rounded-full border transition-all",
                            c.className,
                            selected ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : "opacity-85 hover:opacity-100"
                          )}
                          aria-label={`Select color ${c.label}`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      {...register("color")}
                      placeholder="#3b82f6"
                      className="w-[140px] rounded-xl"
                      aria-label="Custom hex color"
                    />
                  </div>
                </div>
                {errors.color && <p className="mt-1 text-xs text-red-500">{errors.color.message as any}</p>}
              </Field>

              <div className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold tracking-tight">Recurring</p>
                    <p className="text-xs text-muted-foreground">Repeat with an RRULE string.</p>
                  </div>
                </div>
                <Switch checked={isRecurring} onCheckedChange={(v) => setValue("isRecurring", v)} />
              </div>

              {isRecurring && (
                <Field title="Recurrence rule (RRULE)">
                  <Input placeholder="e.g. FREQ=WEEKLY;BYDAY=MO,WE,FR" {...register("recurrenceRule")} />
                  {errors.recurrenceRule && <p className="mt-1 text-xs text-red-500">{errors.recurrenceRule.message as any}</p>}
                </Field>
              )}

              <div className="h-2" />
            </div>

            <div className="sticky bottom-0 border-t border-border bg-background/90 backdrop-blur px-6 py-4 sm:px-8 flex items-center justify-between">
              {isEditing ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => delMut.mutate()}
                  className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
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
                  Save event
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}