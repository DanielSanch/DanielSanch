'use client';

import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { useTheme } from '@/lib/ThemeContext';
import { LayoutDashboard, CreditCard, Users, ScanLine, BarChart3, Settings, LogOut, Sun, Moon } from 'lucide-react';

interface SidebarProps {
  businessName: string;
  onLogout: () => void;
}

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Inicio', href: '/dashboard' },
  { icon: <CreditCard size={20} />, label: 'Tarjetas', href: '/dashboard/tarjetas' },
  { icon: <ScanLine size={20} />, label: 'Escáner', href: '/dashboard/scanner' },
  { icon: <Users size={20} />, label: 'Clientes', href: '/dashboard/clientes' },
  { icon: <BarChart3 size={20} />, label: 'Analíticas', href: '/dashboard/analitica' },
  { icon: <Settings size={20} />, label: 'Ajustes', href: '/dashboard/ajustes' },
];

export default function Sidebar({ businessName, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={`hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 p-4 ${
      theme === 'dark'
        ? 'bg-berlin-dark-card border-r border-berlin-dark-border'
        : 'bg-white border-r border-berlin-light-border'
    }`}>
      <div className="mb-8 px-2">
        <Logo />
      </div>

      <div className={`px-3 py-2 rounded-xl mb-6 ${
        theme === 'dark' ? 'bg-berlin-dark' : 'bg-berlin-light'
      }`}>
        <p className={`text-xs ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>Tu negocio</p>
        <p className={`font-semibold text-sm truncate ${
          theme === 'dark' ? 'text-white' : 'text-berlin-black'
        }`}>{businessName}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-berlin-gold/10 text-berlin-gold'
                  : theme === 'dark'
                    ? 'text-berlin-gray hover:text-white hover:bg-white/5'
                    : 'text-berlin-light-gray hover:text-berlin-black hover:bg-black/5'
              }`}
            >
              {item.icon}
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="space-y-1 pt-4 border-t border-berlin-dark-border">
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-colors ${
            theme === 'dark' ? 'text-berlin-gray hover:text-white hover:bg-white/5' : 'text-berlin-light-gray hover:text-berlin-black hover:bg-black/5'
          }`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-colors"
        >
          <LogOut size={20} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
