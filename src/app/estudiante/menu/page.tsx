'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useAlert } from '@/components/context/AlertContext';

// Datos de ejemplo - En producción vendrán de Firestore
const menusEjemplo = [
  {
    id: '1',
    nombre: 'Paella Valenciana',
    descripcion: 'Paella tradicional con mariscos y verduras',
    precio: 8.50,
    imagen: '🍲',
    vendedor: {
      nombre: 'Doña María',
      calificacion: 4.8,
    },
    disponible: true,
  },
  {
    id: '2',
    nombre: 'Ensalada Mediterránea',
    descripcion: 'Ensalada fresca con aceitunas y queso feta',
    precio: 6.00,
    imagen: '🥗',
    vendedor: {
      nombre: 'Cocina Casera Ana',
      calificacion: 4.5,
    },
    disponible: true,
  },
  {
    id: '3',
    nombre: 'Pasta Carbonara',
    descripcion: 'Pasta cremosa con bacon y queso parmesano',
    precio: 7.50,
    imagen: '🍝',
    vendedor: {
      nombre: 'Ristorante Italiano',
      calificacion: 4.9,
    },
    disponible: false,
  },
];

export default function MenuPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showAlert } = useAlert();
  const [filtro, setFiltro] = useState('');
  const [tipoComida, setTipoComida] = useState('todos');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const menusFiltrados = menusEjemplo.filter((menu) => {
    const coincideNombre = menu.nombre.toLowerCase().includes(filtro.toLowerCase());
    const coincideDisponible = tipoComida === 'todos' || 
      (tipoComida === 'disponible' && menu.disponible) ||
      (tipoComida === 'agotado' && !menu.disponible);
    return coincideNombre && coincideDisponible;
  });

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🍽️ Catálogo de Menús
          </h1>
          <p className="text-gray-600">
            Explora los menús disponibles de vendedores cercanos
          </p>
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
                placeholder="Buscar menús..."
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
                  <div className="text-6xl text-center mb-4">{menu.imagen}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {menu.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{menu.descripcion}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">
                        €{menu.precio.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">{menu.vendedor.nombre}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-yellow-500">
                        <span>⭐</span>
                        <span className="ml-1 font-semibold">
                          {menu.vendedor.calificacion}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/estudiante/vendedor/${menu.id}`}
                      className="btn-outline flex-1 text-center text-sm"
                    >
                      Ver Detalles
                    </Link>
                    <button
                      onClick={() => {
                        if (menu.disponible) {
                          router.push(`/estudiante/pedido/${menu.id}`);
                        } else {
                          showAlert('Este menú no está disponible en este momento', 'warning');
                        }
                      }}
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
            <p className="text-gray-600 text-lg">
              No se encontraron menús con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

