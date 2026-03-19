import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="space-y-6 text-center">
        <h1 className="text-5xl font-bold text-white">shadcn/ui Test</h1>
        
        <div className="flex gap-4 justify-center">
          <Button variant="default">Default Button</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
        </div>

        <p className="text-zinc-400">
          If you see nice modern buttons with hover effects, shadcn/ui is working perfectly.
        </p>
      </div>
    </div>
  );
}