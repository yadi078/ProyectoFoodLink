'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useAlert } from '@/components/context/AlertContext';

// Datos de ejemplo - En producción vendrán de Firestore
const pedidoEjemplo = {
  id: '1',
  platillo: {
    id: '1',
    nombre: 'Paella Valenciana',
    descripcion: 'Paella tradicional con mariscos y verduras',
    precio: 8.50,
    imagen: '🍲',
  },
  vendedor: {
    id: '1',
    nombre: 'Doña María',
    direccion: 'Calle Principal 123, Madrid',
  },
  cantidad: 1,
  metodoEntrega: 'recoleccion', // 'recoleccion' | 'domicilio'
  direccionEntrega: '',
  notas: '',
  estado: 'pendiente', // 'pendiente' | 'preparando' | 'listo' | 'entregado'
  total: 8.50,
};

export default function PedidoPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const { showAlert } = useAlert();

  const [metodoEntrega, setMetodoEntrega] = useState<'recoleccion' | 'domicilio'>(
    pedidoEjemplo.metodoEntrega
  );
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [notas, setNotas] = useState('');
  const [isProcesando, setIsProcesando] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const calcularTotal = () => {
    const subtotal = pedidoEjemplo.platillo.precio * cantidad;
    const costoEntrega = metodoEntrega === 'domicilio' ? 2.0 : 0;
    return subtotal + costoEntrega;
  };

  const handleConfirmarPedido = async () => {
    if (metodoEntrega === 'domicilio' && !direccionEntrega.trim()) {
      showAlert('Por favor, ingresa una dirección de entrega', 'warning');
      return;
    }

    setIsProcesando(true);
    try {
      // TODO: Crear pedido en Firestore
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showAlert('¡Pedido realizado exitosamente!', 'success');
      router.push(`/estudiante/pedido/${params.id}/confirmacion`);
    } catch (error) {
      showAlert('Error al realizar el pedido. Intenta de nuevo.', 'error');
    } finally {
      setIsProcesando(false);
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
        <Link
          href="/estudiante/menu"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          ← Volver al Catálogo
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">🛒 Realizar Pedido</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Información del Pedido */}
          <div className="md:col-span-2 space-y-6">
            {/* Detalle del Platillo */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detalle del Platillo</h2>
              <div className="flex gap-4">
                <div className="text-6xl">{pedidoEjemplo.platillo.imagen}</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {pedidoEjemplo.platillo.nombre}
                  </h3>
                  <p className="text-gray-600 mb-3">{pedidoEjemplo.platillo.descripcion}</p>
                  <p className="text-2xl font-bold text-primary-600">
                    €{pedidoEjemplo.platillo.precio.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Vendedor: {pedidoEjemplo.vendedor.nombre}
                  </p>
                </div>
              </div>
            </div>

            {/* Cantidad */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cantidad</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 transition-colors"
                  disabled={cantidad <= 1}
                >
                  -
                </button>
                <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                  {cantidad}
                </span>
                <button
                  onClick={() => setCantidad(cantidad + 1)}
                  className="w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Método de Entrega */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Método de Entrega</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="metodoEntrega"
                    value="recoleccion"
                    checked={metodoEntrega === 'recoleccion'}
                    onChange={(e) => setMetodoEntrega('recoleccion')}
                    className="mr-4 w-5 h-5 text-primary-600"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">📍 Recolección</p>
                        <p className="text-sm text-gray-600">
                          Recoge en: {pedidoEjemplo.vendedor.direccion}
                        </p>
                      </div>
                      <span className="text-green-600 font-bold">Gratis</span>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="metodoEntrega"
                    value="domicilio"
                    checked={metodoEntrega === 'domicilio'}
                    onChange={(e) => setMetodoEntrega('domicilio')}
                    className="mr-4 w-5 h-5 text-primary-600"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">🚚 Entrega a Domicilio</p>
                      <span className="text-primary-600 font-bold">+€2.00</span>
                    </div>
                    {metodoEntrega === 'domicilio' && (
                      <input
                        type="text"
                        placeholder="Ingresa tu dirección"
                        value={direccionEntrega}
                        onChange={(e) => setDireccionEntrega(e.target.value)}
                        className="form-input w-full text-sm"
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Notas Adicionales */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Notas Adicionales (Opcional)</h2>
              <textarea
                rows={4}
                placeholder="Ej: Sin cebolla, menos picante..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="form-input w-full"
              />
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen del Pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>
                    {pedidoEjemplo.platillo.nombre} x{cantidad}
                  </span>
                  <span className="font-semibold">
                    €{(pedidoEjemplo.platillo.precio * cantidad).toFixed(2)}
                  </span>
                </div>
                {metodoEntrega === 'domicilio' && (
                  <div className="flex justify-between text-gray-700">
                    <span>Costo de entrega</span>
                    <span className="font-semibold">€2.00</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      €{calcularTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmarPedido}
                disabled={isProcesando || (metodoEntrega === 'domicilio' && !direccionEntrega.trim())}
                className="btn-primary w-full"
              >
                {isProcesando ? 'Procesando...' : 'Confirmar Pedido'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Al confirmar, aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

