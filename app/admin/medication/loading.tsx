export default function Loading() {
  return (
    <div className="container mx-auto px-10 space-y-6">
      <div className="flex flex-col gap-2">
        <div className="h-9 w-52 rounded-md bg-slate-200 animate-pulse" />
        <div className="h-4 w-80 rounded bg-slate-100 animate-pulse" />
      </div>
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="h-4 w-1/4 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-slate-200 animate-pulse" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b border-slate-100 last:border-0">
            <div className="h-4 w-1/4 rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-1/4 rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-1/4 rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-1/4 rounded bg-slate-100 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
