"use client";

import { useMemo } from "react";
import { format, isSameDay, startOfDay } from "date-fns";
import type { CalendarEvent } from "@/lib/api/calendar-events";
import { EventBlock } from "@/components/calendar/event-block";

export function AgendaView({
  cursorDate,
  events,
  onOpenEvent,
}: {
  cursorDate: Date;
  events: CalendarEvent[];
  onOpenEvent: (e: CalendarEvent) => void;
}) {
  const sorted = useMemo(() => {
    return [...events].sort(
      (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    );
  }, [events]);

  // group by day
  const groups = useMemo(() => {
    const out: { day: Date; items: CalendarEvent[] }[] = [];
    for (const ev of sorted) {
      const d = startOfDay(new Date(ev.startDateTime));
      const last = out[out.length - 1];
      if (!last || !isSameDay(last.day, d)) out.push({ day: d, items: [ev] });
      else last.items.push(ev);
    }
    return out;
  }, [sorted]);

  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <section key={g.day.toISOString()} className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-background/50 backdrop-blur">
            <h3 className="text-sm font-semibold tracking-tight">{format(g.day, "EEEE, MMM d")}</h3>
          </div>
          <div className="p-5 space-y-3">
            {g.items.map((ev) => (
              <EventBlock key={ev.id} event={ev} variant="block" onOpen={() => onOpenEvent(ev)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}