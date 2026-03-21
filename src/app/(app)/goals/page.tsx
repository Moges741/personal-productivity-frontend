"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, LayoutGrid, List, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";

import { getGoals, type Goal } from "@/lib/api/goals";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalEditor } from "@/components/goals/goal-editor";
import { GoalsEmpty } from "@/components/goals/goals-empty";
import { GoalsSkeleton } from "@/components/goals/goals-skeleton";
import { GoalsTimeline } from "@/components/goals/goals-timeline";

export default function GoalsPage() {
  const [view, setView] = useState<"grid" | "timeline">("grid");
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["goals"],
    queryFn: getGoals,
  });

  const goals = data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return goals;
    return goals.filter((g) => {
      return (
        g.title.toLowerCase().includes(q) ||
        (g.description ?? "").toLowerCase().includes(q) ||
        (g.category ?? "other").toLowerCase().includes(q) ||
        (g.status ?? "not_started").toLowerCase().includes(q)
      );
    });
  }, [goals, query]);

  const pinned = filtered.filter((g) => g.isPinned);
  const rest = filtered.filter((g) => !g.isPinned);

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const openEdit = (goal: Goal) => {
    setEditing(goal);
    setEditorOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-border bg-background shadow-sm"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-300/45 via-fuchsia-300/20 to-indigo-300/30 blur-3xl dark:from-amber-500/20 dark:via-fuchsia-500/15 dark:to-indigo-500/20" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-300/30 via-cyan-300/20 to-blue-300/30 blur-3xl dark:from-emerald-500/15 dark:via-cyan-500/10 dark:to-blue-500/15" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.85),transparent_55%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Aspirational planning · gentle momentum
              </div>

              <h1
                className="text-3xl sm:text-4xl font-semibold tracking-tight"
                style={{
                  fontFamily:
                    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, "Helvetica Neue", Arial',
                }}
              >
                Goals that feel inevitable.
              </h1>

              <p className="max-w-2xl text-sm text-muted-foreground">
                Set a direction. Make progress visible. Celebrate the moments that matter.
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-3">
              <div className="flex items-center gap-2">
                <ToggleGroup
                  type="single"
                  value={view}
                  onValueChange={(v) => v && setView(v as "grid" | "timeline")}
                  className="bg-background/70 border border-border/70 rounded-xl p-1 backdrop-blur"
                >
                  <ToggleGroupItem value="grid" aria-label="Grid view" className="rounded-lg data-[state=on]:bg-card data-[state=on]:shadow-sm">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="timeline" aria-label="Timeline view" className="rounded-lg data-[state=on]:bg-card data-[state=on]:shadow-sm">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>

                <Button onClick={openCreate} className="rounded-xl shadow-sm hover:shadow-md transition-all">
                  <Plus className="mr-2 h-4 w-4" />
                  New Goal
                </Button>
              </div>

              <div className="w-full sm:w-[360px]">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search goals, categories, status…"
                  aria-label="Search goals"
                  className="rounded-xl bg-background/80"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CONTENT */}
      {isLoading ? (
        <GoalsSkeleton />
      ) : isError ? (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium">Something went wrong loading goals.</p>
          <p className="mt-1 text-sm text-muted-foreground">Try again.</p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => refetch()} variant="secondary">Retry</Button>
            <Button onClick={openCreate}>Create a goal</Button>
          </div>
        </div>
      ) : goals.length === 0 ? (
        <GoalsEmpty onCreate={openCreate} />
      ) : view === "timeline" ? (
        <GoalsTimeline goals={filtered} onOpenGoal={openEdit} />
      ) : (
        <div className="space-y-8">
          {pinned.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Pinned</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pinned.map((g) => <GoalCard key={g.id} goal={g} onOpen={() => openEdit(g)} />)}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">All goals</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((g) => <GoalCard key={g.id} goal={g} onOpen={() => openEdit(g)} />)}
              </div>
            </section>
          )}
        </div>
      )}

      <GoalEditor isOpen={editorOpen} onClose={() => setEditorOpen(false)} goal={editing} />
    </div>
  );
}