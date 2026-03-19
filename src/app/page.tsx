import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Notes, tasks, habits, goals, and calendar in one place",
  "Fast keyboard-first UX with clean navigation",
  "Beautiful light/dark mode with smooth transitions",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          Personal Productivity SaaS
        </div>

        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Organize your life with one elegant productivity dashboard.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
          Capture notes, plan tasks, track habits, manage goals, and stay on top of
          your calendar — all in one premium workspace.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/dashboard" aria-label="Go to dashboard">
              Enter Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="rounded-xl">
            <Link href="/notes" aria-label="Go to notes">
              Open Notes
            </Link>
          </Button>
        </div>

        <ul className="mt-10 grid w-full max-w-3xl gap-3 text-left sm:grid-cols-1 md:grid-cols-3">
          {features.map((feature) => (
            <li
              key={feature}
              className="rounded-2xl border border-border/60 bg-card/60 p-4 text-sm text-muted-foreground backdrop-blur-sm"
            >
              <div className="mb-2 flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Included</span>
              </div>
              {feature}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}