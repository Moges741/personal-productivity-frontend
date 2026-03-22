export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-2 border-violet-500/20 animate-ping absolute inset-0" />
        <div className="w-20 h-20 rounded-full border-2 border-violet-500/40 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">✦</span>
        </div>
      </div>
    </div>
  );
}