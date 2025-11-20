'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useAlert } from '@/components/context/AlertContext';

// Estados de pedido
type EstadoPedido = 'Nuevo' | 'Preparando' | 'Listo' | 'Entregado' | 'Cancelado';

interface Pedido {
  id: string;
  cliente: string;
  platillo: string;
  cantidad: number;
  estado: EstadoPedido;
  total: number;
  fecha: string;
  hora: string;
  metodoEntrega: string;
  direccion?: string;
}

// Datos de ejemplo - En producción vendrán de Firestore
const pedidosEjemplo: Pedido[] = [
  {
    id: '1',
    cliente: 'Juan Pérez',
    platillo: 'Paella Valenciana',
    cantidad: 2,
    estado: 'Nuevo',
    total: 17.0,
    fecha: '2024-01-15',
    hora: '12:30',
    metodoEntrega: 'Recolección',
  },
  {
    id: '2',
    cliente: 'María García',
    platillo: 'Ensalada Mediterránea',
    cantidad: 1,
    estado: 'Preparando',
    total: 6.0,
    fecha: '2024-01-15',
    hora: '13:15',
    metodoEntrega: 'Entrega a Domicilio',
    direccion: 'Calle Mayor 45, Madrid',
  },
  {
    id: '3',
    cliente: 'Carlos López',
    platillo: 'Tortilla Española',
    cantidad: 3,
    estado: 'Listo',
    total: 16.5,
    fecha: '2024-01-15',
    hora: '14:00',
    metodoEntrega: 'Recolección',
  },
  {
    id: '4',
    cliente: 'Ana Martínez',
    platillo: 'Paella Valenciana',
    cantidad: 1,
    estado: 'Entregado',
    total: 8.5,
    fecha: '2024-01-14',
    hora: '18:30',
    metodoEntrega: 'Entrega a Domicilio',
    direccion: 'Avenida Principal 12, Madrid',
  },
];

export default function PedidosPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showAlert } = useAlert();

  const [filtroEstado, setFiltroEstado] = useState<EstadoPedido | 'Todos'>('Todos');
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosEjemplo);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const pedidosFiltrados =
    filtroEstado === 'Todos'
      ? pedidos
      : pedidos.filter((p) => p.estado === filtroEstado);

  const cambiarEstado = async (pedidoId: string, nuevoEstado: EstadoPedido) => {
    try {
      // TODO: Actualizar estado en Firestore
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: nuevoEstado } : p))
      );
      showAlert(`Pedido actualizado a "${nuevoEstado}"`, 'success');
    } catch (error) {
      showAlert('Error al actualizar el pedido', 'error');
    }
  };

  const getEstadoStyles = (estado: EstadoPedido) => {
    const styles = {
      Nuevo: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Preparando: 'bg-blue-100 text-blue-800 border-blue-300',
      Listo: 'bg-green-100 text-green-800 border-green-300',
      Entregado: 'bg-gray-100 text-gray-800 border-gray-300',
      Cancelado: 'bg-red-100 text-red-800 border-red-300',
    };
    return styles[estado];
  };

  const getSiguienteEstado = (estado: EstadoPedido): EstadoPedido | null => {
    const transiciones: Record<EstadoPedido, EstadoPedido> = {
      Nuevo: 'Preparando',
      Preparando: 'Listo',
      Listo: 'Entregado',
      Entregado: 'Entregado',
      Cancelado: 'Cancelado',
    };
    return transiciones[estado] !== estado ? transiciones[estado] : null;
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/vendedor/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Gestión de Pedidos</h1>
          <p className="text-gray-600">Gestiona todos tus pedidos y su estado</p>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {['Todos', 'Nuevo', 'Preparando', 'Listo', 'Entregado'].map((estado) => {
            const count =
              estado === 'Todos'
                ? pedidos.length
                : pedidos.filter((p) => p.estado === estado).length;
            return (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado as EstadoPedido | 'Todos')}
                className={`p-4 rounded-lg shadow-md transition-all ${
                  filtroEstado === estado
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm mt-1">{estado}</div>
              </button>
            );
          })}
        </div>

        {/* Lista de Pedidos */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platillo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrega
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pedidosFiltrados.length > 0 ? (
                  pedidosFiltrados.map((pedido) => {
                    const siguienteEstado = getSiguienteEstado(pedido.estado);
                    return (
                      <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #{pedido.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {pedido.fecha} {pedido.hora}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {pedido.cliente}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{pedido.platillo}</div>
                          <div className="text-sm text-gray-500">Cant: {pedido.cantidad}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {pedido.metodoEntrega}
                          </div>
                          {pedido.direccion && (
                            <div className="text-xs text-gray-500">{pedido.direccion}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                          €{pedido.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoStyles(
                              pedido.estado
                            )}`}
                          >
                            {pedido.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {siguienteEstado && (
                            <button
                              onClick={() => cambiarEstado(pedido.id, siguienteEstado)}
                              className="btn-primary text-sm px-4 py-2"
                            >
                              Marcar como {siguienteEstado}
                            </button>
                          )}
                          {!siguienteEstado && (
                            <span className="text-gray-400">Completado</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No hay pedidos con el filtro seleccionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

