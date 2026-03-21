import { api } from "./client";

export type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getNotes() {
  const { data } = await api.get<Note[]>("/notes");
  return data;
}

export async function createNote(payload: { title?: string; content?: string; color?: string }) {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function updateNote(id: string, payload: Partial<Note>) {
  const { data } = await api.patch<Note>(`/notes/${id}`, payload);
  return data;
}

export async function deleteNote(id: string) {
  // Soft delete endpoint
  const { data } = await api.delete(`/notes/${id}`);
  return data;
}

export async function togglePinNote(id: string, isPinned: boolean) {
  const { data } = await api.patch<Note>(`/notes/${id}`, { isPinned });
  return data;
}