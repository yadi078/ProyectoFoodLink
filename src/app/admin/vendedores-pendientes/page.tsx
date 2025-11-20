'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useAlert } from '@/components/context/AlertContext';

interface VendedorPendiente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  descripcion: string;
  fechaSolicitud: string;
  documentos: string[];
}

const vendedoresPendientes: VendedorPendiente[] = [
  {
    id: '1',
    nombre: 'Ana Martínez',
    email: 'ana@ejemplo.com',
    telefono: '+34 123 456 789',
    direccion: 'Calle Nueva 45, Madrid',
    descripcion: 'Cocina casera tradicional con recetas familiares',
    fechaSolicitud: '2024-01-14',
    documentos: ['DNI', 'Permiso de Venta'],
  },
  {
    id: '2',
    nombre: 'Pedro Sánchez',
    email: 'pedro@ejemplo.com',
    telefono: '+34 987 654 321',
    direccion: 'Avenida Principal 78, Barcelona',
    descripcion: 'Comida vegana y saludable',
    fechaSolicitud: '2024-01-13',
    documentos: ['DNI'],
  },
];

export default function VendedoresPendientesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showAlert } = useAlert();

  const [solicitudes, setSolicitudes] = useState<VendedorPendiente[]>(vendedoresPendientes);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const aprobarVendedor = async (id: string) => {
    try {
      // TODO: Aprobar vendedor en Firestore
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSolicitudes((prev) => prev.filter((v) => v.id !== id));
      showAlert('Vendedor aprobado exitosamente', 'success');
    } catch (error) {
      showAlert('Error al aprobar el vendedor', 'error');
    }
  };

  const rechazarVendedor = async (id: string, motivo?: string) => {
    if (!confirm('¿Estás seguro de rechazar esta solicitud?')) return;

    try {
      // TODO: Rechazar vendedor en Firestore
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSolicitudes((prev) => prev.filter((v) => v.id !== id));
      showAlert('Solicitud rechazada', 'success');
    } catch (error) {
      showAlert('Error al rechazar la solicitud', 'error');
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ⏳ Vendedores Pendientes de Aprobación
          </h1>
          <p className="text-gray-600">Revisa y aprueba nuevas solicitudes de vendedores</p>
        </div>

        {/* Lista de Solicitudes */}
        {solicitudes.length > 0 ? (
          <div className="space-y-6">
            {solicitudes.map((vendedor) => (
              <div
                key={vendedor.id}
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Información del Vendedor */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{vendedor.nombre}</h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Email</p>
                        <p className="text-gray-900">{vendedor.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Teléfono</p>
                        <p className="text-gray-900">{vendedor.telefono}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Dirección</p>
                        <p className="text-gray-900">{vendedor.direccion}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Descripción</p>
                        <p className="text-gray-900">{vendedor.descripcion}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Fecha de Solicitud</p>
                        <p className="text-gray-900">{vendedor.fechaSolicitud}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documentos y Acciones */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">📄 Documentos</h3>
                    <div className="space-y-2 mb-6">
                      {vendedor.documentos.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-gray-700">{doc}</span>
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                            Ver documento
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => aprobarVendedor(vendedor.id)}
                        className="btn-primary flex-1"
                      >
                        ✅ Aprobar
                      </button>
                      <button
                        onClick={() => rechazarVendedor(vendedor.id)}
                        className="px-6 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-semibold transition-colors"
                      >
                        ❌ Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No hay solicitudes pendientes</p>
            <p className="text-gray-500">¡Todo está al día!</p>
          </div>
        )}
      </div>
    </div>
  );
}

