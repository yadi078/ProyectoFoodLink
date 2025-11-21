'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useAlert } from '@/components/context/AlertContext';
import { getPlatillosDisponibles } from '@/services/menus/menuService';
import { getVendedor } from '@/services/vendedores/vendedorService';
import type { Platillo } from '@/lib/firebase/types';
import type { Vendedor } from '@/lib/firebase/types';

interface PlatilloConVendedor extends Platillo {
  vendedorNombre?: string;
  vendedorCalificacion?: number;
}

export default function MenuPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [filtro, setFiltro] = useState('');
  const [tipoComida, setTipoComida] = useState('todos');
  const [platillos, setPlatillos] = useState<PlatilloConVendedor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPlatillos = async () => {
      setLoading(true);
      try {
        const platillosData = await getPlatillosDisponibles();
        
        // Obtener información de vendedores para cada platillo
        const platillosConVendedor = await Promise.all(
          platillosData.map(async (platillo) => {
            try {
              const vendedor = await getVendedor(platillo.vendedorId);
              return {
                ...platillo,
                vendedorNombre: vendedor?.nombre || 'Vendedor',
                vendedorCalificacion: vendedor?.calificacion || 0,
              };
            } catch (error) {
              return {
                ...platillo,
                vendedorNombre: 'Vendedor',
                vendedorCalificacion: 0,
              };
            }
          })
        );

        setPlatillos(platillosConVendedor);
      } catch (error: any) {
        showAlert(
          error.message || 'Error al cargar los menús. Por favor, intenta de nuevo.',
          'error'
        );
      } finally {
        setLoading(false);
      }
    };

    cargarPlatillos();
  }, [showAlert]);

  const menusFiltrados = platillos.filter((menu) => {
    const coincideNombre = menu.nombre.toLowerCase().includes(filtro.toLowerCase());
    const coincideDisponible =
      tipoComida === 'todos' ||
      (tipoComida === 'disponible' && menu.disponible) ||
      (tipoComida === 'agotado' && !menu.disponible);
    return coincideNombre && coincideDisponible;
  });

  const handlePedido = (menuId: string, disponible: boolean) => {
    if (!disponible) {
      showAlert('Este menú no está disponible en este momento', 'warning');
      return;
    }

    if (!user) {
      showAlert('Debes iniciar sesión para hacer un pedido', 'info');
      router.push('/login');
      return;
    }

    router.push(`/estudiante/pedido/${menuId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando menús...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🍽️ Menú Disponible
          </h1>
          <p className="text-gray-600">
            Explora los platillos disponibles de nuestros cocineros locales
          </p>
          {!user && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                💡 <strong>Nota:</strong> Necesitas{' '}
                <Link href="/login" className="underline font-semibold">iniciar sesión</Link> o{' '}
                <Link href="/registro" className="underline font-semibold">registrarte</Link> para hacer pedidos
              </p>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por nombre
              </label>
              <input
                type="text"
                placeholder="Buscar platillos..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por disponibilidad
              </label>
              <select
                value={tipoComida}
                onChange={(e) => setTipoComida(e.target.value)}
                className="form-input w-full"
              >
                <option value="todos">Todos</option>
                <option value="disponible">Disponibles</option>
                <option value="agotado">Agotados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Menús */}
        {menusFiltrados.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menusFiltrados.map((menu) => (
              <div
                key={menu.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border-2 border-transparent hover:border-primary-200"
              >
                <div className="p-6">
                  <div className="text-6xl text-center mb-4">
                    {menu.imagen || '🍽️'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {menu.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{menu.descripcion}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">
                        €{menu.precio.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {menu.vendedorNombre || 'Vendedor'}
                      </p>
                    </div>
                    <div className="text-right">
                      {menu.vendedorCalificacion && menu.vendedorCalificacion > 0 && (
                        <div className="flex items-center text-yellow-500">
                          <span>⭐</span>
                          <span className="ml-1 font-semibold">
                            {menu.vendedorCalificacion.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/estudiante/vendedor/${menu.vendedorId}`}
                      className="btn-outline flex-1 text-center text-sm"
                    >
                      Ver Detalles
                    </Link>
                    <button
                      onClick={() => handlePedido(menu.id, menu.disponible)}
                      disabled={!menu.disponible}
                      className={`btn-primary flex-1 text-sm ${
                        !menu.disponible ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {menu.disponible ? 'Pedir Ahora' : 'Agotado'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            {platillos.length === 0 ? (
              <>
                <p className="text-gray-600 text-lg mb-4">
                  No hay menús disponibles en este momento
                </p>
                <p className="text-gray-500">
                  Los cocineros están preparando nuevos platillos. ¡Vuelve pronto!
                </p>
              </>
            ) : (
              <p className="text-gray-600 text-lg">
                No se encontraron menús con los filtros seleccionados.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

