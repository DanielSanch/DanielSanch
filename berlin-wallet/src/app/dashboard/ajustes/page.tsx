'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useTheme } from '@/lib/ThemeContext';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { Sun, Moon, Save, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AjustesPage() {
  const { theme, setTheme } = useTheme();
  const [form, setForm] = useState({
    name: '',
    address: '',
    type: 'restaurant',
    theme: 'dark' as 'dark' | 'light',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    getDoc(doc(db, 'businesses', uid)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setForm({
          name: data.name || '',
          address: data.address || '',
          type: data.type || 'restaurant',
          theme: data.theme || 'dark',
        });
      }
    });
  }, []);

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'businesses', uid), {
        name: form.name,
        address: form.address,
        type: form.type,
        theme: form.theme,
      });
      setTheme(form.theme);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success('Cambios guardados');
    } catch {
      toast.error('Error al guardar los cambios');
    }
    setSaving(false);
  };

  const businessTypes = [
    { value: 'restaurant', label: 'Restaurante / Café' },
    { value: 'hotel', label: 'Hotel / Hospedaje' },
    { value: 'gym', label: 'Gimnasio / Fitness' },
    { value: 'events', label: 'Eventos / Entretenimiento' },
    { value: 'transport', label: 'Transporte / Flota' },
    { value: 'other', label: 'Otro' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-black ${
          theme === 'dark' ? 'text-white' : 'text-berlin-black'
        }`}>Ajustes</h1>
        <p className={`text-sm mt-1 ${
          theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
        }`}>Configura tu perfil de negocio</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-berlin-gold/10 flex items-center justify-center">
              <Building2 size={24} className="text-berlin-gold" />
            </div>
            <div>
              <h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-berlin-black'}`}>
                Información del negocio
              </h2>
              <p className={`text-xs ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>
                Datos que aparecerán en las tarjetas de tus clientes
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Nombre del negocio"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tu negocio"
            />

            <Input
              label="Dirección"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Dirección para geolocalización"
            />

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${
                theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
              }`}>Tipo de negocio</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-berlin-gold/30 ${
                  theme === 'dark'
                    ? 'bg-berlin-dark border border-berlin-dark-border text-white'
                    : 'bg-white border border-berlin-light-border text-berlin-black'
                }`}
              >
                {businessTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-berlin-black'}`}>
            Apariencia
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setForm({ ...form, theme: 'dark' })}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                form.theme === 'dark'
                  ? 'border-berlin-gold bg-berlin-gold/10'
                  : theme === 'dark'
                    ? 'border-berlin-dark-border hover:border-berlin-gold/30'
                    : 'border-berlin-light-border hover:border-berlin-gold/30'
              }`}
            >
              <Moon size={28} className={`mx-auto mb-2 ${form.theme === 'dark' ? 'text-berlin-gold' : ''}`} />
              <p className={`font-semibold text-sm ${form.theme === 'dark' ? 'text-berlin-gold' : ''}`}>Modo oscuro</p>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>
                Fondo oscuro, texto claro
              </p>
            </button>
            <button
              onClick={() => setForm({ ...form, theme: 'light' })}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                form.theme === 'light'
                  ? 'border-berlin-gold bg-berlin-gold/10'
                  : theme === 'dark'
                    ? 'border-berlin-dark-border hover:border-berlin-gold/30'
                    : 'border-berlin-light-border hover:border-berlin-gold/30'
              }`}
            >
              <Sun size={28} className={`mx-auto mb-2 ${form.theme === 'light' ? 'text-berlin-gold' : ''}`} />
              <p className={`font-semibold text-sm ${form.theme === 'light' ? 'text-berlin-gold' : ''}`}>Modo claro</p>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>
                Fondo claro, texto oscuro
              </p>
            </button>
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
          {saved && (
            <span className="text-green-400 text-sm font-medium">Cambios guardados</span>
          )}
        </div>
      </div>
    </div>
  );
}
