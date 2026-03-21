import { Skeleton } from "@/components/ui/skeleton";

export function GoalsSkeleton() {
  return (
    <div className="space-y-8">
      {/* mimic pinned + all sections */}
      <section className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-3 flex-1">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <Skeleton className="h-14 w-14 rounded-full" />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-3 flex-1">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
                <Skeleton className="h-14 w-14 rounded-full" />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}