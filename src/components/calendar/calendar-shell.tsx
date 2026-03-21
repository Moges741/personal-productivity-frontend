"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMonths, format, startOfMonth } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "sonner";
import confetti from "canvas-confetti";

import {
  getCalendarEvents,
  updateCalendarEvent,
  type CalendarEvent,
} from "@/lib/api/calendar-events";

import { Button } from "@/components/ui/button";
import { CalendarEmpty } from "@/components/calendar/calendar-empty";
import { CalendarSkeleton } from "@/components/calendar/calendar-skeleton";
import { EventEditor } from "@/components/calendar/event-editor";

import { MonthView } from "@/components/calendar/views/month-view";
import { WeekView } from "@/components/calendar/views/week-view";
import { DayView } from "@/components/calendar/views/day-view";
import { AgendaView } from "@/components/calendar/views/agenda-view";

import { ChevronLeft, ChevronRight, Plus, LayoutGrid, Rows3, CalendarDays, Columns3 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type CalendarView = "month" | "week" | "day" | "agenda";

export function CalendarShell() {
  const qc = useQueryClient();

  const [view, setView] = useState<CalendarView>("month");
  const [cursorDate, setCursorDate] = useState(() => new Date());
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["calendar-events"],
    queryFn: getCalendarEvents,
  });

  const events = data ?? [];

  const monthLabel = useMemo(() => format(cursorDate, "MMMM yyyy"), [cursorDate]);

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
    // tiny celebratory sparkle on open
    confetti({ particleCount: 18, spread: 50, origin: { x: 0.88, y: 0.18 }, colors: ["#6366f1", "#ec4899", "#f59e0b"] });
  };

  const openEdit = (ev: CalendarEvent) => {
    setEditing(ev);
    setEditorOpen(true);
  };

  // Optimistic reschedule (used by drag/drop in views)
  const rescheduleMut = useMutation({
    mutationFn: async (payload: { id: string; startDateTime: string; endDateTime: string }) =>
      updateCalendarEvent(payload.id, { startDateTime: payload.startDateTime, endDateTime: payload.endDateTime }),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ["calendar-events"] });
      const prev = qc.getQueryData<CalendarEvent[]>(["calendar-events"]);

      qc.setQueryData<CalendarEvent[]>(["calendar-events"], (old) =>
        (old ?? []).map((e) =>
          e.id === payload.id ? { ...e, startDateTime: payload.startDateTime, endDateTime: payload.endDateTime } : e
        )
      );

      return { prev };
    },
    onError: (err: any, _payload, ctx) => {
      qc.setQueryData(["calendar-events"], ctx?.prev);
      toast.error(err?.response?.data?.message || "Failed to reschedule event");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["calendar-events"] });
    },
  });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Lux top controls (page-level; your global TopBar remains unchanged) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={cn(
          "relative overflow-hidden rounded-3xl border border-border bg-background shadow-sm",
          "backdrop-blur-xl"
        )}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-300/40 via-fuchsia-300/18 to-amber-300/25 blur-3xl dark:from-indigo-500/18 dark:via-fuchsia-500/12 dark:to-amber-500/14" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-300/24 via-cyan-300/16 to-blue-300/24 blur-3xl dark:from-emerald-500/12 dark:via-cyan-500/10 dark:to-blue-500/12" />
        </div>

        <div className="relative p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Month nav */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl"
              onClick={() => setCursorDate((d) => addMonths(d, -1))}
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="min-w-[180px]">
              <p className="text-xs text-muted-foreground">Calendar</p>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">{monthLabel}</h1>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-xl"
              onClick={() => setCursorDate((d) => addMonths(d, 1))}
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="secondary"
              className="rounded-xl hidden sm:inline-flex"
              onClick={() => setCursorDate(new Date())}
            >
              Today
            </Button>
          </div>

          {/* View toggle + create */}
          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(v) => v && setView(v as CalendarView)}
              className="bg-background/70 border border-border/70 rounded-xl p-1 backdrop-blur"
            >
              <ToggleGroupItem value="month" aria-label="Month" className="rounded-lg data-[state=on]:bg-card data-[state=on]:shadow-sm">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="week" aria-label="Week" className="rounded-lg data-[state=on]:bg-card data-[state=on]:shadow-sm">
                <Columns3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="day" aria-label="Day" className="rounded-lg data-[state=on]:bg-card data-[state=on]:shadow-sm">
                <CalendarDays className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="agenda" aria-label="Agenda" className="rounded-lg data-[state=on]:bg-card data-[state=on]:shadow-sm">
                <Rows3 className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <Button onClick={openCreate} className="rounded-xl shadow-sm hover:shadow-md transition-all">
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main */}
      {isLoading ? (
        <CalendarSkeleton />
      ) : isError ? (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium">Couldn’t load calendar events.</p>
          <p className="mt-1 text-sm text-muted-foreground">Try again.</p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => refetch()} variant="secondary">Retry</Button>
            <Button onClick={openCreate}>Create event</Button>
          </div>
        </div>
      ) : events.length === 0 ? (
        <CalendarEmpty onCreate={openCreate} />
      ) : (
        <>
          {view === "month" && (
            <MonthView
              cursorDate={startOfMonth(cursorDate)}
              events={events}
              onOpenEvent={openEdit}
              onReschedule={(p) => rescheduleMut.mutate(p)}
            />
          )}

          {view === "week" && (
            <WeekView
              cursorDate={cursorDate}
              events={events}
              onOpenEvent={openEdit}
              onReschedule={(p) => rescheduleMut.mutate(p)}
            />
          )}

          {view === "day" && (
            <DayView
              cursorDate={cursorDate}
              events={events}
              onOpenEvent={openEdit}
              onReschedule={(p) => rescheduleMut.mutate(p)}
            />
          )}

          {view === "agenda" && (
            <AgendaView
              cursorDate={cursorDate}
              events={events}
              onOpenEvent={openEdit}
            />
          )}
        </>
      )}

      <EventEditor
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        event={editing}
      />
    </div>
  );
}