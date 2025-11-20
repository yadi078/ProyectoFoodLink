'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { logoutVendedor } from '@/services/auth/authService';
import Link from 'next/link';
import { useAlert } from '@/components/context/AlertContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, vendedor, loading } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logoutVendedor();
      showAlert('Sesión cerrada exitosamente', 'success');
      router.push('/');
    } catch (error) {
      showAlert('Error al cerrar sesión', 'error');
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
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🍲 FoodLink - Panel de Vendedor
              </h1>
              <p className="text-sm text-gray-600">Bienvenido, {vendedor.nombre}</p>
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
        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos Pendientes</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
              </div>
              <span className="text-4xl">📦</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ganancias Hoy</p>
                <p className="text-3xl font-bold text-gray-900">€120.50</p>
              </div>
              <span className="text-4xl">💰</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Platos Vendidos</p>
                <p className="text-3xl font-bold text-gray-900">23</p>
              </div>
              <span className="text-4xl">🍽️</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calificación</p>
                <p className="text-3xl font-bold text-gray-900">4.8</p>
              </div>
              <span className="text-4xl">⭐</span>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/vendedor/pedidos"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-200"
          >
            <div className="text-center">
              <span className="text-5xl mb-4 block">📋</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gestionar Pedidos</h3>
              <p className="text-gray-600 text-sm">
                Ver y gestionar todos tus pedidos
              </p>
            </div>
          </Link>

          <Link
            href="/vendedor/menu"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-200"
          >
            <div className="text-center">
              <span className="text-5xl mb-4 block">🍽️</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gestionar Menús</h3>
              <p className="text-gray-600 text-sm">
                Crear y editar tus platillos
              </p>
            </div>
          </Link>

          <Link
            href="/vendedor/perfil"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-yellow-200"
          >
            <div className="text-center">
              <span className="text-5xl mb-4 block">👤</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mi Perfil</h3>
              <p className="text-gray-600 text-sm">
                Configurar tu información
              </p>
            </div>
          </Link>
        </div>

        {/* Pedidos Recientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Pedidos Recientes
          </h2>
          <div className="space-y-4">
            {[
              { id: '1', cliente: 'Juan Pérez', platillo: 'Paella Valenciana', estado: 'Nuevo', total: '€8.50' },
              { id: '2', cliente: 'María García', platillo: 'Ensalada Mediterránea', estado: 'Preparando', total: '€6.00' },
              { id: '3', cliente: 'Carlos López', platillo: 'Pasta Carbonara', estado: 'Listo', total: '€7.50' },
            ].map((pedido) => (
              <div
                key={pedido.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-900">{pedido.cliente}</p>
                  <p className="text-sm text-gray-600">{pedido.platillo}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    pedido.estado === 'Nuevo' ? 'bg-yellow-100 text-yellow-800' :
                    pedido.estado === 'Preparando' ? 'bg-blue-100 text-blue-800' :
                    pedido.estado === 'Listo' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pedido.estado}
                  </span>
                  <p className="text-sm font-bold text-primary-600 mt-1">{pedido.total}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/vendedor/pedidos"
            className="block text-center mt-6 text-primary-600 hover:text-primary-700 font-semibold"
          >
            Ver todos los pedidos →
          </Link>
        </div>
      </main>
    </div>
  );
}
