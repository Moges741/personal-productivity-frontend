import { api } from "./client";

/**
 * These enums MUST match your Prisma schema exactly (case-sensitive).
 */
export type GoalCategory =
  | "personal"
  | "career"
  | "health"
  | "finance"
  | "learning"
  | "other";

export type GoalStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "abandoned";

export type GoalPriority = "low" | "medium" | "high";

/**
 * Goal model as returned by your NestJS backend (based on Prisma model).
 * Keep fields optional if backend doesn't always return them (e.g. dates).
 */
export type Goal = {
  id: string;
  title: string;
  description?: string | null;

  category: GoalCategory;
  status: GoalStatus;
  priority: GoalPriority;

  progressPercentage: number;

  startDate?: string | null;
  targetDate?: string | null;

  completedAt?: string | null;
  abandonedAt?: string | null;

  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
};

/**
 * Payloads
 * - Create: title required, everything else optional
 * - Update: partial updates
 *
 * IMPORTANT: dates are sent as ISO strings or null
 */
export type CreateGoalPayload = {
  title: string;
  description?: string | null;

  category?: GoalCategory;
  status?: GoalStatus;
  priority?: GoalPriority;

  progressPercentage?: number;

  startDate?: string | null;
  targetDate?: string | null;

  isPinned?: boolean;
};

export type UpdateGoalPayload = Partial<CreateGoalPayload>;

/**
 * API calls
 */

export async function getGoals(): Promise<Goal[]> {
  const { data } = await api.get<Goal[]>("/goals");
  return data;
}

export async function getGoal(id: string): Promise<Goal> {
  const { data } = await api.get<Goal>(`/goals/${id}`);
  return data;
}

export async function createGoal(payload: CreateGoalPayload): Promise<Goal> {
  const { data } = await api.post<Goal>("/goals", payload);
  return data;
}

export async function updateGoal(id: string, payload: UpdateGoalPayload): Promise<Goal> {
  const { data } = await api.patch<Goal>(`/goals/${id}`, payload);
  return data;
}

export async function deleteGoal(id: string): Promise<void> {
  // Your backend returns NO_CONTENT in many places; treat it as void.
  await api.delete(`/goals/${id}`);
}