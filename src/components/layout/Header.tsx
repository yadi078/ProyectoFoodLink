/**
 * Header Component - Navegación principal
 * Header responsivo con Logo y botones de Login/Registro
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-primary-500 shadow-lg sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              <span className="text-white">Food</span>
              <span className="text-green-400">Link</span>
            </span>
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive('/') && pathname === '/'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-green-100 hover:bg-primary-400 hover:text-white'
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/menu"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive('/menu')
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-green-100 hover:bg-primary-400 hover:text-white'
              }`}
            >
              Menú
            </Link>
            <Link
              href="/contacto"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive('/contacto')
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-green-100 hover:bg-primary-400 hover:text-white'
              }`}
            >
              Contacto
            </Link>
            <Link
              href="/preguntas"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive('/preguntas')
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-green-100 hover:bg-primary-400 hover:text-white'
              }`}
            >
              Preguntas
            </Link>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center space-x-3">
            {!loading && !user ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-green-100 font-semibold hover:text-white transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registro"
                  className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm shadow-md"
                >
                  Registrarse
                </Link>
              </>
            ) : user ? (
              <Link
                href={user.displayName ? '/vendedor/dashboard' : '/estudiante/menu'}
                className="bg-white text-primary-600 font-semibold px-6 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm shadow-md"
              >
                Ir al Panel
              </Link>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Navegación Mobile */}
      <div className="md:hidden bg-primary-600 border-t border-primary-400">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${
              isActive('/') && pathname === '/'
                ? 'bg-white text-primary-600'
                : 'text-green-100 hover:bg-primary-400 hover:text-white'
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/menu"
            className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${
              isActive('/menu')
                ? 'bg-white text-primary-600'
                : 'text-green-100 hover:bg-primary-400 hover:text-white'
            }`}
          >
            Menú
          </Link>
          <Link
            href="/contacto"
            className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${
              isActive('/contacto')
                ? 'bg-white text-primary-600'
                : 'text-green-100 hover:bg-primary-400 hover:text-white'
            }`}
          >
            Contacto
          </Link>
          <Link
            href="/preguntas"
            className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${
              isActive('/preguntas')
                ? 'bg-white text-primary-600'
                : 'text-green-100 hover:bg-primary-400 hover:text-white'
            }`}
          >
            Preguntas
          </Link>
        </div>
      </div>
    </header>
  );
}

