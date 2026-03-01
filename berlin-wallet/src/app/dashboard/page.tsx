'use client';

import { useEffect, useState } from 'react';
import StatsCards from '@/components/dashboard/StatsCards';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useTheme } from '@/lib/ThemeContext';
import { auth } from '@/lib/firebase';
import { getLoyaltyCards, getClientCards, LoyaltyCard, ClientCard } from '@/lib/firestore';
import { CreditCard, ScanLine, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { theme } = useTheme();
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [clients, setClients] = useState<ClientCard[]>([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    getLoyaltyCards(uid).then(setCards).catch(() => {});
    getClientCards(uid).then(setClients).catch(() => {});
  }, []);

  const totalInteractions = clients.reduce((acc, c) => acc + (c.interactions?.length || 0), 0);
  const activeClients = clients.filter(c => !c.isRedeemed).length;
  const retentionRate = clients.length > 0 ? Math.round((activeClients / clients.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-black ${
          theme === 'dark' ? 'text-white' : 'text-berlin-black'
        }`}>Dashboard</h1>
        <p className={`text-sm mt-1 ${
          theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
        }`}>Resumen de tu programa de fidelización</p>
      </div>

      <StatsCards
        totalClients={clients.length}
        totalInteractions={totalInteractions}
        activeCards={cards.filter(c => c.isActive).length}
        retentionRate={retentionRate}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a href="/dashboard/tarjetas">
          <Card hover className="cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-berlin-gold/10 flex items-center justify-center text-berlin-gold group-hover:scale-110 transition-transform">
                <CreditCard size={24} />
              </div>
              <div>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-berlin-black'}`}>
                  Crear tarjeta
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>
                  Nueva tarjeta de fidelización
                </p>
              </div>
            </div>
          </Card>
        </a>

        <a href="/dashboard/scanner">
          <Card hover className="cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                <ScanLine size={24} />
              </div>
              <div>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-berlin-black'}`}>
                  Escanear
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>
                  Registrar interacción
                </p>
              </div>
            </div>
          </Card>
        </a>

        <a href="/dashboard/clientes">
          <Card hover className="cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-berlin-black'}`}>
                  Ver clientes
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>
                  {clients.length} clientes registrados
                </p>
              </div>
            </div>
          </Card>
        </a>
      </div>

      {/* Recent activity */}
      <Card>
        <h2 className={`text-lg font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-berlin-black'
        }`}>Actividad reciente</h2>
        {clients.length === 0 ? (
          <div className={`text-center py-8 ${
            theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
          }`}>
            <p className="text-sm">No hay actividad reciente.</p>
            <p className="text-xs mt-1">Crea tu primera tarjeta y empieza a fidelizar clientes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.slice(0, 5).map((client) => (
              <div key={client.id} className={`flex items-center justify-between py-2 border-b ${
                theme === 'dark' ? 'border-berlin-dark-border' : 'border-berlin-light-border'
              }`}>
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-berlin-black'
                  }`}>{client.clientName}</p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                  }`}>{client.cardName} - {client.currentCount}/{client.requiredCount}</p>
                </div>
                <span className={`text-xs ${
                  client.isRedeemed ? 'text-berlin-gold' : 'text-green-400'
                }`}>
                  {client.isRedeemed ? 'Canjeado' : 'Activo'}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
