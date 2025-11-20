'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAlert } from '@/components/context/AlertContext';

const configSchema = z.object({
  tasaComision: z.number().min(0).max(100),
  textoLegal: z.string().optional(),
  emailContacto: z.string().email('Email no válido'),
  telefonoContacto: z.string().optional(),
});

type ConfigFormData = z.infer<typeof configSchema>;

export default function ConfigPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showAlert } = useAlert();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      tasaComision: 10,
      emailContacto: 'contacto@foodlink.com',
      telefonoContacto: '+34 123 456 789',
      textoLegal: 'Términos y condiciones...',
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const onSubmit = async (data: ConfigFormData) => {
    setIsSaving(true);
    try {
      // TODO: Guardar configuración en Firestore
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showAlert('Configuración guardada exitosamente', 'success');
    } catch (error) {
      showAlert('Error al guardar la configuración', 'error');
    } finally {
      setIsSaving(false);
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
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Configuración Global</h1>
          <p className="text-gray-600">Gestiona parámetros y configuraciones del sistema</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Configuración Financiera */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">💰 Configuración Financiera</h2>
            <div>
              <label htmlFor="tasaComision" className="form-label">
                Tasa de Comisión (%) *
              </label>
              <input
                id="tasaComision"
                type="number"
                step="0.1"
                min="0"
                max="100"
                className={`form-input ${errors.tasaComision ? 'form-input-error' : ''}`}
                {...register('tasaComision', { valueAsNumber: true })}
              />
              {errors.tasaComision && (
                <p className="form-error">{errors.tasaComision.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Porcentaje de comisión que FoodLink cobra a los vendedores
              </p>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📧 Información de Contacto</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emailContacto" className="form-label">
                  Email de Contacto *
                </label>
                <input
                  id="emailContacto"
                  type="email"
                  className={`form-input ${errors.emailContacto ? 'form-input-error' : ''}`}
                  {...register('emailContacto')}
                />
                {errors.emailContacto && (
                  <p className="form-error">{errors.emailContacto.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="telefonoContacto" className="form-label">
                  Teléfono de Contacto
                </label>
                <input
                  id="telefonoContacto"
                  type="tel"
                  className="form-input"
                  {...register('telefonoContacto')}
                />
              </div>
            </div>
          </div>

          {/* Textos Legales */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📜 Textos Legales</h2>
            <div>
              <label htmlFor="textoLegal" className="form-label">
                Términos y Condiciones
              </label>
              <textarea
                id="textoLegal"
                rows={8}
                className="form-input"
                placeholder="Ingresa los términos y condiciones..."
                {...register('textoLegal')}
              />
              <p className="text-xs text-gray-500 mt-1">
                Este texto aparecerá en los términos y condiciones de la plataforma
              </p>
            </div>
          </div>

          {/* Categorías de Comida */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🍽️ Categorías de Comida</h2>
            <div className="space-y-3">
              {['Italiana', 'Española', 'Mexicana', 'Asiática', 'Vegetariana', 'Vegana'].map(
                (categoria) => (
                  <label key={categoria} className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span className="ml-2 text-gray-700">{categoria}</span>
                  </label>
                )
              )}
            </div>
            <button
              type="button"
              className="mt-4 text-primary-600 hover:text-primary-700 font-semibold text-sm"
            >
              + Agregar Categoría
            </button>
          </div>

          {/* Botón de Guardar */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary"
            >
              {isSaving ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

