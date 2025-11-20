'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useAlert } from '@/components/context/AlertContext';

type TipoReporte = 'Calidad' | 'Fraude' | 'Comportamiento' | 'Otro';
type EstadoReporte = 'Pendiente' | 'En Revisión' | 'Resuelto' | 'Descartado';

interface Reporte {
  id: string;
  tipo: TipoReporte;
  estado: EstadoReporte;
  reportadoPor: string;
  reportadoA: string;
  descripcion: string;
  fecha: string;
  prioridad: 'Baja' | 'Media' | 'Alta';
}

const reportesEjemplo: Reporte[] = [
  {
    id: '1',
    tipo: 'Calidad',
    estado: 'Pendiente',
    reportadoPor: 'Juan Pérez',
    reportadoA: 'Doña María',
    descripcion: 'La comida llegó fría y el sabor no era el esperado',
    fecha: '2024-01-15',
    prioridad: 'Media',
  },
  {
    id: '2',
    tipo: 'Fraude',
    estado: 'En Revisión',
    reportadoPor: 'María García',
    reportadoA: 'Cocina Casera Ana',
    descripcion: 'Sospecha de sobreprecio en los pedidos',
    fecha: '2024-01-14',
    prioridad: 'Alta',
  },
];

export default function ReportesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showAlert } = useAlert();

  const [reportes, setReportes] = useState<Reporte[]>(reportesEjemplo);
  const [filtroTipo, setFiltroTipo] = useState<TipoReporte | 'Todos'>('Todos');
  const [filtroEstado, setFiltroEstado] = useState<EstadoReporte | 'Todos'>('Todos');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const reportesFiltrados = reportes.filter((r) => {
    const coincideTipo = filtroTipo === 'Todos' || r.tipo === filtroTipo;
    const coincideEstado = filtroEstado === 'Todos' || r.estado === filtroEstado;
    return coincideTipo && coincideEstado;
  });

  const cambiarEstado = async (id: string, nuevoEstado: EstadoReporte) => {
    try {
      // TODO: Actualizar estado en Firestore
      await new Promise((resolve) => setTimeout(resolve, 500));
      setReportes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
      );
      showAlert('Estado del reporte actualizado', 'success');
    } catch (error) {
      showAlert('Error al actualizar el reporte', 'error');
    }
  };

  const getPrioridadStyles = (prioridad: string) => {
    const styles = {
      Alta: 'bg-red-100 text-red-800 border-red-300',
      Media: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Baja: 'bg-green-100 text-green-800 border-green-300',
    };
    return styles[prioridad as keyof typeof styles];
  };

  const getEstadoStyles = (estado: EstadoReporte) => {
    const styles = {
      Pendiente: 'bg-yellow-100 text-yellow-800',
      'En Revisión': 'bg-blue-100 text-blue-800',
      Resuelto: 'bg-green-100 text-green-800',
      Descartado: 'bg-gray-100 text-gray-800',
    };
    return styles[estado];
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Gestión de Reportes</h1>
          <p className="text-gray-600">Revisa y gestiona reportes y quejas</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Tipo
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as TipoReporte | 'Todos')}
                className="form-input w-full"
              >
                <option value="Todos">Todos</option>
                <option value="Calidad">Calidad</option>
                <option value="Fraude">Fraude</option>
                <option value="Comportamiento">Comportamiento</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Estado
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as EstadoReporte | 'Todos')}
                className="form-input w-full"
              >
                <option value="Todos">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Revisión">En Revisión</option>
                <option value="Resuelto">Resuelto</option>
                <option value="Descartado">Descartado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Reportes */}
        <div className="space-y-4">
          {reportesFiltrados.length > 0 ? (
            reportesFiltrados.map((reporte) => (
              <div
                key={reporte.id}
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-600"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoStyles(reporte.estado)}`}>
                        {reporte.estado}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPrioridadStyles(reporte.prioridad)}`}>
                        {reporte.prioridad}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        {reporte.tipo}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Reporte #{reporte.id}
                    </h3>
                    <p className="text-gray-600 mb-3">{reporte.descripcion}</p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Reportado por: </span>
                        <span className="text-gray-900">{reporte.reportadoPor}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Reportado a: </span>
                        <span className="text-gray-900">{reporte.reportadoA}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Fecha: </span>
                        <span className="text-gray-900">{reporte.fecha}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {reporte.estado === 'Pendiente' && (
                      <>
                        <button
                          onClick={() => cambiarEstado(reporte.id, 'En Revisión')}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          Revisar
                        </button>
                        <button
                          onClick={() => cambiarEstado(reporte.id, 'Descartado')}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-semibold"
                        >
                          Descartar
                        </button>
                      </>
                    )}
                    {reporte.estado === 'En Revisión' && (
                      <>
                        <button
                          onClick={() => cambiarEstado(reporte.id, 'Resuelto')}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          Marcar Resuelto
                        </button>
                        <button
                          onClick={() => cambiarEstado(reporte.id, 'Descartado')}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-semibold"
                        >
                          Descartar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-600 text-lg">No hay reportes con los filtros seleccionados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

