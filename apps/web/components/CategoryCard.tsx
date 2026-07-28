import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
}

export function CategoryCard({ title, description, href }: CategoryCardProps) {
  return (
    <Link href={href} className="group rounded-[32px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_35px_rgba(248,200,220,0.18)] hover:bg-white">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-tr from-softPink/15 via-surface to-sky/20 border border-softPink/20 text-2xl">🌸</div>
      <h3 className="text-lg font-bold text-textPrimary">{title}</h3>
      <p className="mt-2 text-sm text-[#5D4E6D]/80 font-medium leading-6">{description}</p>
      <span className="mt-4 inline-block text-sm font-bold text-softPink group-hover:text-lavender transition-colors duration-200">Ver productos →</span>
    </Link>
  );
}
