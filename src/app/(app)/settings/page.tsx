import { Suspense } from 'react';
import { SettingsShell } from './components/SettingsShell';

export const metadata = {
  title: 'Your Evolution — Evolve',
  description: 'See who you were, who you are, and who you are becoming.',
};

export default function SettingsPage() {
  return (
    <Suspense fallback={<EvolutionSkeleton />}>
      <SettingsShell />
    </Suspense>
  );
}

function EvolutionSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-violet-500/20 animate-ping absolute inset-0" />
          <div className="w-24 h-24 rounded-full border-2 border-violet-500/30 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            ✦
          </div>
        </div>
        <div className="space-y-3 text-center">
          <div className="w-48 h-4 rounded-full bg-muted animate-pulse mx-auto" />
          <div className="w-32 h-3 rounded-full bg-muted animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}