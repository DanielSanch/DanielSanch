'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';
import { UtensilsCrossed, Hotel, Dumbbell, CalendarDays, Bus } from 'lucide-react';

const industries = [
  {
    icon: <UtensilsCrossed size={28} />,
    name: 'Restaurantes',
    description: 'Tarjetas de sellos digitales. "Compra 10 almuerzos, el 11 es gratis". Fideliza comensales con recompensas automáticas.',
    example: 'Café Berlin: 70% de retención con tarjeta de sellos',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: <Hotel size={28} />,
    name: 'Hoteles',
    description: 'Programa de puntos por estadía. Beneficios exclusivos, upgrades y descuentos para huéspedes frecuentes.',
    example: 'Hotel Dorado: 2x más reservas recurrentes',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Dumbbell size={28} />,
    name: 'Gimnasios',
    description: 'Pases de entrada digital, control de visitas semanales. "Invita a un amigo y obtén una semana gratis".',
    example: 'FitMax: +40% nuevos miembros por referidos',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <CalendarDays size={28} />,
    name: 'Eventos',
    description: 'Entradas digitales con QR verificable. Al escanear se marca como registrado. Sin falsificaciones.',
    example: 'TechConf 2026: 0% entradas falsificadas',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <Bus size={28} />,
    name: 'Transporte',
    description: 'Próximamente: Tiquetes virtuales para flotas de buses. API de integración para sistemas existentes.',
    example: 'Integración API - Próximamente',
    color: 'from-berlin-gold to-yellow-600',
  },
];

export default function Industries() {
  const { theme } = useTheme();

  return (
    <section id="industries" className={`py-24 ${theme === 'dark' ? 'bg-berlin-black/50' : 'bg-white'}`}>
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
            Para cada tipo de <span className="text-berlin-gold">negocio</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
          }`}>
            Soluciones de fidelización adaptadas a tu industria. Es más fácil mantener un cliente que conseguir uno nuevo.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                theme === 'dark'
                  ? 'bg-berlin-dark-card border border-berlin-dark-border hover:border-berlin-gold/30'
                  : 'bg-berlin-light-card border border-berlin-light-border hover:border-berlin-gold shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${ind.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ind.color} flex items-center justify-center text-white mb-4`}>
                {ind.icon}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-berlin-black'
              }`}>{ind.name}</h3>
              <p className={`text-sm leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
              }`}>{ind.description}</p>
              <div className={`text-xs font-medium px-3 py-1.5 rounded-full inline-block ${
                theme === 'dark' ? 'bg-berlin-gold/10 text-berlin-gold' : 'bg-berlin-gold/15 text-berlin-gold-dark'
              }`}>
                {ind.example}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
