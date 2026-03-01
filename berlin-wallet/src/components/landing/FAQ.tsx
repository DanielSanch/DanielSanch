'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: '¿Qué es Berlin Wallet?',
    answer: 'Berlin Wallet es una plataforma B2B que permite a negocios crear tarjetas de fidelización digitales integradas con Apple Wallet y Google Wallet. Tus clientes llevan su tarjeta en el teléfono y tú gestionas todo desde el dashboard.',
  },
  {
    question: '¿Necesito conocimientos técnicos para usarlo?',
    answer: 'No. Berlin Wallet está diseñado para ser intuitivo. Creas tu tarjeta en minutos, personalizas colores y tipo de programa, y empiezas a registrar clientes con QR. Sin código, sin complicaciones.',
  },
  {
    question: '¿Cómo funciona el sistema de QR?',
    answer: 'Cada cliente recibe un código QR único al registrarse. Cuando visitan tu negocio, escaneas su QR desde el dashboard para registrar la interacción. El progreso se actualiza automáticamente en su wallet digital.',
  },
  {
    question: '¿Qué tipos de programas de lealtad puedo crear?',
    answer: 'Puedes crear programas de sellos (stamps), puntos, visitas o entradas para eventos. Cada tipo tiene su propia mecánica: los sellos son visuales con estrellas, los puntos y visitas usan barras de progreso, y los eventos funcionan como tickets con QR.',
  },
  {
    question: '¿Funciona con Apple Wallet y Google Wallet?',
    answer: 'Sí. Las tarjetas se generan en formato compatible con ambas plataformas. Tus clientes pueden agregar su tarjeta de fidelización directamente a su wallet del teléfono con un solo tap.',
  },
  {
    question: '¿Puedo probar Berlin Wallet gratis?',
    answer: 'Sí. Ofrecemos un plan gratuito que incluye 1 tarjeta de fidelización y hasta 50 clientes. Es perfecto para probar la plataforma antes de escalar con un plan profesional.',
  },
];

export default function FAQ() {
  const { theme } = useTheme();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 relative">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-berlin-gold/10 border border-berlin-gold/20 text-berlin-gold text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-berlin-black'
          }`}>
            Preguntas <span className="text-berlin-gold">frecuentes</span>
          </h2>
          <p className={`${
            theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
          }`}>
            Resolvemos las dudas más comunes sobre Berlin Wallet
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className={`w-full text-left rounded-xl p-5 border transition-all ${
                  open === i
                    ? 'border-berlin-gold/30 bg-berlin-gold/5'
                    : theme === 'dark'
                      ? 'border-berlin-dark-border bg-berlin-dark-card hover:border-berlin-gold/20'
                      : 'border-berlin-light-border bg-white hover:border-berlin-gold/20'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className={`font-bold text-sm sm:text-base ${
                    theme === 'dark' ? 'text-white' : 'text-berlin-black'
                  }`}>
                    {faq.question}
                  </h3>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform text-berlin-gold ${
                      open === i ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className={`mt-3 text-sm leading-relaxed ${
                        theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
                      }`}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
