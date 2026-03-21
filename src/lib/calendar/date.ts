import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export function getMonthGrid(cursorMonth: Date, weekStartsOn: 0 | 1 = 1) {
  const monthStart = startOfMonth(cursorMonth);
  const monthEnd = endOfMonth(cursorMonth);

  const gridStart = startOfWeek(monthStart, { weekStartsOn });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn });

  const days: Date[] = [];
  let d = gridStart;
  while (d <= gridEnd) {
    days.push(d);
    d = addDays(d, 1);
  }

  // 6 weeks grid
  return { monthStart, monthEnd, gridStart, gridEnd, days };
}

export function dayKey(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function inDayRange(day: Date, start: Date, end: Date) {
  // inclusive by day (multi-day spans)
  const s = startOfDay(start).getTime();
  const e = endOfDay(end).getTime();
  const x = startOfDay(day).getTime();
  return x >= s && x <= e;
}

export function isTodayish(d: Date) {
  return isSameDay(d, new Date());
}

export function isCurrentMonth(d: Date, cursorMonth: Date) {
  return isSameMonth(d, startOfMonth(cursorMonth));
}