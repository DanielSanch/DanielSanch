'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useTheme } from '@/lib/ThemeContext';
import { Check, Zap } from 'lucide-react';

export default function Pricing() {
  const { theme } = useTheme();

  const features = [
    'Tarjetas de fidelización ilimitadas',
    'Dashboard con analíticas en tiempo real',
    'Notificaciones push geolocalizadas',
    'Escáner QR para tu negocio',
    'Soporte para Apple Wallet y Google Wallet',
    'Nombre del cliente en cada tarjeta (anti-fraude)',
    'Personalización de colores y marca',
    'Soporte prioritario',
  ];

  return (
    <section id="pricing" className={`py-24 ${theme === 'dark' ? 'bg-berlin-black/50' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-berlin-black'
          }`}>
            Inversión que se <span className="text-berlin-gold">paga sola</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
          }`}>
            Es más barato mantener un cliente que conseguir uno nuevo. Con Berlin Wallet, cada peso invertido regresa multiplicado.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <div className={`relative rounded-3xl p-8 ${
            theme === 'dark'
              ? 'bg-berlin-dark-card border-2 border-berlin-gold/30'
              : 'bg-berlin-light-card border-2 border-berlin-gold/40 shadow-xl'
          }`}>
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-berlin-gold text-berlin-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Zap size={14} /> Pago por uso
              </div>
            </div>

            <div className="text-center mb-8 pt-2">
              <h3 className={`text-2xl font-black mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-berlin-black'
              }`}>Plan Berlin Wallet</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
              }`}>Sin compromiso, cancela cuando quieras</p>
            </div>

            {/* Pricing details */}
            <div className={`rounded-2xl p-6 mb-8 space-y-4 ${
              theme === 'dark' ? 'bg-berlin-dark' : 'bg-berlin-light'
            }`}>
              <div className="flex items-baseline justify-between">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                }`}>Suscripción mensual</span>
                <div className="text-right">
                  <span className={`text-2xl font-black ${
                    theme === 'dark' ? 'text-white' : 'text-berlin-black'
                  }`}>Base</span>
                </div>
              </div>
              <div className={`border-t ${theme === 'dark' ? 'border-berlin-dark-border' : 'border-berlin-light-border'}`} />
              <div className="flex items-baseline justify-between">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                }`}>Por nuevo cliente adquirido</span>
                <span className="text-berlin-gold font-black text-xl">$100<span className="text-sm font-normal"> COP</span></span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                }`}>Por interacción fidelizada</span>
                <span className="text-berlin-gold font-black text-xl">$10<span className="text-sm font-normal"> COP</span></span>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check size={18} className="text-berlin-gold mt-0.5 shrink-0" />
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                  }`}>{feature}</span>
                </li>
              ))}
            </ul>

            <a href="/registro" className="block">
              <Button size="lg" className="w-full">
                Empezar ahora
              </Button>
            </a>
            <p className={`text-center text-xs mt-3 ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>Sin tarjeta de crédito requerida</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
