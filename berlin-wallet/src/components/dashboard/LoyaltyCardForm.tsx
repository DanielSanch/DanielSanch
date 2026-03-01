'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useTheme } from '@/lib/ThemeContext';
import { LoyaltyCard } from '@/lib/firestore';
import { Save, X } from 'lucide-react';

interface LoyaltyCardFormProps {
  onSave: (card: Omit<LoyaltyCard, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: LoyaltyCard;
}

const colorOptions = [
  '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#D4A373', '#7C3AED', '#059669', '#DC2626', '#2563EB',
  '#D97706', '#EC4899',
];

export default function LoyaltyCardForm({ onSave, onCancel, initialData }: LoyaltyCardFormProps) {
  const { theme } = useTheme();
  const [form, setForm] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'stamps' as LoyaltyCard['type'],
    requiredCount: initialData?.requiredCount || 10,
    reward: initialData?.reward || '',
    color: initialData?.color || '#FFD700',
    description: initialData?.description || '',
    isActive: initialData?.isActive ?? true,
  });

  const types = [
    { value: 'stamps', label: 'Sellos', desc: 'Compra X, obtén 1 gratis' },
    { value: 'points', label: 'Puntos', desc: 'Acumula puntos por compra' },
    { value: 'visits', label: 'Visitas', desc: 'Registra visitas semanales' },
    { value: 'event', label: 'Evento', desc: 'Entrada digital verificable' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Nombre de la tarjeta"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Ej: Tarjeta Café Premium"
        required
      />

      {/* Type selector */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
        }`}>Tipo de mecánica</label>
        <div className="grid grid-cols-2 gap-2">
          {types.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm({ ...form, type: t.value as LoyaltyCard['type'] })}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                form.type === t.value
                  ? 'border-berlin-gold bg-berlin-gold/10'
                  : theme === 'dark'
                    ? 'border-berlin-dark-border hover:border-berlin-gold/30'
                    : 'border-berlin-light-border hover:border-berlin-gold/30'
              }`}
            >
              <p className={`text-sm font-semibold ${form.type === t.value ? 'text-berlin-gold' : ''}`}>
                {t.label}
              </p>
              <p className={`text-xs mt-0.5 ${
                theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
              }`}>{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Required count */}
      {form.type !== 'event' && (
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
          }`}>
            {form.type === 'stamps' ? 'Sellos necesarios' : form.type === 'points' ? 'Puntos objetivo' : 'Visitas necesarias'}: {form.requiredCount}
          </label>
          <input
            type="range"
            min="5"
            max="20"
            value={form.requiredCount}
            onChange={(e) => setForm({ ...form, requiredCount: Number(e.target.value) })}
            className="w-full accent-berlin-gold"
          />
          <div className="flex justify-between text-xs text-berlin-gray mt-1">
            <span>5</span>
            <span>20</span>
          </div>
        </div>
      )}

      <Input
        label="Recompensa"
        value={form.reward}
        onChange={(e) => setForm({ ...form, reward: e.target.value })}
        placeholder={form.type === 'event' ? 'Ej: Entrada VIP' : 'Ej: Un café gratis'}
        required
      />

      <Input
        label="Descripción (opcional)"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Descripción para tus clientes"
      />

      {/* Color picker */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
        }`}>Color de la tarjeta</label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm({ ...form, color: c })}
              className={`w-8 h-8 rounded-lg transition-all ${
                form.color === c ? 'ring-2 ring-offset-2 ring-berlin-gold scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">
          <Save size={18} /> Guardar tarjeta
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          <X size={18} /> Cancelar
        </Button>
      </div>
    </form>
  );
}
