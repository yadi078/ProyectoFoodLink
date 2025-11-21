/**
 * Header Component - Navegación principal
 * Header responsivo estilo plantilla: transparente en hero, sticky con fondo blanco
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHomePage = pathname === '/';

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // En móvil, siempre mostrar fondo blanco
  const showTransparent = isHomePage && !isSticky && typeof window !== 'undefined' && window.innerWidth >= 992;

  return (
    <header
      className={`fixed w-full transition-all duration-500 z-[999] ${
        showTransparent
          ? 'bg-transparent'
          : 'bg-white shadow-[0_2px_5px_rgba(0,0,0,0.3)]'
      } ${isHomePage && !isSticky ? 'lg:py-[30px] lg:px-[60px]' : 'py-2.5 lg:px-[60px]'}`}
    >
      <nav className="max-w-[1366px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-3xl lg:text-[45px] font-bold font-display leading-none">
              <span className="text-[#fbaf32]">Food</span>
              <span className="text-[#719a0a]">Link</span>
            </span>
          </Link>

          {/* Botón mobile menu */}
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: showTransparent ? '#ffffff' : '#666666' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link
              href="/"
              className={`px-2.5 py-2.5 font-display text-lg font-semibold transition-colors ${
                showTransparent ? 'text-white' : 'text-[#666666]'
              } ${isActive('/') ? 'text-[#fbaf32]' : ''} hover:text-[#fbaf32]`}
            >
              Inicio
            </Link>
            <Link
              href="/menu"
              className={`px-2.5 py-2.5 font-display text-lg font-semibold transition-colors ${
                showTransparent ? 'text-white' : 'text-[#666666]'
              } ${isActive('/menu') ? 'text-[#fbaf32]' : ''} hover:text-[#fbaf32]`}
            >
              Menú
            </Link>
            <Link
              href="/sobre-nosotros"
              className={`px-2.5 py-2.5 font-display text-lg font-semibold transition-colors ${
                showTransparent ? 'text-white' : 'text-[#666666]'
              } ${isActive('/sobre-nosotros') ? 'text-[#fbaf32]' : ''} hover:text-[#fbaf32]`}
            >
              Nosotros
            </Link>
            <Link
              href="/contacto"
              className={`px-2.5 py-2.5 font-display text-lg font-semibold transition-colors ${
                showTransparent ? 'text-white' : 'text-[#666666]'
              } ${isActive('/contacto') ? 'text-[#fbaf32]' : ''} hover:text-[#fbaf32]`}
            >
              Contacto
            </Link>
            {!loading && !user && (
              <>
                <Link
                  href="/login"
                  className={`px-4 py-2 font-display font-semibold transition-colors ${
                    showTransparent ? 'text-white' : 'text-[#666666]'
                  } hover:text-[#fbaf32]`}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registro"
                  className="btn-secondary px-6 py-2 text-sm"
                >
                  Registrarse
                </Link>
              </>
            )}
            {user && (
              <Link
                href={user.displayName ? '/vendedor/dashboard' : '/estudiante/menu'}
                className="btn-primary px-6 py-2 text-sm"
              >
                Ir al Panel
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Navegación Mobile */}
      <div
        className={`lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        } bg-white`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 border-t border-gray-200">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/')
                ? 'text-[#fbaf32] bg-primary-50'
                : 'text-[#666666] hover:text-[#fbaf32] hover:bg-gray-50'
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/menu')
                ? 'text-[#fbaf32] bg-primary-50'
                : 'text-[#666666] hover:text-[#fbaf32] hover:bg-gray-50'
            }`}
          >
            Menú
          </Link>
          <Link
            href="/sobre-nosotros"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/sobre-nosotros')
                ? 'text-[#fbaf32] bg-primary-50'
                : 'text-[#666666] hover:text-[#fbaf32] hover:bg-gray-50'
            }`}
          >
            Nosotros
          </Link>
          <Link
            href="/contacto"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/contacto')
                ? 'text-[#fbaf32] bg-primary-50'
                : 'text-[#666666] hover:text-[#fbaf32] hover:bg-gray-50'
            }`}
          >
            Contacto
          </Link>
          {!loading && !user && (
            <>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#666666] hover:text-[#fbaf32]"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-secondary block text-center mt-2"
              >
                Registrarse
              </Link>
            </>
          )}
          {user && (
            <Link
              href={user.displayName ? '/vendedor/dashboard' : '/estudiante/menu'}
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-primary block text-center mt-2"
            >
              Ir al Panel
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
