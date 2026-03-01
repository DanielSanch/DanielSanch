'use client';

import { InputHTMLAttributes } from 'react';
import { useTheme } from '@/lib/ThemeContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  const { theme } = useTheme();

  const inputClass = theme === 'dark'
    ? 'bg-berlin-dark border border-berlin-dark-border text-white placeholder-berlin-gray focus:border-berlin-gold'
    : 'bg-white border border-berlin-light-border text-berlin-black placeholder-berlin-light-gray focus:border-berlin-gold';

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-berlin-gold/30 ${inputClass} ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
