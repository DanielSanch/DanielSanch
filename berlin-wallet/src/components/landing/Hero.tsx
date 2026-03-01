'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useTheme } from '@/lib/ThemeContext';
import { ArrowRight, Smartphone } from 'lucide-react';

export default function Hero() {
  const { theme } = useTheme();

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] ${
          theme === 'dark' ? 'bg-berlin-gold/8' : 'bg-berlin-gold/15'
        }`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-berlin-gold/10 border border-berlin-gold/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-berlin-gold animate-pulse" />
              <span className="text-berlin-gold text-sm font-medium">Plataforma B2B de Fidelización</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-berlin-black'
            }`}>
              Fideliza a tus clientes con{' '}
              <span className="text-berlin-gold">wallet digital</span>
            </h1>

            <p className={`text-lg sm:text-xl mb-8 max-w-lg ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>
              Tarjetas de lealtad, notificaciones geolocalizadas, pases para eventos y más.
              Directamente en Apple Wallet y Google Wallet de tus clientes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/registro">
                <Button size="lg">
                  Comienza ahora <ArrowRight size={18} />
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="secondary" size="lg">
                  Ver cómo funciona
                </Button>
              </a>
            </div>

            <div className={`flex items-center gap-6 mt-8 text-sm ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>
              <span className="flex items-center gap-1.5">
                <span className="text-berlin-gold font-bold">100+</span> Negocios activos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-berlin-gold font-bold">50K+</span> Tarjetas emitidas
              </span>
            </div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Phone frame */}
              <div className={`w-[280px] sm:w-[320px] rounded-[3rem] p-3 ${
                theme === 'dark' ? 'bg-berlin-dark-card border-2 border-berlin-dark-border' : 'bg-white border-2 border-berlin-light-border shadow-2xl'
              }`}>
                <div className={`rounded-[2.2rem] overflow-hidden ${
                  theme === 'dark' ? 'bg-berlin-dark' : 'bg-berlin-light'
                }`}>
                  {/* Status bar */}
                  <div className="flex justify-between items-center px-6 pt-4 pb-2">
                    <span className="text-xs font-semibold">9:41</span>
                    <div className="flex gap-1">
                      <Smartphone size={12} />
                    </div>
                  </div>
                  {/* Wallet card preview */}
                  <div className="px-4 pb-6 space-y-3">
                    <div className="bg-gradient-to-br from-berlin-gold to-berlin-gold-dark rounded-2xl p-5 text-berlin-black">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <p className="text-xs font-medium opacity-70">Tarjeta de Lealtad</p>
                          <p className="font-bold text-lg">Café Berlin</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-berlin-black/20 flex items-center justify-center">
                          <span className="font-black text-sm">B</span>
                        </div>
                      </div>
                      <p className="text-xs font-medium opacity-70 mb-1">Cliente</p>
                      <p className="font-semibold text-sm mb-3">María González</p>
                      <div className="flex gap-1.5">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              i < 7
                                ? 'bg-berlin-black/30 text-berlin-gold-dark'
                                : 'bg-berlin-black/10 text-berlin-black/30'
                            }`}
                          >
                            {i < 7 ? '★' : (i + 1)}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs mt-2 font-medium">7/10 - ¡3 más para tu café gratis!</p>
                    </div>

                    {/* Second card */}
                    <div className={`rounded-2xl p-4 ${
                      theme === 'dark' ? 'bg-berlin-dark-card border border-berlin-dark-border' : 'bg-white border border-berlin-light-border'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <span className="text-purple-400">🎫</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Evento Tech 2026</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>Entrada General - Activa</p>
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-2xl p-4 ${
                      theme === 'dark' ? 'bg-berlin-dark-card border border-berlin-dark-border' : 'bg-white border border-berlin-light-border'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                          <span className="text-green-400">💪</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">GymFit Pro</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>Pase semanal - 3/5 visitas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-berlin-gold/10 rounded-[4rem] blur-2xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
