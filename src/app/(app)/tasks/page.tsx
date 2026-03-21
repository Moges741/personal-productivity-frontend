"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskEditor } from "@/components/tasks/tasks-editor";
import { TasksSkeleton } from "@/components/tasks/tasks-skeleton";
import { getTasks, type Task } from "@/lib/api/tasks";

export default function TasksPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const handleEdit = (task: Task) => {
    // Ensure color is always a string
    setEditingTask({ ...task, color: task.color ?? "#000000" });
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setIsEditorOpen(true);
  };

  return (
    <div className="mx-auto max-w-[1600px] h-[calc(100vh-6rem)] flex flex-col space-y-6">
      {/* Premium Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your workflow and priorities.</p>
        </div>

        <div className="flex items-center gap-3">
          <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "kanban" | "list")} className="hidden sm:inline-flex bg-background/50 border border-border/50 rounded-lg p-1 backdrop-blur-sm">
            <ToggleGroupItem value="kanban" aria-label="Kanban view" className="rounded-md data-[state=on]:bg-card data-[state=on]:shadow-sm">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view" className="rounded-md data-[state=on]:bg-card data-[state=on]:shadow-sm">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Button onClick={handleCreate} className="rounded-xl shadow-sm hover:shadow-md transition-all">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <TasksSkeleton />
        ) : (
          <KanbanBoard tasks={tasks || []} view={view} onTaskClick={handleEdit} />
        )}
      </div>

      <TaskEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        task={
          editingTask
            ? { ...editingTask, color: editingTask.color ?? "#000000" }
            : null
        }
      />
    </div>
  );
}