import { Skeleton } from "@/components/ui/skeleton";

export function TasksSkeleton() {
  return (
    <div className="flex h-full gap-6 overflow-hidden">
      {[1, 2, 3].map((col) => (
        <div key={col} className="flex min-w-[320px] max-w-[320px] flex-col rounded-2xl bg-muted/20 p-4">
          <Skeleton className="h-5 w-24 mb-6 bg-muted/50" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((card) => (
              <Skeleton key={card} className="h-32 w-full rounded-xl bg-card/40 border border-border/20" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}