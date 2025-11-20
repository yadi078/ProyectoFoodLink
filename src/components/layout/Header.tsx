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

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl">🍲</span>
            <span className="text-2xl font-bold text-primary-600">FoodLink</span>
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/sobre-nosotros"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/sobre-nosotros')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/contacto"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/contacto')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Contacto
            </Link>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center space-x-3">
            {!loading && !user ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registro"
                  className="btn-primary px-6 py-2 text-sm"
                >
                  Registrarse
                </Link>
              </>
            ) : user ? (
              <Link
                href={user.displayName ? '/vendedor/dashboard' : '/estudiante/menu'}
                className="btn-primary px-6 py-2 text-sm"
              >
                Ir al Panel
              </Link>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Navegación Mobile */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/')
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/sobre-nosotros"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/sobre-nosotros')
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
            }`}
          >
            Sobre Nosotros
          </Link>
          <Link
            href="/contacto"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/contacto')
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
            }`}
          >
            Contacto
          </Link>
        </div>
      </div>
    </header>
  );
}

