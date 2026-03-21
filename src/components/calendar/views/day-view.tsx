"use client";

import { useMemo, useState } from "react";
import { format, isSameDay, setHours, setMinutes, startOfDay } from "date-fns";
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { motion } from "framer-motion";
import type { CalendarEvent } from "@/lib/api/calendar-events";
import { shiftEventToDateTime } from "@/lib/calendar/layout";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 17 }).map((_, i) => i + 6); // 6..22

export function DayView({
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
  const day = useMemo(() => startOfDay(cursorDate), [cursorDate]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const dayEvents = useMemo(() => {
    return events.filter((ev) => isSameDay(new Date(ev.startDateTime), day));
  }, [events, day]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeEvent = useMemo(() => events.find((e) => e.id === activeId) || null, [events, activeId]);

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const over = e.over?.id as string | undefined;
    if (!over || !over.startsWith("slot:")) return;

    const [_p, hm] = over.split(":");
    const [hh, mm] = hm.split("-").map(Number);

    const ev = events.find((x) => x.id === (e.active.id as string));
    if (!ev) return;

    const targetStart = setMinutes(setHours(day, hh), mm);
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
        <div className="px-5 py-4 border-b border-border bg-background/50 backdrop-blur">
          <div className="text-xs text-muted-foreground">Day</div>
          <div className="text-lg font-semibold">{format(day, "EEEE, MMM d")}</div>
        </div>

        <div className="relative grid grid-cols-[80px_1fr]">
          <div className="border-r border-border">
            {HOURS.map((h) => (
              <div key={h} className="h-14 px-3 py-2 text-xs text-muted-foreground tabular-nums border-b border-border">
                {String(h).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          <div className="relative">
            {HOURS.map((h) => (
              <DaySlot key={h} hour={h} />
            ))}

            <div className="absolute inset-0 pointer-events-none">
              {dayEvents.map((ev) => (
                <DayEventBlock key={ev.id} event={ev} onOpen={() => onOpenEvent(ev)} />
              ))}
            </div>
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

function DaySlot({ hour }: { hour: number }) {
  const slots = [
    { hh: hour, mm: 0 },
    { hh: hour, mm: 30 },
  ];
  return (
    <div className="border-b border-border">
      {slots.map((s) => (
        <DroppableDaySlot key={`${hour}-${s.mm}`} hh={s.hh} mm={s.mm} />
      ))}
    </div>
  );
}

function DroppableDaySlot({ hh, mm }: { hh: number; mm: number }) {
  const id = `slot:${hh}-${mm}`;
  const { setNodeRef, isOver } = useDroppable({ id });
  return <div ref={setNodeRef} className={cn("h-7 border-t border-border/40", isOver && "bg-indigo-500/10")} />;
}

function DayEventBlock({ event, onOpen }: { event: CalendarEvent; onOpen: () => void }) {
  const s = new Date(event.startDateTime);
  const e = new Date(event.endDateTime);

  const minutesFromStart = (s.getHours() - 6) * 60 + s.getMinutes();
  const durationMin = Math.max(15, Math.round((e.getTime() - s.getTime()) / 60000));
  const top = (minutesFromStart / 60) * 56;
  const height = (durationMin / 60) * 56;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: event.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "pointer-events-auto absolute left-3 right-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 shadow-sm hover:shadow-md transition-all",
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