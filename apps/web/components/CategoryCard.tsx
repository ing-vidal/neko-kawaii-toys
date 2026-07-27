import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
}

export function CategoryCard({ title, description, href }: CategoryCardProps) {
  return (
    <Link href={href} className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-2xl">✨</div>
      <h3 className="text-lg font-semibold text-textPrimary">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <span className="mt-4 inline-block text-sm font-semibold text-accent">Ver productos →</span>
    </Link>
  );
}
