import { differenceInCalendarDays, isSameDay, startOfDay } from "date-fns";
import type { CalendarEvent } from "@/lib/api/calendar-events";
import { inDayRange } from "@/lib/calendar/date";

/**
 * A "span" represents one event rendered across a single week row.
 * Multi-day events become multiple spans (one per week).
 */
export type WeekSpan = {
  event: CalendarEvent;
  startDayIndex: number; // 0..6 within the week
  length: number;        // how many days wide inside this week row
  isStart: boolean;      // event starts inside this week row
  isEnd: boolean;        // event ends inside this week row
};

function toDate(ev: CalendarEvent) {
  return {
    start: new Date(ev.startDateTime),
    end: new Date(ev.endDateTime),
  };
}

export function eventTouchesDay(ev: CalendarEvent, day: Date) {
  const { start, end } = toDate(ev);
  return inDayRange(day, start, end);
}

/**
 * Build spans for a single week row (7 days).
 * Each event can contribute 0 or 1 span for that week row.
 */
export function buildWeekSpans(weekDays: Date[], events: CalendarEvent[]): WeekSpan[] {
  const spans: WeekSpan[] = [];

  for (const ev of events) {
    const { start, end } = toDate(ev);

    // if event doesn't touch this week at all, skip
    const touches = weekDays.some((d) => inDayRange(d, start, end));
    if (!touches) continue;

    // Determine the first and last day indices inside this week
    let first = -1;
    let last = -1;
    for (let i = 0; i < 7; i++) {
      if (inDayRange(weekDays[i], start, end)) {
        if (first === -1) first = i;
        last = i;
      }
    }
    if (first === -1 || last === -1) continue;

    spans.push({
      event: ev,
      startDayIndex: first,
      length: last - first + 1,
      isStart: isSameDay(startOfDay(start), startOfDay(weekDays[first])),
      isEnd: isSameDay(startOfDay(end), startOfDay(weekDays[last])),
    });
  }

  // Sort: pinned first, then longer first (so background bars appear behind), then by start time
  spans.sort((a, b) => {
    const ap = a.event.isPinned ? 1 : 0;
    const bp = b.event.isPinned ? 1 : 0;
    if (ap !== bp) return bp - ap;
    if (a.length !== b.length) return b.length - a.length;
    return new Date(a.event.startDateTime).getTime() - new Date(b.event.startDateTime).getTime();
  });

  return spans;
}

/**
 * Assign spans to "lanes" (rows) so they do not overlap horizontally in the week row.
 */
export function laneizeWeekSpans(spans: WeekSpan[]) {
  const lanes: WeekSpan[][] = [];

  for (const span of spans) {
    let placed = false;
    for (const lane of lanes) {
      const conflicts = lane.some((s) => {
        const a0 = s.startDayIndex;
        const a1 = s.startDayIndex + s.length - 1;
        const b0 = span.startDayIndex;
        const b1 = span.startDayIndex + span.length - 1;
        return !(b1 < a0 || b0 > a1);
      });
      if (!conflicts) {
        lane.push(span);
        placed = true;
        break;
      }
    }
    if (!placed) lanes.push([span]);
  }

  return lanes;
}

/**
 * When moving an event to a new day (month drag), keep the same time + duration.
 * This returns new start/end ISO strings.
 */
export function shiftEventToDayKeepTime(ev: CalendarEvent, targetDay: Date) {
  const start = new Date(ev.startDateTime);
  const end = new Date(ev.endDateTime);
  const durationMs = end.getTime() - start.getTime();

  // Set target day with same time as original start
  const newStart = new Date(targetDay);
  newStart.setHours(start.getHours(), start.getMinutes(), 0, 0);

  const newEnd = new Date(newStart.getTime() + durationMs);

  return { startISO: newStart.toISOString(), endISO: newEnd.toISOString() };
}

/**
 * For week/day timeline drag: shift start to a specific datetime, preserve duration.
 */
export function shiftEventToDateTime(ev: CalendarEvent, targetStart: Date) {
  const start = new Date(ev.startDateTime);
  const end = new Date(ev.endDateTime);
  const durationMs = end.getTime() - start.getTime();

  const newStart = new Date(targetStart);
  const newEnd = new Date(newStart.getTime() + durationMs);

  return { startISO: newStart.toISOString(), endISO: newEnd.toISOString() };
}

/**
 * Used to compute grid row count for a multi-day event.
 */
export function spanDays(ev: CalendarEvent) {
  const s = new Date(ev.startDateTime);
  const e = new Date(ev.endDateTime);
  return Math.max(1, differenceInCalendarDays(e, s) + 1);
}