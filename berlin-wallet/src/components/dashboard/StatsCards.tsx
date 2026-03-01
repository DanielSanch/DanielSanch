'use client';

import Card from '@/components/ui/Card';
import { useTheme } from '@/lib/ThemeContext';
import { Users, CreditCard, TrendingUp, Repeat } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

interface StatsCardsProps {
  totalClients: number;
  totalInteractions: number;
  activeCards: number;
  retentionRate: number;
}

export default function StatsCards({ totalClients, totalInteractions, activeCards, retentionRate }: StatsCardsProps) {
  const { theme } = useTheme();

  const stats: Stat[] = [
    {
      label: 'Total Clientes',
      value: totalClients.toLocaleString(),
      change: '+12%',
      icon: <Users size={22} />,
      color: 'text-blue-400 bg-blue-400/10',
    },
    {
      label: 'Interacciones',
      value: totalInteractions.toLocaleString(),
      change: '+24%',
      icon: <TrendingUp size={22} />,
      color: 'text-green-400 bg-green-400/10',
    },
    {
      label: 'Tarjetas Activas',
      value: activeCards.toLocaleString(),
      change: '+8%',
      icon: <CreditCard size={22} />,
      color: 'text-berlin-gold bg-berlin-gold/10',
    },
    {
      label: 'Tasa de Retención',
      value: `${retentionRate}%`,
      change: '+5%',
      icon: <Repeat size={22} />,
      color: 'text-purple-400 bg-purple-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <span className="text-green-400 text-xs font-semibold bg-green-400/10 px-2 py-0.5 rounded-full">
              {stat.change}
            </span>
          </div>
          <p className={`text-2xl font-black ${
            theme === 'dark' ? 'text-white' : 'text-berlin-black'
          }`}>{stat.value}</p>
          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
          }`}>{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}
