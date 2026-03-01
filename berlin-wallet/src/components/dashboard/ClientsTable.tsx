'use client';

import { useTheme } from '@/lib/ThemeContext';
import { ClientCard } from '@/lib/firestore';

interface ClientsTableProps {
  clients: ClientCard[];
  onSelect?: (client: ClientCard) => void;
}

export default function ClientsTable({ clients, onSelect }: ClientsTableProps) {
  const { theme } = useTheme();

  const getStatusBadge = (client: ClientCard) => {
    if (client.type === 'event' && client.isRegistered) {
      return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">Registrado</span>;
    }
    if (client.isRedeemed) {
      return <span className="text-xs px-2 py-0.5 rounded-full bg-berlin-gold/10 text-berlin-gold font-medium">Canjeado</span>;
    }
    return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">Activo</span>;
  };

  const getProgress = (client: ClientCard) => {
    const pct = Math.round((client.currentCount / client.requiredCount) * 100);
    return (
      <div className="flex items-center gap-2">
        <div className={`w-16 h-1.5 rounded-full ${theme === 'dark' ? 'bg-berlin-dark-border' : 'bg-berlin-light-border'}`}>
          <div
            className="h-full rounded-full bg-berlin-gold transition-all"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <span className="text-xs">{client.currentCount}/{client.requiredCount}</span>
      </div>
    );
  };

  if (clients.length === 0) {
    return (
      <div className={`text-center py-12 ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>
        <p className="text-lg font-semibold mb-2">Sin clientes aún</p>
        <p className="text-sm">Los clientes aparecerán aquí cuando escaneen su primera tarjeta.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`text-xs font-medium uppercase tracking-wider ${
            theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
          }`}>
            <th className="text-left py-3 px-4">Cliente</th>
            <th className="text-left py-3 px-4">Tarjeta</th>
            <th className="text-left py-3 px-4">Progreso</th>
            <th className="text-left py-3 px-4">Estado</th>
            <th className="text-left py-3 px-4">Última interacción</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              onClick={() => onSelect?.(client)}
              className={`border-t cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'border-berlin-dark-border hover:bg-white/5'
                  : 'border-berlin-light-border hover:bg-black/5'
              }`}
            >
              <td className="py-3 px-4">
                <p className={`font-semibold text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-berlin-black'
                }`}>{client.clientName}</p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                }`}>{client.clientEmail}</p>
              </td>
              <td className="py-3 px-4">
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-berlin-black'
                }`}>{client.cardName}</span>
              </td>
              <td className="py-3 px-4">{getProgress(client)}</td>
              <td className="py-3 px-4">{getStatusBadge(client)}</td>
              <td className={`py-3 px-4 text-xs ${
                theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
              }`}>
                {client.interactions?.length > 0
                  ? new Date(client.interactions[client.interactions.length - 1].date).toLocaleDateString('es-CO')
                  : 'Sin interacciones'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
