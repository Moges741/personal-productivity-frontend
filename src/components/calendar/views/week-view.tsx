"use client";

import { useMemo, useState } from "react";
import { addDays, format, startOfWeek, isSameDay, setHours, setMinutes } from "date-fns";
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { motion } from "framer-motion";
import type { CalendarEvent } from "@/lib/api/calendar-events";
import { shiftEventToDateTime } from "@/lib/calendar/layout";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 17 }).map((_, i) => i + 6); // 6..22

export function WeekView({
  cursorDate,
  events,
  onOpenEvent,
  onReschedule,
}: {
  cursorDate: Date;
  events: CalendarEvent[];
  onOpenEvent: (e: CalendarEvent) => void;
  onReschedule: (p: { id: string; startDateTime: string; endDateTime: string }) => void;
}) {
  const weekStart = useMemo(() => startOfWeek(cursorDate, { weekStartsOn: 1 }), [cursorDate]);
  const days = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)), [weekStart]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeEvent = useMemo(() => events.find((e) => e.id === activeId) || null, [events, activeId]);

  const weekEvents = useMemo(() => {
    return events.filter((ev) => {
      const s = new Date(ev.startDateTime);
      return days.some((d) => isSameDay(d, s));
    });
  }, [events, days]);

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const over = e.over?.id as string | undefined;
    if (!over) return;

    // over id format: slot:yyyy-MM-dd:HH:mm
    if (!over.startsWith("slot:")) return;
    const [_p, dateStr, hm] = over.split(":");
    if (!dateStr || !hm) return;

    const ev = events.find((x) => x.id === (e.active.id as string));
    if (!ev) return;

    const [hh, mm] = hm.split("-").map(Number);
    const target = new Date(dateStr + "T00:00:00");
    const targetStart = setMinutes(setHours(target, hh), mm);

    const { startISO, endISO } = shiftEventToDateTime(ev, targetStart);
    if (startISO === ev.startDateTime && endISO === ev.endDateTime) return;

    onReschedule({ id: ev.id, startDateTime: startISO, endDateTime: endISO });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden"
    >
      <DndContext
        sensors={sensors}
        onDragStart={(ev) => setActiveId(ev.active.id as string)}
        onDragEnd={handleDragEnd}
      >
        {/* Header */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border bg-background/50 backdrop-blur">
          <div className="p-3 text-xs font-semibold text-muted-foreground uppercase">Time</div>
          {days.map((d) => (
            <div key={d.toISOString()} className="p-3 border-l border-border">
              <div className="text-xs text-muted-foreground">{format(d, "EEE")}</div>
              <div className="text-sm font-semibold">{format(d, "d")}</div>
            </div>
          ))}
        </div>

        <div className="relative">
          {/* Grid */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)]">
            {/* Time labels */}
            <div className="border-r border-border">
              {HOURS.map((h) => (
                <div key={h} className="h-14 px-3 py-2 text-xs text-muted-foreground tabular-nums border-b border-border">
                  {String(h).padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* Day columns droppable slots */}
            {days.map((day) => (
              <div key={day.toISOString()} className="relative border-r border-border last:border-r-0">
                {HOURS.map((h) => (
                  <WeekSlot key={day.toISOString() + h} day={day} hour={h} />
                ))}

                {/* Render events for this day */}
                <div className="absolute inset-0 pointer-events-none">
                  {weekEvents
                    .filter((ev) => isSameDay(new Date(ev.startDateTime), day))
                    .map((ev) => (
                      <WeekEventBlock
                        key={ev.id}
                        event={ev}
                        day={day}
                        onOpen={() => onOpenEvent(ev)}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeEvent ? (
            <div className="rounded-2xl border border-border bg-background shadow-xl px-3 py-2 text-xs font-semibold">
              {activeEvent.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </motion.div>
  );
}

function WeekSlot({ day, hour }: { day: Date; hour: number }) {
  // 30-min granularity (two slots per hour)
  const slots = [
    { hh: hour, mm: 0 },
    { hh: hour, mm: 30 },
  ];

  return (
    <div className="border-b border-border">
      {slots.map((s) => (
        <DroppableSlot key={`${hour}-${s.mm}`} day={day} hh={s.hh} mm={s.mm} />
      ))}
    </div>
  );
}

function DroppableSlot({ day, hh, mm }: { day: Date; hh: number; mm: number }) {
  const dateStr = format(day, "yyyy-MM-dd");
  const id = `slot:${dateStr}:${hh}-${mm}`;
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn("h-7 border-t border-border/40", isOver && "bg-indigo-500/10")}
    />
  );
}

function WeekEventBlock({ event, day, onOpen }: { event: CalendarEvent; day: Date; onOpen: () => void }) {
  const s = new Date(event.startDateTime);
  const e = new Date(event.endDateTime);

  const minutesFromStart = (s.getHours() - 6) * 60 + s.getMinutes();
  const durationMin = Math.max(15, Math.round((e.getTime() - s.getTime()) / 60000));
  const top = (minutesFromStart / 60) * 56; // each hour = 56px (h-14)
  const height = (durationMin / 60) * 56;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: event.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "pointer-events-auto absolute left-2 right-2 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 shadow-sm hover:shadow-md transition-all",
        "text-xs font-semibold text-indigo-800 dark:text-indigo-300",
        isDragging && "opacity-60"
      )}
      style={{ top, height }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      role="button"
      aria-label={`Open event ${event.title}`}
    >
      <div className="truncate">{event.title}</div>
      <div className="mt-1 text-[11px] text-muted-foreground tabular-nums">
        {format(s, "p")}–{format(e, "p")}
      </div>
    </div>
  );
}