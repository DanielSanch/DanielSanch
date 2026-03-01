'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '@/lib/ThemeContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const { theme } = useTheme();

  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-berlin-gold/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-berlin-gold text-berlin-black hover:bg-berlin-gold-light shadow-lg shadow-berlin-gold/20',
    secondary: theme === 'dark'
      ? 'bg-berlin-dark-card text-white border border-berlin-dark-border hover:border-berlin-gold/50'
      : 'bg-white text-berlin-black border border-berlin-light-border hover:border-berlin-gold',
    ghost: theme === 'dark'
      ? 'text-berlin-gray hover:text-white hover:bg-white/5'
      : 'text-berlin-light-gray hover:text-berlin-black hover:bg-black/5',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3.5 text-base gap-2',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
