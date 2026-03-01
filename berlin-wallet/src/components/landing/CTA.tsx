'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-berlin-gold/10 rounded-full blur-[120px]" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-5xl font-black mb-6">
            ¿Listo para revolucionar la{' '}
            <span className="text-berlin-gold">fidelización</span> de tus clientes?
          </h2>
          <p className="text-lg text-berlin-gray mb-10 max-w-2xl mx-auto">
            Únete a cientos de negocios que ya están reteniendo más clientes con Berlin Wallet.
            La tecnología de wallet digital al alcance de tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/registro">
              <Button size="lg">
                Crear cuenta gratis <ArrowRight size={18} />
              </Button>
            </a>
            <a href="mailto:jesusdanielsar@gmail.com">
              <Button variant="secondary" size="lg">
                Hablar con ventas
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
