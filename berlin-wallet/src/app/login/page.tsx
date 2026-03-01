'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useTheme } from '@/lib/ThemeContext';
import { loginBusiness, loginWithGoogle } from '@/lib/auth';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginBusiness(email, password);
      router.push('/dashboard');
    } catch {
      setError('Credenciales inválidas. Intenta de nuevo.');
      toast.error('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch {
      setError('Error al iniciar con Google.');
      toast.error('Error al iniciar con Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
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
        }`}>Iniciar sesión</h1>
        <p className={`text-center text-sm mb-8 ${
          theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
        }`}>Accede al panel de tu negocio</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@negocio.com"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn size={18} />
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className={`absolute inset-0 flex items-center ${
            theme === 'dark' ? 'border-berlin-dark-border' : 'border-berlin-light-border'
          }`}>
            <div className={`w-full border-t ${
              theme === 'dark' ? 'border-berlin-dark-border' : 'border-berlin-light-border'
            }`} />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-4 ${
              theme === 'dark' ? 'bg-berlin-dark-card text-berlin-gray' : 'bg-white text-berlin-light-gray'
            }`}>o</span>
          </div>
        </div>

        <Button variant="secondary" className="w-full" onClick={handleGoogle} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continuar con Google
        </Button>

        <p className={`text-center text-sm mt-6 ${
          theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
        }`}>
          ¿No tienes cuenta?{' '}
          <a href="/registro" className="text-berlin-gold font-semibold hover:underline">
            Regístrate gratis
          </a>
        </p>
      </div>
    </div>
  );
}
