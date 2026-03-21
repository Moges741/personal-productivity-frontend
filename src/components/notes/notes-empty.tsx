"use client";

import { motion } from "framer-motion";
import { Plus, Notebook } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotesEmpty({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 px-4 text-center"
    >
      <div className="h-20 w-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 ring-8 ring-background/50">
        <Notebook className="h-10 w-10 text-blue-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold tracking-tight mb-2">No notes yet</h3>
      <p className="text-muted-foreground max-w-sm mb-8 text-sm">
        Jot down ideas, meeting notes, or random thoughts. Your notes are securely synced across all your devices.
      </p>
      <Button onClick={onCreate} className="rounded-xl shadow-lg hover:shadow-xl transition-all h-11 px-6">
        <Plus className="mr-2 h-4 w-4" />
        Create your first note
      </Button>
    </motion.div>
  );
}