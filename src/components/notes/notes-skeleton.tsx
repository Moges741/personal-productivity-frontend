import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function NotesSkeleton({ view }: { view: "grid" | "list" }) {
  return (
    <div className="space-y-8">
      <section>
        <Skeleton className="h-5 w-24 mb-4 bg-muted/50" />
        <div
          className={
            view === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "flex flex-col gap-3"
          }
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-2xl border border-border/40 bg-card/40 p-5",
                view === "grid" ? "flex flex-col h-56" : "flex items-center h-20 gap-4"
              )}
            >
              {view === "grid" ? (
                <>
                  <Skeleton className="h-6 w-3/4 mb-3 bg-muted/50" />
                  <Skeleton className="h-4 w-full mb-2 bg-muted/50" />
                  <Skeleton className="h-4 w-5/6 mb-2 bg-muted/50" />
                  <Skeleton className="h-4 w-4/6 bg-muted/50" />
                  <div className="mt-auto flex justify-between">
                    <Skeleton className="h-4 w-16 bg-muted/50" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2 bg-muted/50" />
                    <Skeleton className="h-4 w-96 bg-muted/50" />
                  </div>
                  <Skeleton className="h-4 w-16 bg-muted/50 shrink-0" />
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}