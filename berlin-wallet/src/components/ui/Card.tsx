'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/lib/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const { theme } = useTheme();

  const base = theme === 'dark'
    ? 'bg-berlin-dark-card border border-berlin-dark-border'
    : 'bg-berlin-light-card border border-berlin-light-border shadow-sm';

  const hoverClass = hover
    ? theme === 'dark'
      ? 'hover:border-berlin-gold/40 hover:shadow-lg hover:shadow-berlin-gold/5 transition-all duration-300'
      : 'hover:border-berlin-gold hover:shadow-md transition-all duration-300'
    : '';

  return (
    <div className={`rounded-2xl p-6 ${base} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
