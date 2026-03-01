'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';
import { UserPlus, Palette, Rocket } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus size={28} />,
    number: '01',
    title: 'Regístrate',
    description: 'Crea tu cuenta de negocio en menos de 2 minutos. Elige tu industria y configura tu perfil.',
  },
  {
    icon: <Palette size={28} />,
    number: '02',
    title: 'Diseña tu tarjeta',
    description: 'Personaliza colores, logo y mecánica de fidelización. Vista previa en tiempo real de cómo se verá en el wallet.',
  },
  {
    icon: <Rocket size={28} />,
    number: '03',
    title: 'Conecta con tus clientes',
    description: 'Tus clientes añaden la tarjeta a su wallet con un QR. Cada visita se registra automáticamente al escanear.',
  },
];

export default function HowItWorks() {
  const { theme } = useTheme();

  return (
    <section id="how-it-works" className="py-24">
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
            Así de <span className="text-berlin-gold">simple</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
          }`}>
            En 3 pasos ya estás fidelizando clientes con tecnología de wallet digital.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className={`hidden md:block absolute top-20 left-[20%] right-[20%] h-0.5 ${
            theme === 'dark' ? 'bg-berlin-dark-border' : 'bg-berlin-light-border'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-berlin-gold via-berlin-gold to-berlin-gold/30 h-full" />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center relative"
            >
              <div className="relative inline-flex mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-berlin-gold ${
                  theme === 'dark' ? 'bg-berlin-dark-card border-2 border-berlin-gold/30' : 'bg-white border-2 border-berlin-gold/40 shadow-lg'
                }`}>
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-berlin-gold text-berlin-black rounded-full flex items-center justify-center text-xs font-black">
                  {step.number}
                </span>
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-berlin-black'
              }`}>{step.title}</h3>
              <p className={`text-sm leading-relaxed max-w-xs mx-auto ${
                theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
              }`}>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
