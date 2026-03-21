"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Star, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { deleteNote, togglePinNote, type Note } from "@/lib/api/notes";
import { toast } from "sonner";

// Map logical colors to Tailwind safe classes
const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-900 dark:text-blue-200",
  green: "bg-green-500/10 border-green-500/20 text-green-900 dark:text-green-200",
  yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-900 dark:text-yellow-200",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-900 dark:text-purple-200",
  default: "bg-card/60 border-border/60",
};

type NoteCardProps = {
  note: Note;
  view: "grid" | "list";
  onClick: () => void;
};

export function NoteCard({ note, view, onClick }: NoteCardProps) {
  const queryClient = useQueryClient();
  const themeClasses = colorMap[note.color || "default"] || colorMap.default;

  const deleteMut = useMutation({
    mutationFn: () => deleteNote(note.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note moved to trash");
    },
  });

  const pinMut = useMutation({
    mutationFn: () => togglePinNote(note.id, !note.isPinned),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl border backdrop-blur-xl transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        themeClasses,
        view === "grid" ? "flex flex-col h-56 p-5" : "flex flex-row items-center p-4 gap-4"
      )}
      tabIndex={0}
      role="button"
    >
      <div className={cn("flex-1", view === "grid" ? "mb-4" : "")}>
        <div className="flex items-start justify-between">
          <h3 className="font-semibold tracking-tight line-clamp-1">{note.title || "Untitled"}</h3>
          {note.isPinned && <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />}
        </div>
        <p className={cn("mt-2 text-sm opacity-80", view === "grid" ? "line-clamp-5" : "line-clamp-1")}>
          {note.content || "Empty note..."}
        </p>
      </div>

      <div className={cn("mt-auto flex items-center justify-between", view === "list" && "mt-0 shrink-0")}>
        <span className="text-xs font-medium opacity-60">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>

        {/* Hover actions */}
        <div className="opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-background/50"
            onClick={() => pinMut.mutate()}
          >
            <Star className={cn("h-4 w-4", note.isPinned && "fill-current")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
            onClick={() => deleteMut.mutate()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}