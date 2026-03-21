import { api } from "./client";

export type HabitFrequency = "daily" | "weekly" | "custom";
export type HabitCategory = "health" | "fitness" | "productivity" | "learning" | "mindfulness" | "finance" | "social" | "creativity" | "other";

export type Habit = {
  id: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  customDays: number[];
  targetCount: number;
  currentStreak: number;
  bestStreak: number;
  reminderTime?: string;
  color: string;
  icon?: string;
  category: HabitCategory;
  lastCompletedAt?: string;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export const getHabits = async () => (await api.get<Habit[]>("/habits")).data;
export const createHabit = async (payload: Partial<Habit>) => (await api.post<Habit>("/habits", payload)).data;
export const updateHabit = async (id: string, payload: Partial<Habit>) => (await api.patch<Habit>(`/habits/${id}`, payload)).data;
export const deleteHabit = async (id: string) => (await api.delete(`/habits/${id}`)).data;
export const completeHabit = async (id: string) => (await api.post<Habit>(`/habits/${id}/done`, {})).data;