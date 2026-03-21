"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createNote, updateNote, type Note } from "@/lib/api/notes";

const noteSchema = z.object({
  title: z.string().max(100).optional(),
  content: z.string().optional(),
  color: z.string(),
});

type FormData = z.infer<typeof noteSchema>;

const colors = ["default", "blue", "green", "yellow", "purple"];

export function NoteEditor({ isOpen, onClose, note }: { isOpen: boolean, onClose: () => void, note: Note | null }) {
  const queryClient = useQueryClient();
  const isEditing = !!note;

  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: "", content: "", color: "default" }
  });

  const selectedColor = watch("color");

  useEffect(() => {
    if (isOpen) {
      reset(note ? { title: note.title, content: note.content, color: note.color || "default" } : { title: "", content: "", color: "default" });
    }
  }, [isOpen, note, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => isEditing ? updateNote(note.id, data) : createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success(isEditing ? "Note updated" : "Note created");
      onClose();
    },
    onError: () => toast.error("Failed to save note")
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] border-border/60 bg-background/95 backdrop-blur-2xl rounded-2xl p-0 gap-0 overflow-hidden shadow-2xl">
        {/* Hidden title for accessibility warning fix */}
        <DialogTitle className="sr-only">{isEditing ? "Edit Note" : "Create Note"}</DialogTitle>
        <DialogDescription className="sr-only">Make changes to your note here.</DialogDescription>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-[70vh] max-h-[600px]">
          <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between bg-muted/20">
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue("color", c)}
                  className={`h-5 w-5 rounded-full border transition-transform ${selectedColor === c ? 'scale-125 ring-2 ring-ring ring-offset-2 ring-offset-background' : ''}`}
                  style={{
                    backgroundColor: c === 'default' ? 'var(--muted)' : `var(--${c}-500, ${c})` // Quick inline mock, best handled with exact hexes in real app
                  }}
                  aria-label={`Set color to ${c}`}
                />
              ))}
            </div>
            <Button type="submit" disabled={isSubmitting} size="sm" className="rounded-full px-6">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <Input
              {...register("title")}
              placeholder="Note Title"
              className="text-2xl font-semibold border-none bg-transparent shadow-none focus-visible:ring-0 px-0 h-auto placeholder:text-muted-foreground/50"
            />
            <Textarea
              {...register("content")}
              placeholder="Start typing..."
              className="min-h-[300px] resize-none border-none bg-transparent shadow-none focus-visible:ring-0 px-0 text-base leading-relaxed placeholder:text-muted-foreground/50"
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}