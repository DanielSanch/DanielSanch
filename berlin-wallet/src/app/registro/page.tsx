'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useTheme } from '@/lib/ThemeContext';
import { registerBusiness, BusinessProfile } from '@/lib/auth';
import { UserPlus, Sun, Moon } from 'lucide-react';

export default function RegistroPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: 'restaurant' as BusinessProfile['type'],
    preferredTheme: 'dark' as 'dark' | 'light',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const businessTypes = [
    { value: 'restaurant', label: 'Restaurante / Café' },
    { value: 'hotel', label: 'Hotel / Hospedaje' },
    { value: 'gym', label: 'Gimnasio / Fitness' },
    { value: 'events', label: 'Eventos / Entretenimiento' },
    { value: 'transport', label: 'Transporte / Flota' },
    { value: 'other', label: 'Otro' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await registerBusiness(
        formData.email,
        formData.password,
        formData.businessName,
        formData.type,
        formData.preferredTheme
      );
      setTheme(formData.preferredTheme);
      router.push('/dashboard');
    } catch {
      setError('Error al crear la cuenta. El correo ya podría estar registrado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${
      theme === 'dark' ? 'bg-berlin-dark' : 'bg-berlin-light'
    }`}>
      <div className={`w-full max-w-md rounded-3xl p-8 ${
        theme === 'dark'
          ? 'bg-berlin-dark-card border border-berlin-dark-border'
          : 'bg-white border border-berlin-light-border shadow-xl'
      }`}>
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        <h1 className={`text-2xl font-black text-center mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-berlin-black'
        }`}>Crea tu cuenta</h1>
        <p className={`text-center text-sm mb-8 ${
          theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
        }`}>Empieza a fidelizar clientes hoy</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del negocio"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            placeholder="Ej: Café Berlin"
            required
          />
          <Input
            label="Correo electrónico"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="tu@negocio.com"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Mínimo 6 caracteres"
            required
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Repite tu contraseña"
            required
          />

          {/* Business type */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>Tipo de negocio</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as BusinessProfile['type'] })}
              className={`w-full px-4 py-2.5 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-berlin-gold/30 ${
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

          {/* Theme selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>Tema preferido para tu panel</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, preferredTheme: 'dark' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  formData.preferredTheme === 'dark'
                    ? 'border-berlin-gold bg-berlin-gold/10'
                    : theme === 'dark'
                      ? 'border-berlin-dark-border hover:border-berlin-gold/30'
                      : 'border-berlin-light-border hover:border-berlin-gold/30'
                }`}
              >
                <Moon size={18} className={formData.preferredTheme === 'dark' ? 'text-berlin-gold' : ''} />
                <span className={`text-sm font-medium ${formData.preferredTheme === 'dark' ? 'text-berlin-gold' : ''}`}>Oscuro</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, preferredTheme: 'light' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  formData.preferredTheme === 'light'
                    ? 'border-berlin-gold bg-berlin-gold/10'
                    : theme === 'dark'
                      ? 'border-berlin-dark-border hover:border-berlin-gold/30'
                      : 'border-berlin-light-border hover:border-berlin-gold/30'
                }`}
              >
                <Sun size={18} className={formData.preferredTheme === 'light' ? 'text-berlin-gold' : ''} />
                <span className={`text-sm font-medium ${formData.preferredTheme === 'light' ? 'text-berlin-gold' : ''}`}>Claro</span>
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <UserPlus size={18} />
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </Button>
        </form>

        <p className={`text-center text-sm mt-6 ${
          theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
        }`}>
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-berlin-gold font-semibold hover:underline">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}
