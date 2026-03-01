'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import ClientsTable from '@/components/dashboard/ClientsTable';
import LoyaltyCardPreview from '@/components/dashboard/LoyaltyCardPreview';
import { useTheme } from '@/lib/ThemeContext';
import { auth } from '@/lib/firebase';
import { getClientCards, ClientCard } from '@/lib/firestore';
import { Search, X } from 'lucide-react';

export default function ClientesPage() {
  const { theme } = useTheme();
  const [clients, setClients] = useState<ClientCard[]>([]);
  const [filtered, setFiltered] = useState<ClientCard[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ClientCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    getClientCards(uid).then((data) => {
      setClients(data);
      setFiltered(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(clients);
    } else {
      const lower = search.toLowerCase();
      setFiltered(clients.filter(c =>
        c.clientName.toLowerCase().includes(lower) ||
        c.cardName.toLowerCase().includes(lower)
      ));
    }
  }, [search, clients]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-black ${
          theme === 'dark' ? 'text-white' : 'text-berlin-black'
        }`}>Clientes</h1>
        <p className={`text-sm mt-1 ${
          theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
        }`}>{clients.length} clientes registrados en tu programa</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
            theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
          }`} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o tarjeta..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            {loading ? (
              <div className={`text-center py-12 ${
                theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
              }`}>Cargando clientes...</div>
            ) : (
              <ClientsTable clients={filtered} onSelect={setSelected} />
            )}
          </Card>
        </div>

        <div>
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                }`}>Detalle del cliente</p>
                <button onClick={() => setSelected(null)}>
                  <X size={16} className="text-berlin-gray" />
                </button>
              </div>
              <LoyaltyCardPreview
                cardName={selected.cardName}
                businessName=""
                clientName={selected.clientName}
                type={selected.type}
                requiredCount={selected.requiredCount}
                currentCount={selected.currentCount}
                color="#FFD700"
                reward=""
                cardId={selected.id}
                isRegistered={selected.isRegistered}
              />
              <Card>
                <h3 className={`font-bold text-sm mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-berlin-black'
                }`}>Historial</h3>
                {selected.interactions?.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selected.interactions.map((int, i) => (
                      <div key={i} className={`text-xs py-1.5 border-b ${
                        theme === 'dark' ? 'border-berlin-dark-border text-berlin-gray' : 'border-berlin-light-border text-berlin-light-gray'
                      }`}>
                        <span>{new Date(int.date).toLocaleString('es-CO')}</span>
                        {int.note && <span className="ml-2 opacity-70">- {int.note}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                  }`}>Sin interacciones registradas</p>
                )}
              </Card>
            </div>
          ) : (
            <div className={`flex items-center justify-center h-48 rounded-2xl border-2 border-dashed ${
              theme === 'dark' ? 'border-berlin-dark-border' : 'border-berlin-light-border'
            }`}>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
              }`}>Selecciona un cliente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
