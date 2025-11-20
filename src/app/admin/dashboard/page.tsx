'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

// TODO: Implementar verificación de rol admin en Firebase
const esAdmin = false; // Por ahora, en producción se verificará desde Firestore

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    // TODO: Verificar si el usuario es admin
    // if (!loading && user && !esAdmin) {
    //   router.push('/');
    // }
  }, [user, loading, router]);

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Panel de Administración</h1>
          <p className="text-gray-600">Vista general del sistema y métricas clave</p>
        </div>

        {/* Métricas Generales */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuarios Activos</p>
                <p className="text-3xl font-bold text-gray-900">1,245</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% este mes</p>
              </div>
              <span className="text-4xl">👥</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vendedores</p>
                <p className="text-3xl font-bold text-gray-900">87</p>
                <p className="text-xs text-green-600 mt-1">↑ 5% este mes</p>
              </div>
              <span className="text-4xl">👨‍🍳</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos Totales</p>
                <p className="text-3xl font-bold text-gray-900">3,456</p>
                <p className="text-xs text-green-600 mt-1">↑ 18% este mes</p>
              </div>
              <span className="text-4xl">📦</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ingresos Totales</p>
                <p className="text-3xl font-bold text-gray-900">€28,932</p>
                <p className="text-xs text-green-600 mt-1">↑ 22% este mes</p>
              </div>
              <span className="text-4xl">💰</span>
            </div>
          </div>
        </div>

        {/* Gráficas y Estadísticas */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Distribución de Usuarios */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Distribución de Usuarios</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Estudiantes</span>
                  <span className="font-semibold text-gray-900">1,158 (93%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-primary-600 h-4 rounded-full"
                    style={{ width: '93%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Vendedores</span>
                  <span className="font-semibold text-gray-900">87 (7%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{ width: '7%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Actividad Reciente</h2>
            <div className="space-y-3">
              {[
                { accion: 'Nuevo pedido', usuario: 'Juan Pérez', tiempo: 'Hace 5 min' },
                { accion: 'Vendedor registrado', usuario: 'Cocina Ana', tiempo: 'Hace 15 min' },
                { accion: 'Pedido completado', usuario: 'María García', tiempo: 'Hace 30 min' },
                { accion: 'Calificación agregada', usuario: 'Carlos López', tiempo: 'Hace 1 hora' },
              ].map((actividad, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{actividad.accion}</p>
                    <p className="text-sm text-gray-600">{actividad.usuario}</p>
                  </div>
                  <span className="text-xs text-gray-500">{actividad.tiempo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="grid md:grid-cols-5 gap-6">
          {[
            { titulo: 'Usuarios', ruta: '/admin/usuarios', icono: '👥', color: 'primary' },
            { titulo: 'Vendedores Pendientes', ruta: '/admin/vendedores-pendientes', icono: '⏳', color: 'yellow' },
            { titulo: 'Reportes', ruta: '/admin/reportes', icono: '📋', color: 'green' },
            { titulo: 'Configuración', ruta: '/admin/config', icono: '⚙️', color: 'blue' },
            { titulo: 'Analytics', ruta: '/admin/analytics', icono: '📊', color: 'purple' },
          ].map((item) => (
            <Link
              key={item.titulo}
              href={item.ruta}
              className={`bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow border-2 border-transparent hover:border-${item.color}-200`}
            >
              <div className="text-5xl mb-4">{item.icono}</div>
              <h3 className="text-lg font-bold text-gray-900">{item.titulo}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

