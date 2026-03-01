'use client';

import { useState, useEffect } from 'react';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { useTheme } from '@/lib/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Características', href: '#features' },
    { label: 'Industrias', href: '#industries' },
    { label: 'Precios', href: '#pricing' },
    { label: 'Cómo funciona', href: '#how-it-works' },
  ];

  const bgClass = scrolled
    ? theme === 'dark'
      ? 'bg-berlin-dark/80 backdrop-blur-xl border-b border-berlin-dark-border'
      : 'bg-white/80 backdrop-blur-xl border-b border-berlin-light-border'
    : 'bg-transparent';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'text-berlin-gray hover:text-white'
                    : 'text-berlin-light-gray hover:text-berlin-black'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'text-berlin-gray hover:text-white' : 'text-berlin-light-gray hover:text-berlin-black'
              }`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Iniciar sesión</Button>
            </a>
            <a href="/registro">
              <Button size="sm" className="hidden sm:inline-flex">Empezar gratis</Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
