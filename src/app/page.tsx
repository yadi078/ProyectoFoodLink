import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FoodLink - Inicio',
  description: 'Conecta estudiantes con comida casera',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">
            🍲 FoodLink
          </h1>
          <p className="text-gray-600">
            Conecta estudiantes con comida casera
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/vendedor/login"
            className="btn-primary block text-center"
          >
            Iniciar Sesión como Vendedor
          </Link>
          <Link
            href="/vendedor/signup"
            className="btn-secondary block text-center"
          >
            Registrarse como Vendedor
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            ¿Eres estudiante? Próximamente...
          </p>
        </div>
      </div>
    </div>
  );
}

