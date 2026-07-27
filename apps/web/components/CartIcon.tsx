import Link from 'next/link';

interface CartIconProps {
  count: number;
}

export function CartIcon({ count }: CartIconProps) {
  return (
    <Link href="/cart" className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-textPrimary transition hover:border-slate-300">
      🛒
      {count > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
