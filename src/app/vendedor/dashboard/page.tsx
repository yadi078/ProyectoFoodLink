'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { logoutVendedor } from '@/services/auth/authService';

export default function DashboardPage() {
  const router = useRouter();
  const { user, vendedor, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // Si no hay usuario autenticado, redirigir al login
      router.push('/vendedor/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logoutVendedor();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || !vendedor) {
    return null; // Se redirigirá automáticamente
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🍲 FoodLink
              </h1>
              <p className="text-sm text-gray-600">Panel de Vendedor</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ¡Bienvenido, {vendedor.nombre}!
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Correo electrónico:</p>
              <p className="text-base text-gray-900">{vendedor.email}</p>
            </div>

            {vendedor.telefono && (
              <div>
                <p className="text-sm text-gray-600">Teléfono:</p>
                <p className="text-base text-gray-900">{vendedor.telefono}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Esta es tu área de trabajo. Aquí podrás gestionar tus menús,
                pedidos y perfil.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Funcionalidades próximas: Gestión de menús, pedidos, perfil.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

