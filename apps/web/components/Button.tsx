import Link from 'next/link';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ variant = 'primary', className = '', href, children, type = 'button', ...props }: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-softPink/40';
  const variantStyles =
    variant === 'secondary'
      ? 'bg-white/80 backdrop-blur-sm text-textPrimary border border-softPink/40 shadow-sm hover:bg-softPink/10 hover:border-softPink/60 hover:scale-[1.03] active:scale-95'
      : variant === 'ghost'
      ? 'bg-transparent text-textPrimary hover:bg-softPink/15 hover:scale-[1.02] active:scale-97'
      : 'bg-gradient-to-r from-softPink to-lavender text-textPrimary border border-white/60 shadow-soft hover:shadow-[0_8px_20px_rgba(248,200,220,0.35)] hover:scale-[1.03] active:scale-95';

  const classNames = `${baseStyles} ${variantStyles} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classNames} {...props}>
      {children}
    </button>
  );
}
