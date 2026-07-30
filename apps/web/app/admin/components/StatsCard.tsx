interface StatsCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'pink' | 'lavender' | 'sky' | 'emerald' | 'rose';
  description?: string;
}

const colorMap = {
  pink: {
    bg: 'bg-softPink/20',
    icon: 'bg-softPink text-white',
    border: 'border-softPink/30',
    value: 'text-slate-800',
  },
  lavender: {
    bg: 'bg-lavender/20',
    icon: 'bg-lavender text-white',
    border: 'border-lavender/30',
    value: 'text-slate-800',
  },
  sky: {
    bg: 'bg-sky/20',
    icon: 'bg-sky text-slate-600',
    border: 'border-sky/40',
    value: 'text-slate-800',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-500 text-white',
    border: 'border-emerald-100',
    value: 'text-slate-800',
  },
  rose: {
    bg: 'bg-rose-50',
    icon: 'bg-rose-500 text-white',
    border: 'border-rose-100',
    value: 'text-slate-800',
  },
};

export function StatsCard({ label, value, icon, color, description }: StatsCardProps) {
  const c = colorMap[color];
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-5 flex items-center gap-4`}>
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl shadow-sm ${c.icon}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <p className={`text-2xl font-bold leading-tight mt-0.5 ${c.value}`}>{value}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5 truncate">{description}</p>}
      </div>
    </div>
  );
}
