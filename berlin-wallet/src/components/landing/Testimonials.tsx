'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Carlos Mendoza',
    business: 'Café La Esquina',
    type: 'Restaurante',
    text: 'Desde que implementamos Berlin Wallet, la retención de clientes aumentó un 40%. Los clientes aman escanear su QR y ver su progreso.',
    rating: 5,
    avatar: 'CM',
    color: 'bg-amber-500',
  },
  {
    name: 'Ana Rodríguez',
    business: 'FitZone Gym',
    type: 'Gimnasio',
    text: 'La integración con wallet digital fue un game changer. Nuestros socios ya no olvidan su pase y podemos trackear visitas fácilmente.',
    rating: 5,
    avatar: 'AR',
    color: 'bg-emerald-500',
  },
  {
    name: 'Miguel Torres',
    business: 'Hotel Pacífico',
    type: 'Hotel',
    text: 'Gestionar el programa de lealtad era un dolor de cabeza. Con Berlin Wallet todo está automatizado y nuestros huéspedes repiten.',
    rating: 5,
    avatar: 'MT',
    color: 'bg-blue-500',
  },
  {
    name: 'Laura Gómez',
    business: 'EventPro Colombia',
    type: 'Eventos',
    text: 'Usamos Berlin Wallet para validar entradas con QR en nuestros eventos. Rápido, seguro y sin papel. Lo recomiendo 100%.',
    rating: 5,
    avatar: 'LG',
    color: 'bg-purple-500',
  },
];

export default function Testimonials() {
  const { theme } = useTheme();

  return (
    <section id="testimonials" className="py-20 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] ${
          theme === 'dark' ? 'bg-berlin-gold/5' : 'bg-berlin-gold/10'
        }`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-berlin-gold/10 border border-berlin-gold/20 text-berlin-gold text-sm font-medium mb-4">
            Testimonios
          </span>
          <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-berlin-black'
          }`}>
            Lo que dicen nuestros <span className="text-berlin-gold">clientes</span>
          </h2>
          <p className={`max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
          }`}>
            Negocios de toda Latinoamérica ya confían en Berlin Wallet para fidelizar a sus clientes
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-6 border transition-all hover:-translate-y-1 ${
                theme === 'dark'
                  ? 'bg-berlin-dark-card border-berlin-dark-border hover:border-berlin-gold/30'
                  : 'bg-white border-berlin-light-border hover:border-berlin-gold/30 shadow-sm'
              }`}
            >
              <Quote size={24} className="text-berlin-gold/30 mb-3" />
              <p className={`text-sm leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
              }`}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={14} className="text-berlin-gold fill-berlin-gold" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <p className={`text-sm font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-berlin-black'
                  }`}>{t.name}</p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                  }`}>{t.business} · {t.type}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
