'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoyaltyCardForm from '@/components/dashboard/LoyaltyCardForm';
import LoyaltyCardPreview from '@/components/dashboard/LoyaltyCardPreview';
import { useTheme } from '@/lib/ThemeContext';
import { auth } from '@/lib/firebase';
import { getLoyaltyCards, createLoyaltyCard, deleteLoyaltyCard, LoyaltyCard } from '@/lib/firestore';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TarjetasPage() {
  const { theme } = useTheme();
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [previewCard, setPreviewCard] = useState<LoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCards = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      const data = await getLoyaltyCards(uid);
      setCards(data);
    } catch {
      // Handle error silently
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleSave = async (card: Omit<LoyaltyCard, 'id' | 'createdAt'>) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      await createLoyaltyCard(uid, card);
      setShowForm(false);
      loadCards();
      toast.success('Tarjeta creada exitosamente');
    } catch {
      toast.error('Error al crear la tarjeta');
    }
  };

  const handleDelete = async (cardId: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid || !cardId) return;
    try {
      await deleteLoyaltyCard(uid, cardId);
      loadCards();
      toast.success('Tarjeta eliminada');
    } catch {
      toast.error('Error al eliminar la tarjeta');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-black ${
            theme === 'dark' ? 'text-white' : 'text-berlin-black'
          }`}>Tarjetas de Fidelización</h1>
          <p className={`text-sm mt-1 ${
            theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
          }`}>Crea y gestiona tus programas de lealtad</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={18} /> Nueva tarjeta
          </Button>
        )}
      </div>

      {showForm && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h2 className={`text-lg font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-berlin-black'
            }`}>Nueva tarjeta</h2>
            <LoyaltyCardForm
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </Card>
          <div>
            <p className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>Vista previa</p>
            <LoyaltyCardPreview
              cardName="Tarjeta de ejemplo"
              businessName="Tu Negocio"
              clientName="Cliente Ejemplo"
              type="stamps"
              requiredCount={10}
              currentCount={7}
              color="#FFD700"
              reward="Un café gratis"
              cardId="demo-card-123"
            />
          </div>
        </div>
      )}

      {/* Cards list */}
      {loading ? (
        <div className={`text-center py-12 ${
          theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
        }`}>Cargando tarjetas...</div>
      ) : cards.length === 0 && !showForm ? (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-berlin-gold/10 flex items-center justify-center mx-auto mb-4">
              <Plus size={28} className="text-berlin-gold" />
            </div>
            <p className={`font-bold text-lg mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-berlin-black'
            }`}>Crea tu primera tarjeta</p>
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>Diseña una tarjeta de fidelización para tus clientes</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus size={18} /> Crear tarjeta
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="space-y-3">
              <LoyaltyCardPreview
                cardName={card.name}
                businessName=""
                clientName="Vista previa"
                type={card.type}
                requiredCount={card.requiredCount}
                currentCount={Math.floor(card.requiredCount * 0.6)}
                color={card.color}
                reward={card.reward}
                cardId={card.id}
              />
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  {card.isActive ? (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <Eye size={14} /> Activa
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-berlin-gray">
                      <EyeOff size={14} /> Inactiva
                    </span>
                  )}
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => card.id && handleDelete(card.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
