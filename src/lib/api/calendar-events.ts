import { api } from "./client";

export type CalendarEventStatus = "tentative" | "confirmed" | "cancelled";
export type CalendarEventCategory = "personal" | "work" | "health" | "family" | "other";

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string | null;

  location?: string | null;

  startDateTime: string; // ISO
  endDateTime: string; // ISO

  isAllDay: boolean;

  isRecurring: boolean;
  recurrenceRule?: string | null;

  color?: string | null; // hex or named (we support both)
  status: CalendarEventStatus;
  category: CalendarEventCategory;

  reminderMinutesBefore?: number | null;

  linkedTaskId?: string | null;
  linkedGoalId?: string | null;

  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
};

export type CreateCalendarEventPayload = {
  title: string;
  description?: string | null;
  location?: string | null;

  startDateTime: string;
  endDateTime: string;

  isAllDay?: boolean;

  isRecurring?: boolean;
  recurrenceRule?: string | null;

  color?: string | null;
  status?: CalendarEventStatus;
  category?: CalendarEventCategory;

  reminderMinutesBefore?: number | null;

  isPinned?: boolean;
};

export type UpdateCalendarEventPayload = Partial<CreateCalendarEventPayload>;

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const { data } = await api.get<CalendarEvent[]>("/calendar-events");
  return data;
}

export async function createCalendarEvent(payload: CreateCalendarEventPayload): Promise<CalendarEvent> {
  const { data } = await api.post<CalendarEvent>("/calendar-events", payload);
  return data;
}

export async function updateCalendarEvent(id: string, payload: UpdateCalendarEventPayload): Promise<CalendarEvent> {
  const { data } = await api.patch<CalendarEvent>(`/calendar-events/${id}`, payload);
  return data;
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  await api.delete(`/calendar-events/${id}`);
}