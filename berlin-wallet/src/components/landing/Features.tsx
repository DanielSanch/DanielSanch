'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { useTheme } from '@/lib/ThemeContext';
import { CreditCard, Bell, Ticket, Users, BarChart3, Code2 } from 'lucide-react';

const features = [
  {
    icon: <CreditCard size={24} />,
    title: 'Tarjetas de Lealtad',
    description: 'Crea mecánicas tipo "Compra 10, el 11 es gratis". Sellos, puntos o visitas que tus clientes acumulan directamente en su wallet.',
    color: 'text-berlin-gold bg-berlin-gold/10',
  },
  {
    icon: <Bell size={24} />,
    title: 'Notificaciones Push',
    description: 'Envía promociones cuando tus clientes estén cerca de tu negocio con geolocalización inteligente.',
    color: 'text-blue-400 bg-blue-400/10',
  },
  {
    icon: <Ticket size={24} />,
    title: 'Pases para Eventos',
    description: 'Entradas digitales con verificación por QR. Al escanear, se marca como registrado con diseño visual de confirmación.',
    color: 'text-purple-400 bg-purple-400/10',
  },
  {
    icon: <Users size={24} />,
    title: 'Programa de Referidos',
    description: '"Invita a un amigo esta semana y ambos ganan". Mecánicas de referidos que multiplican tus clientes.',
    color: 'text-green-400 bg-green-400/10',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Analíticas en Tiempo Real',
    description: 'Dashboard completo con métricas de interacción, retención y ROI de tu programa de fidelización.',
    color: 'text-orange-400 bg-orange-400/10',
  },
  {
    icon: <Code2 size={24} />,
    title: 'API de Integración',
    description: 'Próximamente: conecta Berlin Wallet con tu sistema. Ideal para flotas de transporte, tiquetes virtuales y más.',
    color: 'text-cyan-400 bg-cyan-400/10',
  },
];

export default function Features() {
  const { theme } = useTheme();

  return (
    <section id="features" className="py-24 relative">
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
            Todo lo que necesitas para <span className="text-berlin-gold">fidelizar</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
          }`}>
            Herramientas poderosas para crear experiencias de lealtad que tus clientes realmente van a usar.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card hover className="h-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-berlin-black'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                }`}>
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
