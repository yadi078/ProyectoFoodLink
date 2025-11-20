/**
 * Footer Component
 * Pie de página con información y enlaces
 */

'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y Descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🍲</span>
              <span className="text-2xl font-bold">FoodLink</span>
            </div>
            <p className="text-gray-300 mb-4">
              Conectamos estudiantes universitarios con comida casera, nutritiva y accesible.
              Apoyamos a familias y microemprendedores locales.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre-nosotros"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            <ul className="space-y-2 text-gray-300">
              <li>📧 contacto@foodlink.com</li>
              <li>📱 +34 123 456 789</li>
              <li>📍 Disponible en toda España</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 FoodLink. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

