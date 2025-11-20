'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useAlert } from '@/components/context/AlertContext';

type Rol = 'Estudiante' | 'Vendedor' | 'Admin';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  estado: 'Activo' | 'Bloqueado';
  fechaRegistro: string;
  ultimaActividad: string;
}

const usuariosEjemplo: Usuario[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    rol: 'Estudiante',
    estado: 'Activo',
    fechaRegistro: '2024-01-10',
    ultimaActividad: 'Hace 2 horas',
  },
  {
    id: '2',
    nombre: 'Doña María',
    email: 'maria@ejemplo.com',
    rol: 'Vendedor',
    estado: 'Activo',
    fechaRegistro: '2024-01-05',
    ultimaActividad: 'Hace 30 min',
  },
  {
    id: '3',
    nombre: 'Carlos López',
    email: 'carlos@ejemplo.com',
    rol: 'Estudiante',
    estado: 'Bloqueado',
    fechaRegistro: '2023-12-20',
    ultimaActividad: 'Hace 5 días',
  },
];

export default function UsuariosPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showAlert } = useAlert();

  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosEjemplo);
  const [filtroRol, setFiltroRol] = useState<Rol | 'Todos'>('Todos');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Activo' | 'Bloqueado'>('Todos');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideRol = filtroRol === 'Todos' || u.rol === filtroRol;
    const coincideEstado = filtroEstado === 'Todos' || u.estado === filtroEstado;
    const coincideBusqueda =
      busqueda === '' ||
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase());
    return coincideRol && coincideEstado && coincideBusqueda;
  });

  const toggleEstado = async (id: string) => {
    try {
      // TODO: Actualizar estado en Firestore
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, estado: u.estado === 'Activo' ? 'Bloqueado' : 'Activo' }
            : u
        )
      );
      showAlert('Estado del usuario actualizado', 'success');
    } catch (error) {
      showAlert('Error al actualizar el estado', 'error');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">👥 Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra y modera todas las cuentas</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Rol
              </label>
              <select
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value as Rol | 'Todos')}
                className="form-input w-full"
              >
                <option value="Todos">Todos</option>
                <option value="Estudiante">Estudiantes</option>
                <option value="Vendedor">Vendedores</option>
                <option value="Admin">Admins</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Estado
              </label>
              <select
                value={filtroEstado}
                onChange={(e) =>
                  setFiltroEstado(e.target.value as 'Todos' | 'Activo' | 'Bloqueado')
                }
                className="form-input w-full"
              >
                <option value="Todos">Todos</option>
                <option value="Activo">Activos</option>
                <option value="Bloqueado">Bloqueados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {usuario.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{usuario.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            usuario.rol === 'Admin'
                              ? 'bg-purple-100 text-purple-800'
                              : usuario.rol === 'Vendedor'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            usuario.estado === 'Activo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {usuario.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usuario.ultimaActividad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleEstado(usuario.id)}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                            usuario.estado === 'Activo'
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                        >
                          {usuario.estado === 'Activo' ? 'Bloquear' : 'Desbloquear'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No se encontraron usuarios con los filtros seleccionados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{usuarios.length}</p>
              <p className="text-sm text-gray-600">Total de Usuarios</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {usuarios.filter((u) => u.rol === 'Estudiante').length}
              </p>
              <p className="text-sm text-gray-600">Estudiantes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {usuarios.filter((u) => u.rol === 'Vendedor').length}
              </p>
              <p className="text-sm text-gray-600">Vendedores</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">
                {usuarios.filter((u) => u.estado === 'Bloqueado').length}
              </p>
              <p className="text-sm text-gray-600">Bloqueados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

