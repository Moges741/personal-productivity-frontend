import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <main className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        You are authenticated. Welcome back.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["Notes", "Tasks", "Habits", "Calendar"].map((item) => (
          <Card key={item} className="rounded-2xl border-border/60 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm">{item}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">0</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}