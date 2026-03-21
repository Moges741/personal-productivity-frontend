"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { NoteCard } from "@/components/notes/note-card";
import { NoteEditor } from "@/components/notes/note-editor";
import { NotesSkeleton } from "@/components/notes/notes-skeleton";
import { NotesEmpty } from "@/components/notes/notes-empty";
import { getNotes, type Note } from "@/lib/api/notes";

export default function NotesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const pinnedNotes = notes?.filter((n) => n.isPinned) || [];
  const otherNotes = notes?.filter((n) => !n.isPinned) || [];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Capture your thoughts and ideas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "grid" | "list")} className="hidden sm:inline-flex bg-background/50 border border-border/50 rounded-lg p-1 backdrop-blur-sm">
            <ToggleGroupItem value="grid" aria-label="Grid view" className="rounded-md data-[state=on]:bg-card data-[state=on]:shadow-sm">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view" className="rounded-md data-[state=on]:bg-card data-[state=on]:shadow-sm">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Button onClick={handleCreate} className="rounded-xl shadow-sm hover:shadow-md transition-all">
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <NotesSkeleton view={view} />
      ) : notes?.length === 0 ? (
        <NotesEmpty onCreate={handleCreate} />
      ) : (
        <div className="space-y-8">
          {pinnedNotes.length > 0 && (
            <NoteSection title="Pinned" notes={pinnedNotes} view={view} onEdit={handleEdit} />
          )}
          {otherNotes.length > 0 && (
            <NoteSection title="All Notes" notes={otherNotes} view={view} onEdit={handleEdit} />
          )}
        </div>
      )}

      {/* Editor Modal */}
      <NoteEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        note={editingNote}
      />
    </div>
  );
}

function NoteSection({ title, notes, view, onEdit }: { title: string, notes: Note[], view: "grid" | "list", onEdit: (n: Note) => void }) {
  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground mb-4">{title}</h2>
      <motion.div
        layout
        className={
          view === "grid"
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "flex flex-col gap-3"
        }
      >
        <AnimatePresence mode="popLayout">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} view={view} onClick={() => onEdit(note)} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}