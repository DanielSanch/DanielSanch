'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoyaltyCardPreview from '@/components/dashboard/LoyaltyCardPreview';
import { useTheme } from '@/lib/ThemeContext';
import { auth } from '@/lib/firebase';
import {
  searchClientsByName,
  getClientCardById,
  addInteraction,
  markEventRegistered,
  getClientCards,
  getLoyaltyCards,
  createClientCard,
  ClientCard,
  LoyaltyCard,
} from '@/lib/firestore';
import { ScanLine, Search, UserPlus, Check, Star, AlertTriangle } from 'lucide-react';

export default function ScannerPage() {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'scan' | 'search' | 'new'>('scan');
  const [qrInput, setQrInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ClientCard[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientCard | null>(null);
  const [loyaltyCards, setLoyaltyCards] = useState<LoyaltyCard[]>([]);
  const [result, setResult] = useState<{ type: 'success' | 'redeemed' | 'registered' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // New client form
  const [newClient, setNewClient] = useState({ name: '', email: '', cardId: '' });

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      getLoyaltyCards(uid).then(setLoyaltyCards).catch(() => {});
    }
  }, []);

  const handleQrScan = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !qrInput) return;
    setLoading(true);
    setResult(null);

    try {
      // Parse QR: "berlin-wallet:{clientCardId}"
      const cardId = qrInput.replace('berlin-wallet:', '');
      const client = await getClientCardById(uid, cardId);

      if (!client) {
        setResult({ type: 'error', message: 'Tarjeta no encontrada. Verifica el código QR.' });
        setLoading(false);
        return;
      }

      setSelectedClient(client);

      if (client.type === 'event') {
        if (client.isRegistered) {
          setResult({ type: 'error', message: 'Esta entrada ya fue registrada.' });
        } else {
          await markEventRegistered(uid, client.id!);
          setSelectedClient({ ...client, isRegistered: true });
          setResult({ type: 'registered', message: `${client.clientName} registrado exitosamente para el evento.` });
        }
      } else {
        if (client.isRedeemed) {
          setResult({ type: 'redeemed', message: `${client.clientName} ya canjeó esta tarjeta. ¡Hora de darle una nueva!` });
        } else {
          const { newCount, isRedeemed } = await addInteraction(uid, client.id!, client, 'Escaneo QR');
          setSelectedClient({ ...client, currentCount: newCount, isRedeemed });
          if (isRedeemed) {
            setResult({ type: 'redeemed', message: `¡${client.clientName} completó la tarjeta! Recompensa: ${client.cardName}` });
          } else {
            setResult({ type: 'success', message: `+1 para ${client.clientName}. ${newCount}/${client.requiredCount}` });
          }
        }
      }
    } catch {
      setResult({ type: 'error', message: 'Error al procesar. Intenta de nuevo.' });
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !searchQuery) return;
    setLoading(true);
    try {
      const results = await searchClientsByName(uid, searchQuery);
      setSearchResults(results);
    } catch {
      // Handle error
    }
    setLoading(false);
  };

  const handleSelectClient = async (client: ClientCard) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setSelectedClient(client);
    setResult(null);
    setLoading(true);

    try {
      if (client.type === 'event') {
        if (!client.isRegistered) {
          await markEventRegistered(uid, client.id!);
          setSelectedClient({ ...client, isRegistered: true });
          setResult({ type: 'registered', message: `${client.clientName} registrado para el evento.` });
        } else {
          setResult({ type: 'error', message: 'Ya registrado anteriormente.' });
        }
      } else if (!client.isRedeemed) {
        const { newCount, isRedeemed } = await addInteraction(uid, client.id!, client, 'Búsqueda manual');
        setSelectedClient({ ...client, currentCount: newCount, isRedeemed });
        if (isRedeemed) {
          setResult({ type: 'redeemed', message: `¡Tarjeta completada! Recompensa lista.` });
        } else {
          setResult({ type: 'success', message: `+1 registrado. ${newCount}/${client.requiredCount}` });
        }
      }
    } catch {
      setResult({ type: 'error', message: 'Error al registrar interacción.' });
    }
    setLoading(false);
  };

  const handleNewClient = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !newClient.name || !newClient.cardId) return;
    setLoading(true);

    const card = loyaltyCards.find(c => c.id === newClient.cardId);
    if (!card) return;

    try {
      await createClientCard(uid, {
        clientName: newClient.name,
        clientEmail: newClient.email,
        cardId: card.id!,
        cardName: card.name,
        currentCount: 0,
        requiredCount: card.requiredCount,
        type: card.type,
        isRedeemed: false,
        isRegistered: false,
        interactions: [],
      });
      setResult({ type: 'success', message: `${newClient.name} registrado con tarjeta ${card.name}` });
      setNewClient({ name: '', email: '', cardId: '' });
    } catch {
      setResult({ type: 'error', message: 'Error al crear cliente.' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-black ${
          theme === 'dark' ? 'text-white' : 'text-berlin-black'
        }`}>Escáner</h1>
        <p className={`text-sm mt-1 ${
          theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
        }`}>Escanea códigos QR o busca clientes para registrar interacciones</p>
      </div>

      {/* Mode tabs */}
      <div className={`flex rounded-xl p-1 ${
        theme === 'dark' ? 'bg-berlin-dark-card' : 'bg-berlin-light-card border border-berlin-light-border'
      }`}>
        {[
          { key: 'scan', label: 'Escanear QR', icon: <ScanLine size={16} /> },
          { key: 'search', label: 'Buscar cliente', icon: <Search size={16} /> },
          { key: 'new', label: 'Nuevo cliente', icon: <UserPlus size={16} /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setMode(tab.key as typeof mode); setResult(null); setSelectedClient(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === tab.key
                ? 'bg-berlin-gold text-berlin-black'
                : theme === 'dark' ? 'text-berlin-gray hover:text-white' : 'text-berlin-light-gray hover:text-berlin-black'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Result banner */}
      {result && (
        <div className={`rounded-xl p-4 flex items-center gap-3 ${
          result.type === 'success' ? 'bg-green-500/10 border border-green-500/20' :
          result.type === 'redeemed' ? 'bg-berlin-gold/10 border border-berlin-gold/20' :
          result.type === 'registered' ? 'bg-blue-500/10 border border-blue-500/20' :
          'bg-red-500/10 border border-red-500/20'
        }`}>
          {result.type === 'success' && <Check size={20} className="text-green-400" />}
          {result.type === 'redeemed' && <Star size={20} className="text-berlin-gold" />}
          {result.type === 'registered' && <Check size={20} className="text-blue-400" />}
          {result.type === 'error' && <AlertTriangle size={20} className="text-red-400" />}
          <p className={`text-sm font-medium ${
            result.type === 'success' ? 'text-green-400' :
            result.type === 'redeemed' ? 'text-berlin-gold' :
            result.type === 'registered' ? 'text-blue-400' :
            'text-red-400'
          }`}>{result.message}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <Card>
          {mode === 'scan' && (
            <div className="space-y-4">
              <h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-berlin-black'}`}>
                Escanear código QR
              </h2>
              <div className={`aspect-square max-w-xs mx-auto rounded-2xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-berlin-dark border-2 border-dashed border-berlin-dark-border' : 'bg-berlin-light border-2 border-dashed border-berlin-light-border'
              }`}>
                <div className="text-center">
                  <ScanLine size={48} className="text-berlin-gold mx-auto mb-3" />
                  <p className={`text-sm ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>
                    Cámara del escáner
                  </p>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>
                    (Integración con cámara próximamente)
                  </p>
                </div>
              </div>
              <Input
                label="O ingresa el código manualmente"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="berlin-wallet:abc123..."
              />
              <Button onClick={handleQrScan} disabled={loading || !qrInput} className="w-full">
                <ScanLine size={18} />
                {loading ? 'Procesando...' : 'Verificar código'}
              </Button>
            </div>
          )}

          {mode === 'search' && (
            <div className="space-y-4">
              <h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-berlin-black'}`}>
                Buscar por nombre
              </h2>
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nombre del cliente..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                  <Search size={18} />
                </Button>
              </div>
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {searchResults.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => handleSelectClient(client)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        theme === 'dark'
                          ? 'bg-berlin-dark hover:bg-berlin-dark-border'
                          : 'bg-berlin-light hover:bg-berlin-light-border'
                      }`}
                    >
                      <p className={`font-semibold text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-berlin-black'
                      }`}>{client.clientName}</p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                      }`}>{client.cardName} - {client.currentCount}/{client.requiredCount}</p>
                    </button>
                  ))}
                </div>
              )}
              {searchResults.length === 0 && searchQuery && !loading && (
                <p className={`text-sm text-center py-4 ${
                  theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                }`}>No se encontraron resultados</p>
              )}
            </div>
          )}

          {mode === 'new' && (
            <div className="space-y-4">
              <h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-berlin-black'}`}>
                Registrar nuevo cliente
              </h2>
              <Input
                label="Nombre del cliente"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                placeholder="Nombre completo"
                required
              />
              <Input
                label="Email (opcional)"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                placeholder="cliente@email.com"
              />
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${
                  theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                }`}>Asignar tarjeta</label>
                <select
                  value={newClient.cardId}
                  onChange={(e) => setNewClient({ ...newClient, cardId: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-berlin-gold/30 ${
                    theme === 'dark'
                      ? 'bg-berlin-dark border border-berlin-dark-border text-white'
                      : 'bg-white border border-berlin-light-border text-berlin-black'
                  }`}
                >
                  <option value="">Selecciona una tarjeta</option>
                  {loyaltyCards.map((card) => (
                    <option key={card.id} value={card.id}>{card.name} ({card.type})</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleNewClient} disabled={loading || !newClient.name || !newClient.cardId} className="w-full">
                <UserPlus size={18} />
                {loading ? 'Registrando...' : 'Registrar cliente'}
              </Button>
            </div>
          )}
        </Card>

        {/* Right: Preview */}
        <div>
          {selectedClient ? (
            <div className="space-y-3">
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
              }`}>Tarjeta del cliente</p>
              <LoyaltyCardPreview
                cardName={selectedClient.cardName}
                businessName=""
                clientName={selectedClient.clientName}
                type={selectedClient.type}
                requiredCount={selectedClient.requiredCount}
                currentCount={selectedClient.currentCount}
                color="#FFD700"
                reward=""
                cardId={selectedClient.id}
                isRegistered={selectedClient.isRegistered}
              />
            </div>
          ) : (
            <div className={`flex items-center justify-center h-64 rounded-2xl border-2 border-dashed ${
              theme === 'dark' ? 'border-berlin-dark-border' : 'border-berlin-light-border'
            }`}>
              <div className="text-center">
                <ScanLine size={40} className={`mx-auto mb-3 ${
                  theme === 'dark' ? 'text-berlin-dark-border' : 'text-berlin-light-border'
                }`} />
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                }`}>La tarjeta del cliente aparecerá aquí</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
