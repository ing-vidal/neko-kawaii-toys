export function LoadingSkeleton() {
  return (
    <div className="animate-pulse rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="h-48 rounded-3xl bg-slate-100" />
      <div className="mt-5 space-y-4">
        <div className="h-4 w-2/5 rounded-full bg-slate-100" />
        <div className="h-4 w-3/5 rounded-full bg-slate-100" />
        <div className="h-10 w-full rounded-3xl bg-slate-100" />
      </div>
    </div>
  );
}
