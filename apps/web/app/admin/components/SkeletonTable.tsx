export function SkeletonTable({ rows = 8 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[2rem_3rem_1fr_6rem_6rem_5rem_5rem_5rem_7rem] gap-4 border-b border-slate-100 px-4 py-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-3 rounded bg-slate-200 animate-pulse" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[2rem_3rem_1fr_6rem_6rem_5rem_5rem_5rem_7rem] gap-4 border-b border-slate-50 px-4 py-4 last:border-0"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="h-4 w-4 rounded bg-slate-100 animate-pulse" />
          <div className="h-9 w-9 rounded-lg bg-slate-100 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-3/4 rounded bg-slate-100 animate-pulse" />
            <div className="h-3 w-1/3 rounded bg-slate-50 animate-pulse" />
          </div>
          {Array.from({ length: 6 }).map((_, j) => (
            <div key={j} className="h-4 rounded bg-slate-100 animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/3 rounded bg-slate-100" />
              <div className="h-5 w-1/2 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
