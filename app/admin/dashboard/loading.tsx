export default function Loading() {
  return (
    <div className="container mx-auto px-10 space-y-6">
      {/* Stats row skeleton */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 p-5 space-y-2">
            <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
            <div className="h-8 w-16 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-32 rounded bg-slate-100 animate-pulse" />
          </div>
        ))}
      </div>
      {/* Chart / content skeleton */}
      <div className="rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
        <div className="h-48 w-full rounded-lg bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}
