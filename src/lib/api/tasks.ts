import { api } from "./client";

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  color?: string;           
  dueDate?: string;
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getTasks() {
  const { data } = await api.get<Task[]>("/tasks");
  return data;
}

export async function createTask(payload: Partial<Task>) {
  const { data } = await api.post<Task>("/tasks", payload);
  return data;
}

export async function updateTask(id: string, payload: Partial<Task>) {
  const { data } = await api.patch<Task>(`/tasks/${id}`, payload);
  return data;
}

export async function deleteTask(id: string) {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
}