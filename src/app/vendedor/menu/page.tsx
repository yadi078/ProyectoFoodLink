'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAlert } from '@/components/context/AlertContext';
import {
  getPlatillosPorVendedor,
  crearPlatillo,
  updatePlatillo,
  eliminarPlatillo,
  toggleDisponibilidad as toggleDisponibilidadService,
} from '@/services/menus/menuService';
import type { Platillo } from '@/lib/firebase/types';

const platilloSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  precio: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  ingredientes: z.string().optional(),
  disponible: z.boolean(),
});

type PlatilloFormData = z.infer<typeof platilloSchema>;

interface Platillo {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  ingredientes: string[];
  disponible: boolean;
}

// Los platillos se cargarán desde Firestore

export default function MenuPage() {
  const router = useRouter();
  const { user, vendedor, loading: authLoading } = useAuth();
  const { showAlert } = useAlert();

  const [platillos, setPlatillos] = useState<Platillo[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoPlatillo, setEditandoPlatillo] = useState<Platillo | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PlatilloFormData>({
    resolver: zodResolver(platilloSchema),
    defaultValues: {
      disponible: true,
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const cargarPlatillos = async () => {
      if (!user || !vendedor) return;

      setLoading(true);
      try {
        const platillosData = await getPlatillosPorVendedor(vendedor.uid);
        setPlatillos(platillosData);
      } catch (error: any) {
        showAlert(
          error.message || 'Error al cargar los platillos. Por favor, intenta de nuevo.',
          'error'
        );
      } finally {
        setLoading(false);
      }
    };

    if (user && vendedor) {
      cargarPlatillos();
    }
  }, [user, vendedor, showAlert]);

  useEffect(() => {
    if (editandoPlatillo) {
      reset({
        nombre: editandoPlatillo.nombre,
        descripcion: editandoPlatillo.descripcion,
        precio: editandoPlatillo.precio,
        ingredientes: editandoPlatillo.ingredientes.join(', '),
        disponible: editandoPlatillo.disponible,
      });
      setMostrarFormulario(true);
    }
  }, [editandoPlatillo, reset]);

  const onSubmit = async (data: PlatilloFormData) => {
    if (!user || !vendedor) return;

    try {
      const ingredientes = data.ingredientes
        ? data.ingredientes.split(',').map((i) => i.trim()).filter(Boolean)
        : [];

      if (editandoPlatillo) {
        await updatePlatillo(editandoPlatillo.id, {
          ...data,
          ingredientes,
          imagen: editandoPlatillo.imagen || '🍽️',
        });
        showAlert('Platillo actualizado exitosamente', 'success');
        
        // Recargar platillos
        const platillosData = await getPlatillosPorVendedor(vendedor.uid);
        setPlatillos(platillosData);
      } else {
        const nuevoId = await crearPlatillo({
          vendedorId: vendedor.uid,
          ...data,
          ingredientes,
          imagen: '🍽️',
        });
        showAlert('Platillo creado exitosamente', 'success');
        
        // Recargar platillos
        const platillosData = await getPlatillosPorVendedor(vendedor.uid);
        setPlatillos(platillosData);
      }
      reset();
      setMostrarFormulario(false);
      setEditandoPlatillo(null);
    } catch (error: any) {
      showAlert(
        error.message || 'Error al guardar el platillo. Por favor, intenta de nuevo.',
        'error'
      );
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este platillo?')) return;

    try {
      await eliminarPlatillo(id);
      setPlatillos((prev) => prev.filter((p) => p.id !== id));
      showAlert('Platillo eliminado exitosamente', 'success');
    } catch (error: any) {
      showAlert(
        error.message || 'Error al eliminar el platillo. Por favor, intenta de nuevo.',
        'error'
      );
    }
  };

  const toggleDisponibilidad = async (id: string, disponibleActual: boolean) => {
    try {
      await toggleDisponibilidadService(id, !disponibleActual);
      setPlatillos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, disponible: !p.disponible } : p))
      );
      showAlert('Disponibilidad actualizada', 'success');
    } catch (error: any) {
      showAlert(
        error.message || 'Error al actualizar disponibilidad. Por favor, intenta de nuevo.',
        'error'
      );
    }
  };

  if (authLoading || loading) {
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
            href="/vendedor/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Volver al Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🍽️ Gestionar Menús</h1>
              <p className="text-gray-600">Crea y edita tus platillos</p>
            </div>
            <button
              onClick={() => {
                setEditandoPlatillo(null);
                reset();
                setMostrarFormulario(!mostrarFormulario);
              }}
              className="btn-primary"
            >
              {mostrarFormulario ? 'Cancelar' : '+ Nuevo Platillo'}
            </button>
          </div>
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editandoPlatillo ? 'Editar Platillo' : 'Nuevo Platillo'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="form-label">
                    Nombre del Platillo *
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
                  <label htmlFor="precio" className="form-label">
                    Precio (€) *
                  </label>
                  <input
                    id="precio"
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-input ${errors.precio ? 'form-input-error' : ''}`}
                    {...register('precio', { valueAsNumber: true })}
                  />
                  {errors.precio && (
                    <p className="form-error">{errors.precio.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="descripcion" className="form-label">
                  Descripción *
                </label>
                <textarea
                  id="descripcion"
                  rows={3}
                  className={`form-input ${errors.descripcion ? 'form-input-error' : ''}`}
                  {...register('descripcion')}
                />
                {errors.descripcion && (
                  <p className="form-error">{errors.descripcion.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="ingredientes" className="form-label">
                  Ingredientes (separados por comas)
                </label>
                <input
                  id="ingredientes"
                  type="text"
                  className="form-input"
                  placeholder="Ej: Arroz, Mariscos, Verduras"
                  {...register('ingredientes')}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="disponible"
                  type="checkbox"
                  className="w-5 h-5 text-primary-600 rounded"
                  {...register('disponible')}
                />
                <label htmlFor="disponible" className="ml-2 text-gray-700">
                  Disponible para pedidos
                </label>
              </div>

              <button type="submit" className="btn-primary">
                {editandoPlatillo ? 'Actualizar Platillo' : 'Crear Platillo'}
              </button>
            </form>
          </div>
        )}

        {/* Lista de Platillos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platillos.map((platillo) => (
            <div
              key={platillo.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${
                platillo.disponible ? 'border-transparent' : 'border-gray-300 opacity-60'
              }`}
            >
              <div className="p-6">
                <div className="text-6xl text-center mb-4">{platillo.imagen}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{platillo.nombre}</h3>
                <p className="text-gray-600 text-sm mb-4">{platillo.descripcion}</p>

                {platillo.ingredientes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Ingredientes:</p>
                    <div className="flex flex-wrap gap-1">
                      {platillo.ingredientes.map((ing, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-bold text-primary-600">
                    €{platillo.precio.toFixed(2)}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      platillo.disponible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {platillo.disponible ? 'Disponible' : 'No Disponible'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditandoPlatillo(platillo)}
                    className="btn-outline flex-1 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleDisponibilidad(platillo.id, platillo.disponible)}
                    className={`btn-yellow flex-1 text-sm ${
                      !platillo.disponible ? 'bg-green-500 hover:bg-green-600' : ''
                    }`}
                  >
                    {platillo.disponible ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => handleEliminar(platillo.id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {platillos.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No tienes platillos aún</p>
            <p className="text-gray-500">¡Comienza agregando tu primer platillo!</p>
          </div>
        )}
      </div>
    </div>
  );
}

