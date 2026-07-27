import Link from 'next/link';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ variant = 'primary', className = '', href, children, type = 'button', ...props }: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent';
  const variantStyles =
    variant === 'secondary'
      ? 'bg-white text-textPrimary border border-slate-200 hover:bg-slate-50'
      : variant === 'ghost'
      ? 'bg-transparent text-textPrimary hover:bg-slate-100'
      : 'bg-accent text-white shadow-soft hover:bg-[#6549ff]';

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
