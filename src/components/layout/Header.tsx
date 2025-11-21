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
            <span className="text-2xl font-bold">
              <span className="text-primary-600">Food</span>
              <span className="text-green-600">Link</span>
            </span>
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-primary-600'
                  : 'text-primary-500 hover:text-primary-600'
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/menu"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/menu')
                  ? 'text-primary-600'
                  : 'text-primary-500 hover:text-primary-600'
              }`}
            >
              Menú
            </Link>
            <Link
              href="/contacto"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/contacto')
                  ? 'text-primary-600'
                  : 'text-primary-500 hover:text-primary-600'
              }`}
            >
              Contacto
            </Link>
            <Link
              href="/preguntas"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/preguntas')
                  ? 'text-primary-600'
                  : 'text-primary-500 hover:text-primary-600'
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
                  className="px-4 py-2 text-primary-500 font-medium hover:text-primary-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registro"
                  className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
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
            href="/menu"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/menu')
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
            }`}
          >
            Menú
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
          <Link
            href="/preguntas"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/preguntas')
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
            }`}
          >
            Preguntas
          </Link>
        </div>
      </div>
    </header>
  );
}

