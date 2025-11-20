'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAlert } from '@/components/context/AlertContext';
import { logoutVendedor } from '@/services/auth/authService';

const perfilSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('El correo electrónico no es válido'),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  campus: z.string().optional(),
});

type PerfilFormData = z.infer<typeof perfilSchema>;

export default function PerfilEstudiantePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    // Cargar datos del estudiante cuando esté disponible
    if (user) {
      reset({
        nombre: user.displayName || '',
        email: user.email || '',
        telefono: '',
        direccion: '',
        campus: '',
      });
    }
  }, [user, loading, router, reset]);

  const onSubmit = async (data: PerfilFormData) => {
    setIsLoading(true);
    try {
      // TODO: Actualizar perfil en Firestore
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showAlert('Perfil actualizado exitosamente', 'success');
    } catch (error) {
      showAlert('Error al actualizar el perfil', 'error');
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">👤 Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Formulario de Perfil */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Datos Personales</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="form-label">
                    Nombre Completo *
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    className={`form-input ${errors.nombre ? 'form-input-error' : ''}`}
                    {...register('nombre')}
                  />
                  {errors.nombre && (
                    <p className="form-error">{errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico *
                  </label>
                  <input
                    id="email"
                    type="email"
                    disabled
                    className="form-input bg-gray-100 cursor-not-allowed"
                    {...register('email')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    El correo electrónico no se puede modificar
                  </p>
                </div>

                <div>
                  <label htmlFor="telefono" className="form-label">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    className={`form-input ${errors.telefono ? 'form-input-error' : ''}`}
                    placeholder="+34 123 456 789"
                    {...register('telefono')}
                  />
                  {errors.telefono && (
                    <p className="form-error">{errors.telefono.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="campus" className="form-label">
                    Campus / Universidad
                  </label>
                  <input
                    id="campus"
                    type="text"
                    className={`form-input ${errors.campus ? 'form-input-error' : ''}`}
                    placeholder="Universidad de Madrid"
                    {...register('campus')}
                  />
                  {errors.campus && (
                    <p className="form-error">{errors.campus.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="direccion" className="form-label">
                    Dirección de Entrega (Opcional)
                  </label>
                  <textarea
                    id="direccion"
                    rows={3}
                    className={`form-input ${errors.direccion ? 'form-input-error' : ''}`}
                    placeholder="Calle, número, ciudad..."
                    {...register('direccion')}
                  />
                  {errors.direccion && (
                    <p className="form-error">{errors.direccion.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Esta dirección se usará para entregas a domicilio
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información de Cuenta */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mi Cuenta</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Miembro desde</p>
                  <p className="font-semibold text-gray-900">Enero 2024</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de pedidos</p>
                  <p className="font-semibold text-gray-900">12 pedidos</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Activo
                  </span>
                </div>
              </div>
            </div>

            {/* Historial de Pedidos */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Historial</h2>
              <Link
                href="/estudiante/pedidos"
                className="btn-outline text-center block w-full text-sm"
              >
                Ver Historial de Pedidos
              </Link>
            </div>

            {/* Acciones */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones</h2>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

