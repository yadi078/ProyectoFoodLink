'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useAlert } from '@/components/context/AlertContext';

// Datos de ejemplo - En producción vendrán de Firestore
const vendedorEjemplo = {
  id: '1',
  nombre: 'Doña María',
  descripcion: 'Especialista en comida casera tradicional española',
  calificacion: 4.8,
  totalCalificaciones: 125,
  telefono: '+34 123 456 789',
  direccion: 'Calle Principal 123, Madrid',
  horarios: {
    lunes: '12:00 - 15:00',
    martes: '12:00 - 15:00',
    miercoles: '12:00 - 15:00',
    jueves: '12:00 - 15:00',
    viernes: '12:00 - 15:00',
    sabado: 'Cerrado',
    domingo: 'Cerrado',
  },
  metodosEntrega: ['Recolección', 'Entrega a Domicilio'],
  tiempoPreparacion: '30-45 min',
  distancia: '0.5 km',
};

const menuCompleto = [
  {
    id: '1',
    nombre: 'Paella Valenciana',
    descripcion: 'Paella tradicional con mariscos y verduras frescas',
    precio: 8.50,
    imagen: '🍲',
    disponible: true,
    ingredientes: ['Arroz', 'Mariscos', 'Verduras', 'Azafrán'],
  },
  {
    id: '2',
    nombre: 'Ensalada Mediterránea',
    descripcion: 'Ensalada fresca con aceitunas y queso feta',
    precio: 6.00,
    imagen: '🥗',
    disponible: true,
    ingredientes: ['Lechuga', 'Tomate', 'Aceitunas', 'Queso Feta'],
  },
  {
    id: '3',
    nombre: 'Tortilla Española',
    descripcion: 'Tortilla tradicional con patatas',
    precio: 5.50,
    imagen: '🥔',
    disponible: false,
    ingredientes: ['Huevos', 'Patatas', 'Cebolla'],
  },
];

export default function VendedorPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handlePedido = (menuId: string) => {
    router.push(`/estudiante/pedido/${menuId}`);
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
        {/* Header con Botón Volver */}
        <Link
          href="/estudiante/menu"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          ← Volver al Catálogo
        </Link>

        {/* Información del Vendedor */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Foto del Vendedor */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-green-100 rounded-full flex items-center justify-center text-6xl">
                👨‍🍳
              </div>
            </div>

            {/* Información Principal */}
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {vendedorEjemplo.nombre}
              </h1>
              <p className="text-gray-600 mb-4">{vendedorEjemplo.descripcion}</p>

              {/* Calificación */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-2xl">⭐</span>
                  <span className="text-xl font-bold text-gray-900 ml-1">
                    {vendedorEjemplo.calificacion}
                  </span>
                </div>
                <span className="text-gray-500">
                  ({vendedorEjemplo.totalCalificaciones} calificaciones)
                </span>
              </div>

              {/* Información de Contacto */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📍</span>
                  <div>
                    <p className="font-semibold text-gray-900">Ubicación</p>
                    <p className="text-gray-600">{vendedorEjemplo.direccion}</p>
                    <p className="text-sm text-green-600 font-semibold">
                      A {vendedorEjemplo.distancia} de distancia
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📱</span>
                  <div>
                    <p className="font-semibold text-gray-900">Teléfono</p>
                    <a
                      href={`tel:${vendedorEjemplo.telefono}`}
                      className="text-primary-600 hover:underline"
                    >
                      {vendedorEjemplo.telefono}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">⏰</span>
                  <div>
                    <p className="font-semibold text-gray-900">Tiempo de Preparación</p>
                    <p className="text-gray-600">{vendedorEjemplo.tiempoPreparacion}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🚚</span>
                  <div>
                    <p className="font-semibold text-gray-900">Métodos de Entrega</p>
                    <p className="text-gray-600">
                      {vendedorEjemplo.metodosEntrega.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horarios */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📅 Horarios de Atención</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {Object.entries(vendedorEjemplo.horarios).map(([dia, horario]) => (
              <div
                key={dia}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-semibold text-gray-700 capitalize">{dia}</span>
                <span
                  className={`${
                    horario === 'Cerrado' ? 'text-red-600' : 'text-green-600 font-semibold'
                  }`}
                >
                  {horario}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Menú Completo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🍽️ Menú Completo</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuCompleto.map((plato) => (
              <div
                key={plato.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border-2 ${
                  plato.disponible
                    ? 'border-transparent hover:border-primary-200'
                    : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="p-6">
                  <div className="text-6xl text-center mb-4">{plato.imagen}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plato.nombre}</h3>
                  <p className="text-gray-600 text-sm mb-3">{plato.descripcion}</p>

                  {/* Ingredientes */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Ingredientes:</p>
                    <div className="flex flex-wrap gap-1">
                      {plato.ingredientes.map((ing, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-2xl font-bold text-primary-600">
                      €{plato.precio.toFixed(2)}
                    </p>
                    {!plato.disponible && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                        Agotado
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handlePedido(plato.id)}
                    disabled={!plato.disponible}
                    className={`w-full btn-primary ${
                      !plato.disponible
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {plato.disponible ? 'Hacer Pedido' : 'No Disponible'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calificaciones */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ⭐ Calificaciones y Reseñas
          </h2>
          <Link
            href={`/estudiante/calificaciones?vendedor=${vendedorEjemplo.id}`}
            className="btn-outline inline-block"
          >
            Ver Todas las Reseñas
          </Link>
        </div>
      </div>
    </div>
  );
}

