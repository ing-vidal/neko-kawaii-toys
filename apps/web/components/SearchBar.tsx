'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white px-4 py-3 shadow-soft sm:px-5">
      <label className="sr-only" htmlFor="search-query">
        Buscar productos
      </label>
      <div className="flex items-center gap-3">
        <span className="text-xl">🔎</span>
        <input
          id="search-query"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Busca figuras, peluches y accesorios kawaii"
          className="w-full bg-transparent text-sm text-textPrimary outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
