"use client";

import { useMemo, useState } from "react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Circle, Clock, CheckCircle2 } from "lucide-react";
import { TaskCard } from "./tasks-card";
import { updateTask, type Task, type TaskStatus } from "@/lib/api/tasks";

const COLUMNS: { id: TaskStatus; label: string; icon: any; color: string }[] = [
  { id: "todo", label: "To Do", icon: Circle, color: "text-slate-500" },
  { id: "in_progress", label: "In Progress", icon: Clock, color: "text-blue-500" },
  { id: "done", label: "Done", icon: CheckCircle2, color: "text-emerald-500" },
];

export function KanbanBoard({ tasks, view, onTaskClick }: { tasks: Task[], view: "kanban" | "list", onTaskClick: (t: Task) => void }) {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const activeTask = useMemo(() => tasks.find((t) => t.id === activeId), [activeId, tasks]);

  const mutateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => updateTask(id, { status }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Check if dropping on a column OR another task
    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    const targetStatus = isOverColumn ? (overId as TaskStatus) : tasks.find((t) => t.id === overId)?.status;

    if (targetStatus && task.status !== targetStatus) {
      queryClient.setQueryData(["tasks"], (old: Task[]) => 
        old.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
      );
      mutateStatus.mutate({ id: taskId, status: targetStatus });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={(e) => setActiveId(e.active.id as string)} onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-6 overflow-x-auto pb-4 pt-2 hide-scrollbar">
        {COLUMNS.map((col) => (
          <DroppableColumn 
            key={col.id} 
            col={col} 
            tasks={tasks.filter((t) => t.status === col.id)} 
            onTaskClick={onTaskClick} 
          />
        ))}
      </div>
      <DragOverlay>{activeTask ? <TaskCard task={activeTask} isDragging /> : null}</DragOverlay>
    </DndContext>
  );
}

// NEW: This component makes empty lanes work!
function DroppableColumn({ col, tasks, onTaskClick }: { col: typeof COLUMNS[0], tasks: Task[], onTaskClick: (t: Task) => void }) {
  const { setNodeRef } = useDroppable({ id: col.id });
  const Icon = col.icon;

  return (
    <div className="flex min-w-[340px] max-w-[340px] flex-col rounded-xl bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${col.color}`} />
          <h3 className="font-semibold text-sm tracking-tight">{col.label}</h3>
          <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-muted-foreground ml-1">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-3 min-h-[200px]" id={col.id}>
          {tasks.map((task) => (
            <SortableItem key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableItem({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick} className="touch-none outline-none">
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
}