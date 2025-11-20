'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAlert } from '@/components/context/AlertContext';

const calificacionSchema = z.object({
  calificacion: z.number().min(1).max(5),
  comentario: z.string().min(10, 'El comentario debe tener al menos 10 caracteres'),
});

type CalificacionFormData = z.infer<typeof calificacionSchema>;

// Datos de ejemplo - En producción vendrán de Firestore
const calificacionesEjemplo = [
  {
    id: '1',
    vendedor: {
      id: '1',
      nombre: 'Doña María',
    },
    platillo: 'Paella Valenciana',
    calificacion: 5,
    comentario: '¡Excelente! La paella estaba deliciosa y muy bien preparada. Definitivamente volveré a pedir.',
    fecha: '2024-01-15',
  },
  {
    id: '2',
    vendedor: {
      id: '2',
      nombre: 'Cocina Casera Ana',
    },
    platillo: 'Ensalada Mediterránea',
    calificacion: 4,
    comentario: 'Muy fresca y rica, aunque esperaba un poco más de cantidad. Buen servicio en general.',
    fecha: '2024-01-10',
  },
];

export default function CalificacionesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const { showAlert } = useAlert();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [vendedorId, setVendedorId] = useState<string | null>(
    searchParams.get('vendedor')
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CalificacionFormData>({
    resolver: zodResolver(calificacionSchema),
    defaultValues: {
      calificacion: 5,
      comentario: '',
    },
  });

  const calificacionSeleccionada = watch('calificacion');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const onSubmit = async (data: CalificacionFormData) => {
    try {
      // TODO: Guardar calificación en Firestore
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showAlert('¡Calificación enviada exitosamente!', 'success');
      reset();
      setMostrarFormulario(false);
    } catch (error) {
      showAlert('Error al enviar la calificación. Intenta de nuevo.', 'error');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ⭐ Mis Calificaciones y Reseñas
          </h1>
          <p className="text-gray-600">Gestiona tus reseñas y calificaciones</p>
        </div>

        {/* Botón para Nueva Calificación */}
        <div className="mb-6">
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="btn-primary"
          >
            {mostrarFormulario ? 'Cancelar' : '+ Nueva Calificación'}
          </button>
        </div>

        {/* Formulario de Calificación */}
        {mostrarFormulario && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Dejar una Calificación
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="form-label">Selecciona el Vendedor</label>
                <select className="form-input">
                  <option>Selecciona un vendedor...</option>
                  <option value="1">Doña María</option>
                  <option value="2">Cocina Casera Ana</option>
                  <option value="3">Ristorante Italiano</option>
                </select>
              </div>

              <div>
                <label className="form-label">Selecciona el Platillo</label>
                <select className="form-input">
                  <option>Selecciona un platillo...</option>
                  <option value="1">Paella Valenciana</option>
                  <option value="2">Ensalada Mediterránea</option>
                  <option value="3">Pasta Carbonara</option>
                </select>
              </div>

              <div>
                <label className="form-label mb-4 block">
                  Calificación: {calificacionSeleccionada} ⭐
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((estrella) => (
                    <button
                      key={estrella}
                      type="button"
                      onClick={() => {
                        const setValue = register('calificacion').onChange;
                        setValue({
                          target: { name: 'calificacion', value: estrella },
                        } as any);
                      }}
                      className={`text-4xl transition-transform hover:scale-110 ${
                        estrella <= calificacionSeleccionada
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <input
                  type="hidden"
                  {...register('calificacion', { valueAsNumber: true })}
                />
                {errors.calificacion && (
                  <p className="form-error">{errors.calificacion.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="comentario" className="form-label">
                  Comentario *
                </label>
                <textarea
                  id="comentario"
                  rows={5}
                  className={`form-input ${errors.comentario ? 'form-input-error' : ''}`}
                  placeholder="Comparte tu experiencia con este platillo..."
                  {...register('comentario')}
                />
                {errors.comentario && (
                  <p className="form-error">{errors.comentario.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 10 caracteres. Sé específico sobre tu experiencia.
                </p>
              </div>

              <button type="submit" className="btn-primary">
                Enviar Calificación
              </button>
            </form>
          </div>
        )}

        {/* Mis Calificaciones */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Mis Calificaciones Anteriores
          </h2>

          {calificacionesEjemplo.length > 0 ? (
            calificacionesEjemplo.map((calificacion) => (
              <div
                key={calificacion.id}
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-600"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {calificacion.platillo}
                    </h3>
                    <p className="text-gray-600">
                      Vendedor: {calificacion.vendedor.nombre}
                    </p>
                    <p className="text-sm text-gray-500">{calificacion.fecha}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span
                        key={idx}
                        className={`text-2xl ${
                          idx < calificacion.calificacion
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {calificacion.comentario}
                </p>

                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors">
                    Editar
                  </button>
                  <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors">
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">
                No has realizado ninguna calificación aún
              </p>
              <p className="text-gray-500">
                ¡Comienza a calificar tus pedidos y ayuda a otros estudiantes!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

