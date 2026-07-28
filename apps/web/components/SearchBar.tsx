'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="rounded-[32px] border border-softPink/30 bg-white/80 backdrop-blur-sm px-5 py-3.5 shadow-soft transition-all duration-300 focus-within:border-softPink/80 focus-within:bg-white focus-within:shadow-[0_8px_24px_rgba(248,200,220,0.18)]">
      <label className="sr-only" htmlFor="search-query">
        Buscar productos
      </label>
      <div className="flex items-center gap-3">
        <span className="text-lg text-softPink select-none">🔍</span>
        <input
          id="search-query"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Busca figuras, peluches y accesorios kawaii..."
          className="w-full bg-transparent text-sm text-textPrimary outline-none placeholder:text-[#8C84A2]/60 font-medium"
        />
      </div>
    </div>
  );
}
