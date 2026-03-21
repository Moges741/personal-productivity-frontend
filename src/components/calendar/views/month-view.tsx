"use client";

import { useMemo, useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { format, startOfMonth } from "date-fns";
import type { CalendarEvent } from "@/lib/api/calendar-events";
import { getMonthGrid, dayKey, isCurrentMonth, isTodayish } from "@/lib/calendar/date";
import { buildWeekSpans, laneizeWeekSpans, shiftEventToDayKeepTime, type WeekSpan } from "@/lib/calendar/layout";
import { cn } from "@/lib/utils";

export function MonthView({
  cursorDate,
  events,
  onOpenEvent,
  onReschedule,
}: {
  cursorDate: Date; // startOfMonth passed from shell
  events: CalendarEvent[];
  onOpenEvent: (e: CalendarEvent) => void;
  onReschedule: (p: { id: string; startDateTime: string; endDateTime: string }) => void;
}) {
  const { days } = useMemo(() => getMonthGrid(startOfMonth(cursorDate), 1), [cursorDate]);

  const weeks = useMemo(() => {
    const w: Date[][] = [];
    for (let i = 0; i < 6; i++) w.push(days.slice(i * 7, i * 7 + 7));
    return w;
  }, [days]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const activeEvent = useMemo(
    () => events.find((e) => e.id === activeEventId) || null,
    [events, activeEventId]
  );

  const weekLanes = useMemo(() => {
    return weeks.map((weekDays) => {
      const spans = buildWeekSpans(weekDays, events);
      return laneizeWeekSpans(spans);
    });
  }, [weeks, events]);

  function handleDragEnd(e: DragEndEvent) {
    setActiveEventId(null);
    const overId = e.over?.id as string | undefined;
    const activeId = e.active.id as string;

    if (!overId) return;
    if (!overId.startsWith("day:")) return;

    const targetKey = overId.replace("day:", "");
    const targetDay = days.find((d) => dayKey(d) === targetKey);
    if (!targetDay) return;

    const ev = events.find((x) => x.id === activeId);
    if (!ev) return;

    const { startISO, endISO } = shiftEventToDayKeepTime(ev, targetDay);

    // avoid no-op update
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
      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-border bg-background/50 backdrop-blur">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="p-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {d}
          </div>
        ))}
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={(ev) => setActiveEventId(ev.active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <div className="divide-y divide-border">
          {weeks.map((weekDays, wIdx) => (
            <WeekRow
              key={wIdx}
              weekDays={weekDays}
              cursorMonth={cursorDate}
              lanes={weekLanes[wIdx]}
              onOpenEvent={onOpenEvent}
            />
          ))}
        </div>

        <DragOverlay>
          {activeEvent ? (
            <div className="rounded-xl border border-border bg-background shadow-xl px-3 py-2 text-xs font-semibold">
              {activeEvent.title}
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {format(new Date(activeEvent.startDateTime), "MMM d, p")}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </motion.div>
  );
}

function WeekRow({
  weekDays,
  cursorMonth,
  lanes,
  onOpenEvent,
}: {
  weekDays: Date[];
  cursorMonth: Date;
  lanes: WeekSpan[][];
  onOpenEvent: (e: CalendarEvent) => void;
}) {
  return (
    <div className="relative">
      {/* Day cells */}
      <div className="grid grid-cols-7">
        {weekDays.map((day) => (
          <DayCell key={day.toISOString()} day={day} cursorMonth={cursorMonth} />
        ))}
      </div>

      {/* Event lanes overlay */}
      <div className="absolute inset-x-0 top-8 px-2">
        <div className="space-y-1.5">
          {lanes.slice(0, 4).map((lane, idx) => (
            <div key={idx} className="relative grid grid-cols-7 gap-1">
              {lane.map((span) => (
                <SpanPill key={span.event.id + ":" + span.startDayIndex} span={span} onOpen={() => onOpenEvent(span.event)} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DayCell({ day, cursorMonth }: { day: Date; cursorMonth: Date }) {
  const key = dayKey(day);
  const { setNodeRef, isOver } = useDroppable({ id: `day:${key}` });

  const muted = !isCurrentMonth(day, cursorMonth);
  const today = isTodayish(day);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-28 border-r border-border last:border-r-0 p-2 relative",
        muted && "bg-muted/20",
        isOver && "bg-indigo-500/10"
      )}
    >
      <div
        className={cn(
          "text-[11px] font-semibold tabular-nums",
          muted ? "text-muted-foreground" : "text-foreground",
          today && "text-indigo-700 dark:text-indigo-400"
        )}
      >
        {format(day, "d")}
      </div>
    </div>
  );
}

function SpanPill({ span, onOpen }: { span: WeekSpan; onOpen: () => void }) {
  // place span across grid columns using CSS grid
  const colStart = span.startDayIndex + 1;
  const colEnd = colStart + span.length;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "h-6 rounded-lg border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/15 transition-colors",
        "px-2 text-[11px] font-semibold text-indigo-800 dark:text-indigo-300 text-left truncate",
        "shadow-sm hover:shadow-md"
      )}
      style={{ gridColumn: `${colStart} / ${colEnd}` }}
      aria-label={`Open event ${span.event.title}`}
      // drag handle: use DnD-kit "draggable" via attribute on element
      // simplest: set id on element for DndContext auto-draggable by pointer? (No, we need useDraggable.)
      // We'll use a lightweight approach: add data-id and let MonthView treat active.id = event.id via draggable wrapper.
      // We implement draggable wrapper below:
    >
      <DraggableSpanContent id={span.event.id} title={span.event.title} isStart={span.isStart} isEnd={span.isEnd} />
    </button>
  );
}

import { useDraggable } from "@dnd-kit/core";

function DraggableSpanContent({ id, title, isStart, isEnd }: { id: string; title: string; isStart: boolean; isEnd: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "h-full w-full flex items-center gap-2",
        isDragging && "opacity-60"
      )}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
    >
      <span className="truncate">
        {title}
      </span>
      {/* little caps to hint multi-day */}
      {!isStart ? <span className="text-indigo-700/60 dark:text-indigo-300/50">←</span> : null}
      {!isEnd ? <span className="text-indigo-700/60 dark:text-indigo-300/50">→</span> : null}
    </div>
  );
}