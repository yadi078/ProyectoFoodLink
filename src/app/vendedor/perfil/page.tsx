'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAlert } from '@/components/context/AlertContext';
import Link from 'next/link';
import { logoutVendedor } from '@/services/auth/authService';
import { getCurrentVendedor } from '@/services/auth/authService';
import type { Vendedor } from '@/lib/firebase/types';

const perfilSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('El correo electrónico no es válido'),
  telefono: z.string().optional(),
  descripcion: z.string().optional(),
  direccion: z.string().optional(),
  horarios: z.object({
    lunes: z.string().optional(),
    martes: z.string().optional(),
    miercoles: z.string().optional(),
    jueves: z.string().optional(),
    viernes: z.string().optional(),
    sabado: z.string().optional(),
    domingo: z.string().optional(),
  }).optional(),
});

type PerfilFormData = z.infer<typeof perfilSchema>;

export default function PerfilVendedorPage() {
  const router = useRouter();
  const { user, vendedor, loading } = useAuth();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [vendedorData, setVendedorData] = useState<Vendedor | null>(null);

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
    if (vendedor) {
      setVendedorData(vendedor);
      reset({
        nombre: vendedor.nombre,
        email: vendedor.email,
        telefono: vendedor.telefono || '',
        descripcion: '',
        direccion: '',
        horarios: {
          lunes: '12:00 - 15:00',
          martes: '12:00 - 15:00',
          miercoles: '12:00 - 15:00',
          jueves: '12:00 - 15:00',
          viernes: '12:00 - 15:00',
          sabado: 'Cerrado',
          domingo: 'Cerrado',
        },
      });
    }
  }, [user, vendedor, loading, router, reset]);

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

  if (!user || !vendedor) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/vendedor/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">👤 Mi Perfil</h1>
          <p className="text-gray-600">Gestiona la información de tu negocio</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Formulario de Perfil */}
          <div className="md:col-span-2 space-y-6">
            {/* Información Básica */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Información del Negocio</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="form-label">
                    Nombre del Negocio *
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
                    Teléfono de Contacto
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    className={`form-input ${errors.telefono ? 'form-input-error' : ''}`}
                    placeholder="+34 123 456 789"
                    {...register('telefono')}
                  />
                </div>

                <div>
                  <label htmlFor="descripcion" className="form-label">
                    Descripción del Negocio
                  </label>
                  <textarea
                    id="descripcion"
                    rows={4}
                    className="form-input"
                    placeholder="Describe tu negocio, especialidades, etc."
                    {...register('descripcion')}
                  />
                </div>

                <div>
                  <label htmlFor="direccion" className="form-label">
                    Dirección de Recolección
                  </label>
                  <textarea
                    id="direccion"
                    rows={2}
                    className="form-input"
                    placeholder="Calle, número, ciudad..."
                    {...register('direccion')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Dirección donde los estudiantes pueden recoger sus pedidos
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

            {/* Horarios */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">📅 Horarios de Atención</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(
                  (dia) => (
                    <div key={dia}>
                      <label className="form-label capitalize">{dia}</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ej: 12:00 - 15:00 o Cerrado"
                        {...register(`horarios.${dia as keyof PerfilFormData['horarios']}`)}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Estadísticas</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Total de ventas</p>
                  <p className="text-2xl font-bold text-gray-900">€1,245.50</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pedidos completados</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Calificación promedio</p>
                  <p className="text-2xl font-bold text-gray-900">4.8 ⭐</p>
                </div>
              </div>
            </div>

            {/* Configuración de Notificaciones */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🔔 Notificaciones</h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" defaultChecked />
                  <span className="ml-2 text-gray-700">Notificaciones de nuevos pedidos</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" defaultChecked />
                  <span className="ml-2 text-gray-700">Notificaciones de mensajes</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
                  <span className="ml-2 text-gray-700">Notificaciones de calificaciones</span>
                </label>
              </div>
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

