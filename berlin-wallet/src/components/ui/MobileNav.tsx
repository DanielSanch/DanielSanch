'use client';

import { Home, Sparkles, Plus, CreditCard, MessageCircle, LayoutDashboard, Users, ScanLine, BarChart3 } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isCenter?: boolean;
}

interface MobileNavProps {
  mode: 'landing' | 'dashboard';
  activeSection?: string;
  onNavigate: (href: string) => void;
}

export default function MobileNav({ mode, activeSection, onNavigate }: MobileNavProps) {
  const { theme } = useTheme();

  const landingItems: NavItem[] = [
    { icon: <Home size={20} />, label: 'Inicio', href: '#hero' },
    { icon: <Sparkles size={20} />, label: 'Features', href: '#features' },
    { icon: <Plus size={22} />, label: 'Empezar', href: '#cta', isCenter: true },
    { icon: <CreditCard size={20} />, label: 'Precios', href: '#pricing' },
    { icon: <MessageCircle size={20} />, label: 'Contacto', href: '#footer' },
  ];

  const dashboardItems: NavItem[] = [
    { icon: <LayoutDashboard size={20} />, label: 'Inicio', href: '/dashboard' },
    { icon: <CreditCard size={20} />, label: 'Tarjetas', href: '/dashboard/tarjetas' },
    { icon: <ScanLine size={22} />, label: 'Escanear', href: '/dashboard/scanner', isCenter: true },
    { icon: <Users size={20} />, label: 'Clientes', href: '/dashboard/clientes' },
    { icon: <BarChart3 size={20} />, label: 'Analíticas', href: '/dashboard/analitica' },
  ];

  const items = mode === 'landing' ? landingItems : dashboardItems;

  const bgClass = theme === 'dark'
    ? 'bg-berlin-black/90 border-t border-berlin-dark-border'
    : 'bg-white/90 border-t border-berlin-light-border';

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl ${bgClass} md:hidden`}>
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {items.map((item) => {
          const isActive = activeSection === item.href;
          return (
            <button
              key={item.href}
              onClick={() => onNavigate(item.href)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 ${
                item.isCenter
                  ? 'bg-berlin-gold text-berlin-black -mt-5 rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-berlin-gold/30'
                  : isActive
                    ? 'text-berlin-gold'
                    : theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
              }`}
            >
              {item.icon}
              {!item.isCenter && (
                <span className="text-[10px] font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
