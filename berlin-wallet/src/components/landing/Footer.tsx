'use client';

import Logo from '@/components/ui/Logo';
import { useTheme } from '@/lib/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer id="footer" className={`py-12 border-t ${
      theme === 'dark' ? 'border-berlin-dark-border bg-berlin-black' : 'border-berlin-light-border bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Logo />
            <p className={`text-sm mt-3 ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>
              Plataforma B2B de fidelización con wallet digital. Una empresa de Berlin.
            </p>
          </div>
          <div>
            <h4 className={`font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-berlin-black'
            }`}>Producto</h4>
            <ul className={`space-y-2 text-sm ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>
              <li><a href="#features" className="hover:text-berlin-gold transition-colors">Características</a></li>
              <li><a href="#pricing" className="hover:text-berlin-gold transition-colors">Precios</a></li>
              <li><a href="#industries" className="hover:text-berlin-gold transition-colors">Industrias</a></li>
              <li><a href="#how-it-works" className="hover:text-berlin-gold transition-colors">Cómo funciona</a></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-berlin-black'
            }`}>Empresa</h4>
            <ul className={`space-y-2 text-sm ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>
              <li><a href="mailto:jesusdanielsar@gmail.com" className="hover:text-berlin-gold transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-berlin-gold transition-colors">Términos de servicio</a></li>
              <li><a href="#" className="hover:text-berlin-gold transition-colors">Política de privacidad</a></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-berlin-black'
            }`}>Contacto</h4>
            <ul className={`space-y-2 text-sm ${
              theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'
            }`}>
              <li>jesusdanielsar@gmail.com</li>
              <li><a href="https://www.linkedin.com/in/jesusdanielsanchezrincon" target="_blank" rel="noopener noreferrer" className="hover:text-berlin-gold transition-colors">LinkedIn</a></li>
              <li><a href="https://www.instagram.com/daniel1andonly" target="_blank" rel="noopener noreferrer" className="hover:text-berlin-gold transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className={`pt-8 border-t text-center text-sm ${
          theme === 'dark' ? 'border-berlin-dark-border text-berlin-gray' : 'border-berlin-light-border text-berlin-light-gray'
        }`}>
          © 2026 Berlin Wallet — Una empresa de Berlin. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
