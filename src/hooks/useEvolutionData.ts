import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useAuthStore } from '@/store/auth-store';

// ── Types ─────────────────────────────────────────────────────

export interface Habit {
  id: string;
  name: string;
  frequency: string;
  currentStreak: number;
  bestStreak: number;
  lastCompletedAt: string | null;
  category: string;
  color: string;
  icon: string | null;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  priority: string;
  progressPercentage: number;
  targetDate: string | null;
  completedAt: string | null;
  category: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

// ── Individual hooks ──────────────────────────────────────────

export function useUserProfile() {
  // Guard: don't query until auth is initialized
  const isAuthReady = useAuthStore((s) => s.isAuthReady);
  const token = useAuthStore((s) => s.accessToken);

  return useQuery<UserProfile>({
    queryKey: ['user', 'me'],
    queryFn: () => api.get('/users/me').then((r) => r.data),
    enabled: isAuthReady && !!token,  // 👈 both must be true
    staleTime: 1000 * 60 * 10,        // profile rarely changes
  });
}

export function useHabits() {
  const isAuthReady = useAuthStore((s) => s.isAuthReady);
  const token = useAuthStore((s) => s.accessToken);

  return useQuery<Habit[]>({
    queryKey: ['habits'],
    queryFn: () => api.get('/habits').then((r) => r.data),
    enabled: isAuthReady && !!token,
    staleTime: 1000 * 60 * 2,
  });
}

export function useTasks() {
  const isAuthReady = useAuthStore((s) => s.isAuthReady);
  const token = useAuthStore((s) => s.accessToken);

  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks').then((r) => r.data),
    enabled: isAuthReady && !!token,
    staleTime: 1000 * 60 * 2,
  });
}

export function useGoals() {
  const isAuthReady = useAuthStore((s) => s.isAuthReady);
  const token = useAuthStore((s) => s.accessToken);

  return useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: () => api.get('/goals').then((r) => r.data),
    enabled: isAuthReady && !!token,
    staleTime: 1000 * 60 * 2,
  });
}

// ── Master computed hook ──────────────────────────────────────

export function useEvolutionStats() {
  const profile = useUserProfile();
  const habits  = useHabits();
  const tasks   = useTasks();
  const goals   = useGoals();

  // Also grab user from Zustand as fallback for name
  // (auth/refresh already populated this)
  const zustandUser = useAuthStore((s) => s.user);

  const isLoading =
    profile.isLoading || habits.isLoading ||
    tasks.isLoading   || goals.isLoading;

  const isError =
    profile.isError || habits.isError ||
    tasks.isError   || goals.isError;

  if (
    isLoading || isError ||
    !habits.data || !tasks.data || !goals.data
  ) {
    return { isLoading, isError, stats: null };
  }

  const allHabits = habits.data.filter((h) => !h.isDeleted && !h.isArchived);
  const allTasks  = tasks.data;
  const allGoals  = goals.data;
  const now       = new Date();

  // ── Name — use profile.data first, fall back to zustand ────
  // This handles the case where /users/me hasn't loaded yet
  // but auth/refresh already gave us the user object
  const rawName =
    profile.data?.name ??
    zustandUser?.name ??
    profile.data?.email ??
    zustandUser?.email ??
    'Friend';

  // Capitalize first letter of each word, clean up separators
  const name = rawName
    .split(/[\s._-]+/)
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  // ── Days since joining ──────────────────────────────────────
  const createdAt = profile.data?.createdAt ?? zustandUser?.createdAt ?? null;
  const joinedDaysAgo = createdAt
    ? Math.max(
        1,
        Math.floor(
          (now.getTime() - new Date(createdAt).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 1;

  // ── Streak calculations ─────────────────────────────────────
  const currentStreak =
    allHabits.length > 0
      ? Math.max(...allHabits.map((h) => h.currentStreak))
      : 0;

  const bestStreak =
    allHabits.length > 0
      ? Math.max(...allHabits.map((h) => h.bestStreak))
      : 0;

  // ── Task stats ──────────────────────────────────────────────
  const totalTasksCompleted = allTasks.filter(
    (t) => t.status === 'done'
  ).length;

  const todayTasks = allTasks.filter((t) => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate).toDateString() === now.toDateString();
  });
  const todayTasksDone = todayTasks.filter(
    (t) => t.status === 'done'
  ).length;

  // ── Today's habits done ─────────────────────────────────────
  const habitsCompletedToday = allHabits.filter((h) => {
    if (!h.lastCompletedAt) return false;
    return new Date(h.lastCompletedAt).toDateString() === now.toDateString();
  }).length;

  // ── Today's overall progress 0–1 ───────────────────────────
  const totalTodayItems = allHabits.length + todayTasks.length;
  const totalTodayDone  = habitsCompletedToday + todayTasksDone;
  const todayProgress   =
    totalTodayItems > 0 ? totalTodayDone / totalTodayItems : 0;

  // ── Goals ───────────────────────────────────────────────────
  const goalsInProgress = allGoals.filter(
    (g) => g.status === 'in_progress'
  ).length;
  const goalsCompleted = allGoals.filter(
    (g) => g.status === 'completed'
  ).length;

  // ── Total habits logged (sum of current streaks) ────────────
  const totalHabitsCompleted = allHabits.reduce(
    (sum, h) => sum + h.currentStreak,
    0
  );

  // ── Weekly progress — last 7 days ───────────────────────────
  const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    const dayStr = day.toDateString();

    const habitsOnDay = allHabits.filter(
      (h) =>
        h.lastCompletedAt &&
        new Date(h.lastCompletedAt).toDateString() === dayStr
    ).length;

    const tasksOnDay = allTasks.filter(
      (t) =>
        t.status === 'done' &&
        new Date(t.updatedAt).toDateString() === dayStr
    ).length;

    const total = Math.max(allHabits.length, 1);
    return Math.min((habitsOnDay + tasksOnDay) / total, 1);
  });

  // ── Level 1–5 based on total actions ───────────────────────
  const totalActions =
    totalTasksCompleted +
    totalHabitsCompleted +
    goalsCompleted * 5;

  const level =
    totalActions >= 200 ? 5
    : totalActions >= 100 ? 4
    : totalActions >= 50  ? 3
    : totalActions >= 20  ? 2
    : 1;

  // ── Milestone detection ─────────────────────────────────────
  const milestoneJustHit =
    [7, 14, 21, 30, 60, 90].includes(currentStreak) ||
    [10, 25, 50, 100].includes(totalTasksCompleted);

  return {
    isLoading: false,
    isError:   false,
    stats: {
      name,
      email:               profile.data?.email ?? zustandUser?.email ?? '',
      joinedDaysAgo,
      currentStreak,
      bestStreak,
      totalTasksCompleted,
      totalHabitsCompleted,
      goalsInProgress,
      goalsCompleted,
      notesCreated:        0, // add GET /notes later
      todayProgress,
      weeklyProgress,
      milestoneJustHit,
      level,
      habits:              allHabits,
      tasks:               allTasks,
      goals:               allGoals,
    },
  };
}