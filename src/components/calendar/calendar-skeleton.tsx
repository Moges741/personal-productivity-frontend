import { Skeleton } from "@/components/ui/skeleton";

export function CalendarSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="p-3 border-r border-border last:border-r-0">
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: 42 }).map((_, i) => (
          <div key={i} className="h-28 p-3 border-r border-border border-b last:border-r-0">
            <Skeleton className="h-4 w-10 mb-3" />
            <Skeleton className="h-5 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4 rounded-lg mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}