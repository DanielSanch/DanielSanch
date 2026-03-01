'use client';

import { useEffect, useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import { useTheme } from '@/lib/ThemeContext';
import { auth } from '@/lib/firebase';
import { getLoyaltyCards, getClientCards, LoyaltyCard, ClientCard } from '@/lib/firestore';
import { BarChart3, TrendingUp, Users, CreditCard, Award, Calendar } from 'lucide-react';

export default function AnaliticaPage() {
  const { theme } = useTheme();
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [clients, setClients] = useState<ClientCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    Promise.all([
      getLoyaltyCards(uid),
      getClientCards(uid),
    ]).then(([c, cl]) => {
      setCards(c);
      setClients(cl);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const totalClients = clients.length;
    const totalInteractions = clients.reduce((acc, c) => acc + (c.interactions?.length || 0), 0);
    const activeClients = clients.filter(c => !c.isRedeemed).length;
    const redeemedClients = clients.filter(c => c.isRedeemed).length;
    const retentionRate = totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0;
    const avgProgress = totalClients > 0
      ? Math.round(clients.reduce((acc, c) => acc + (c.currentCount / c.requiredCount) * 100, 0) / totalClients)
      : 0;

    // Clients per card type
    const byType: Record<string, number> = {};
    clients.forEach(c => {
      byType[c.type] = (byType[c.type] || 0) + 1;
    });

    // Clients per card
    const byCard: Record<string, { name: string; count: number; color: string }> = {};
    clients.forEach(c => {
      if (!byCard[c.cardId]) {
        const card = cards.find(lc => lc.id === c.cardId);
        byCard[c.cardId] = { name: c.cardName, count: 0, color: card?.color || '#FFD700' };
      }
      byCard[c.cardId].count++;
    });

    // Interactions last 7 days
    const last7: number[] = Array(7).fill(0);
    const now = new Date();
    clients.forEach(c => {
      c.interactions?.forEach(int => {
        const d = new Date(int.date);
        const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
        if (diff >= 0 && diff < 7) last7[6 - diff]++;
      });
    });

    return {
      totalClients,
      totalInteractions,
      activeClients,
      redeemedClients,
      retentionRate,
      avgProgress,
      byType,
      byCard: Object.values(byCard).sort((a, b) => b.count - a.count),
      last7,
    };
  }, [cards, clients]);

  const typeLabels: Record<string, string> = {
    stamps: 'Sellos',
    points: 'Puntos',
    visits: 'Visitas',
    event: 'Eventos',
  };

  const typeColors: Record<string, string> = {
    stamps: '#FFD700',
    points: '#3B82F6',
    visits: '#10B981',
    event: '#8B5CF6',
  };

  const maxLast7 = Math.max(...stats.last7, 1);

  const dayLabels = Array(7).fill(0).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('es-CO', { weekday: 'short' });
  });

  if (loading) {
    return (
      <div className={`text-center py-20 ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>
        Cargando analíticas...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-black ${
          theme === 'dark' ? 'text-white' : 'text-berlin-black'
        }`}>Analíticas</h1>
        <p className={`text-sm mt-1 ${
          theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
        }`}>Métricas y reportes de tu programa de fidelización</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Clientes totales', value: stats.totalClients, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Interacciones', value: stats.totalInteractions, icon: BarChart3, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Tarjetas canjeadas', value: stats.redeemedClients, icon: Award, color: 'text-berlin-gold', bg: 'bg-berlin-gold/10' },
          { label: 'Retención', value: `${stats.retentionRate}%`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((kpi, i) => (
          <Card key={i}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <div>
                <p className={`text-2xl font-black ${
                  theme === 'dark' ? 'text-white' : 'text-berlin-black'
                }`}>{kpi.value}</p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                }`}>{kpi.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar chart - Last 7 days */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={18} className="text-berlin-gold" />
            <h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-berlin-black'}`}>
              Interacciones (últimos 7 días)
            </h2>
          </div>
          <div className="flex items-end gap-2 h-40">
            {stats.last7.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className={`text-xs font-medium ${
                  theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                }`}>{val}</span>
                <div
                  className="w-full rounded-t-lg bg-berlin-gold/80 transition-all hover:bg-berlin-gold"
                  style={{ height: `${Math.max((val / maxLast7) * 100, 4)}%` }}
                />
                <span className={`text-[10px] ${
                  theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                }`}>{dayLabels[i]}</span>
              </div>
            ))}
          </div>
          {stats.totalInteractions === 0 && (
            <p className={`text-center text-sm mt-4 ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>No hay interacciones recientes. ¡Empieza a escanear!</p>
          )}
        </Card>

        {/* Distribution by type */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <CreditCard size={18} className="text-berlin-gold" />
            <h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-berlin-black'}`}>
              Distribución por tipo
            </h2>
          </div>
          {Object.keys(stats.byType).length === 0 ? (
            <div className={`text-center py-8 ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>
              <p className="text-sm">Sin datos todavía</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(stats.byType).map(([type, count]) => {
                const pct = stats.totalClients > 0 ? Math.round((count / stats.totalClients) * 100) : 0;
                return (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-berlin-black'
                      }`}>{typeLabels[type] || type}</span>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                      }`}>{count} ({pct}%)</span>
                    </div>
                    <div className={`h-3 rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-berlin-dark' : 'bg-berlin-light'
                    }`}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: typeColors[type] || '#FFD700',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Avg progress */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-berlin-gold" />
            <h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-berlin-black'}`}>
              Progreso promedio
            </h2>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke={theme === 'dark' ? '#1c1f23' : '#e2e4e8'}
                  strokeWidth="12"
                />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(stats.avgProgress / 100) * 327} 327`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className={`text-3xl font-black ${
                    theme === 'dark' ? 'text-white' : 'text-berlin-black'
                  }`}>{stats.avgProgress}%</p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                  }`}>promedio</p>
                </div>
              </div>
            </div>
          </div>
          <p className={`text-center text-xs ${
            theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
          }`}>
            {stats.activeClients} clientes activos de {stats.totalClients} total
          </p>
        </Card>

        {/* Top cards */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Award size={18} className="text-berlin-gold" />
            <h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-berlin-black'}`}>
              Tarjetas más populares
            </h2>
          </div>
          {stats.byCard.length === 0 ? (
            <div className={`text-center py-8 ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>
              <p className="text-sm">Crea tarjetas y registra clientes para ver datos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.byCard.slice(0, 5).map((card, i) => (
                <div key={i} className={`flex items-center gap-3 py-2 ${
                  i < stats.byCard.length - 1 ? `border-b ${
                    theme === 'dark' ? 'border-berlin-dark-border' : 'border-berlin-light-border'
                  }` : ''
                }`}>
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold"
                    style={{ backgroundColor: card.color + '20', color: card.color }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${
                      theme === 'dark' ? 'text-white' : 'text-berlin-black'
                    }`}>{card.name}</p>
                  </div>
                  <span className={`text-sm font-bold ${
                    theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                  }`}>{card.count} clientes</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
