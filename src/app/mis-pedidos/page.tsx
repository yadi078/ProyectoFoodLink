"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/components/context/AlertContext";
import {
  getPedidosByEstudiante,
  getVendedorInfo,
} from "@/services/pedidos/estudiantePedidoService";
import type { Pedido } from "@/lib/firebase/types";
import { formatPrice } from "@/utils/formatters";
import Link from "next/link";
import CalificarVendedorModal from "@/components/calificaciones/CalificarVendedorModal";
import { crearCalificacionVendedor } from "@/services/calificaciones/calificacionVendedorService";

interface PedidoConVendedor extends Pedido {
  vendedorNombre?: string;
  vendedorNegocio?: string;
}

export default function MisPedidosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showAlert } = useAlert();
  const [pedidos, setPedidos] = useState<PedidoConVendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] =
    useState<PedidoConVendedor | null>(null);
  const [pedidoParaCalificar, setPedidoParaCalificar] =
    useState<PedidoConVendedor | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      showAlert("Debes iniciar sesión para ver tus pedidos", "info");
      router.push("/vendedor/login");
    }
  }, [user, authLoading, router, showAlert]);

  useEffect(() => {
    if (user) {
      loadPedidos();
    }
  }, [user]);

  const loadPedidos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getPedidosByEstudiante(user.uid);

      // Obtener información de los vendedores
      const pedidosConVendedor = await Promise.all(
        data.map(async (pedido) => {
          const vendedorInfo = await getVendedorInfo(pedido.vendedorId);
          return {
            ...pedido,
            vendedorNombre: vendedorInfo.nombre,
            vendedorNegocio: vendedorInfo.nombreNegocio,
          };
        })
      );

      setPedidos(pedidosConVendedor);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      showAlert("Error al cargar tus pedidos", "error");
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: Pedido["estado"]) => {
    const badges = {
      pendiente: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300 shadow-sm",
      en_camino: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300 shadow-sm",
      entregado: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300 shadow-sm",
      cancelado: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 shadow-sm",
    };

    const iconos = {
      pendiente: "⏳",
      en_camino: "🚶",
      entregado: "✅",
      cancelado: "❌",
    };

    const textos = {
      pendiente: "PENDIENTE",
      en_camino: "EN CAMINO",
      entregado: "ENTREGADO",
      cancelado: "CANCELADO",
    };

    return (
      <span
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border-2 ${badges[estado]}`}
      >
        <span className="text-sm">{iconos[estado]}</span>
        {textos[estado]}
      </span>
    );
  };

  const getEstadoIcono = (estado: Pedido["estado"]) => {
    const iconos = {
      pendiente: "⏳",
      en_camino: "🚶",
      entregado: "✅",
      cancelado: "❌",
    };
    return iconos[estado];
  };

  const handleCalificarVendedor = async (
    calificacion: number,
    comentario?: string
  ) => {
    if (!user || !pedidoParaCalificar) return;

    try {
      const estudianteNombre =
        user.displayName || user.email?.split("@")[0] || "Usuario";

      await crearCalificacionVendedor({
        vendedorId: pedidoParaCalificar.vendedorId,
        estudianteId: user.uid,
        pedidoId: pedidoParaCalificar.id,
        calificacion,
        comentario,
        estudianteNombre,
      });

      showAlert("¡Gracias por tu calificación!", "success");
      setPedidoParaCalificar(null);
      // Recargar pedidos
      loadPedidos();
    } catch (error: any) {
      console.error("Error al calificar:", error);
      showAlert(error.message || "Error al enviar la calificación", "error");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 font-display">
                  Mis Pedidos
                </h1>
                <p className="text-sm text-gray-600">
                  Revisa el estado de tus pedidos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Estadísticas rápidas mejoradas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-black text-white">
                {pedidos.length}
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="text-xs font-semibold text-white/90 uppercase tracking-wide">Total</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-black text-white">
                {pedidos.filter((p) => p.estado === "pendiente").length}
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            <div className="text-xs font-semibold text-white/90 uppercase tracking-wide">Pendientes</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-black text-white">
                {pedidos.filter((p) => p.estado === "en_camino").length}
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚶</span>
              </div>
            </div>
            <div className="text-xs font-semibold text-white/90 uppercase tracking-wide">En Camino</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-black text-white">
                {pedidos.filter((p) => p.estado === "entregado").length}
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <div className="text-xs font-semibold text-white/90 uppercase tracking-wide">Entregados</div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        {pedidos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-soft p-12 text-center border border-gray-200">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-600 text-lg font-medium mb-2">
              Aún no tienes pedidos
            </p>
            <p className="text-gray-500 mb-4">
              Explora el menú y haz tu primer pedido
            </p>
            <Link
              href="/menu"
              className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              Ver Menú
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido, index) => (
              <div
                key={pedido.id}
                className="bg-white rounded-2xl shadow-soft border border-gray-200 hover:shadow-large transition-all duration-300 overflow-hidden relative group"
              >
                {/* Botón de Chat flotante en la esquina - NARANJA */}
                <Link
                  href={`/mensajes?vendedorId=${pedido.vendedorId}`}
                  className="absolute top-4 right-4 z-10 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl group-hover:ring-4 ring-orange-200"
                  aria-label="Chat con vendedor"
                  title="Contactar al vendedor"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </Link>
                
                <div className="p-5 sm:p-7">
                  {/* Header con icono y info principal */}
                  <div className="flex items-start justify-between mb-5 pr-12">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                          <span className="text-3xl">
                            {getEstadoIcono(pedido.estado)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            Pedido #{pedidos.length - index}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">
                            {pedido.vendedorNegocio || "Vendedor"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Badge de estado mejorado */}
                      <div className="mb-3">
                        {getEstadoBadge(pedido.estado)}
                      </div>
                      
                      {/* Info del pedido con iconos */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {new Date(pedido.createdAt).toLocaleString("es-MX", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Puerta principal UTNA</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Total mejorado */}
                    <div className="text-center bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-3 min-w-[100px]">
                      <p className="text-xs text-gray-600 mb-1 font-medium">Total</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {formatPrice(pedido.precioTotal)}
                      </p>
                    </div>
                  </div>

                  {/* Items del pedido - Vista compacta mejorada */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="font-bold text-gray-800 text-sm">
                        Productos ({pedido.items.length})
                      </p>
                    </div>
                    <div className="space-y-2">
                      {pedido.items.slice(0, 2).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm bg-white rounded-lg p-2"
                        >
                          <span className="text-gray-700 font-medium">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold mr-2">
                              {item.cantidad}
                            </span>
                            {item.nombre}
                          </span>
                          <span className="font-bold text-primary-600">
                            {formatPrice(item.precioUnitario * item.cantidad)}
                          </span>
                        </div>
                      ))}
                      {pedido.items.length > 2 && (
                        <p className="text-xs text-gray-500 italic text-center py-1">
                          + {pedido.items.length - 2} producto(s) más
                        </p>
                      )}
                    </div>
                    {pedido.notas && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          Notas:
                        </p>
                        <p className="text-sm text-gray-600 bg-white rounded p-2">{pedido.notas}</p>
                      </div>
                    )}
                  </div>

                  {/* Botones de acción mejorados */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setPedidoSeleccionado(pedido)}
                      className="flex-1 px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver Detalles
                    </button>
                    {pedido.estado === "entregado" &&
                      !pedido.vendedorCalificado && (
                        <button
                          onClick={() => setPedidoParaCalificar(pedido)}
                          className="flex-1 px-5 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                        >
                          <span className="text-lg">⭐</span>
                          <span>Calificar</span>
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Calificación */}
      {pedidoParaCalificar && (
        <CalificarVendedorModal
          isOpen={true}
          onClose={() => setPedidoParaCalificar(null)}
          onSubmit={handleCalificarVendedor}
          vendedorNombre={pedidoParaCalificar.vendedorNombre || "Vendedor"}
          pedidoId={pedidoParaCalificar.id}
        />
      )}

      {/* Modal de Detalles */}
      {pedidoSeleccionado && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[10000]"
            onClick={() => setPedidoSeleccionado(null)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-white rounded-2xl shadow-2xl z-[10001] max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Detalles del Pedido</h2>
                <button
                  onClick={() => setPedidoSeleccionado(null)}
                  className="text-white/90 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Estado</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {getEstadoBadge(pedidoSeleccionado.estado)}
                  <p className="text-sm text-gray-600 mt-2">
                    {pedidoSeleccionado.estado === "pendiente" &&
                      "Tu pedido está siendo preparado"}
                    {pedidoSeleccionado.estado === "en_camino" &&
                      "Tu pedido está listo. Ve a la puerta principal de la UTNA"}
                    {pedidoSeleccionado.estado === "entregado" &&
                      "Tu pedido fue entregado"}
                    {pedidoSeleccionado.estado === "cancelado" &&
                      "Este pedido fue cancelado"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Vendedor</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Negocio:</span>{" "}
                    {pedidoSeleccionado.vendedorNegocio}
                  </p>
                  <p>
                    <span className="font-semibold">Vendedor:</span>{" "}
                    {pedidoSeleccionado.vendedorNombre}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Productos</h3>
                <div className="space-y-2">
                  {pedidoSeleccionado.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.nombre}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.precioUnitario)} c/u
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          x{item.cantidad}
                        </p>
                        <p className="text-sm text-primary-600 font-semibold">
                          {formatPrice(item.precioUnitario * item.cantidad)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {pedidoSeleccionado.notas && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Notas</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      {pedidoSeleccionado.notas}
                    </p>
                  </div>
                </div>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-800">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(pedidoSeleccionado.precioTotal)}
                  </span>
                </div>

                
                {/* Botón de Chat con el Vendedor - NARANJA */}
                <Link
                  href={`/mensajes?vendedorId=${pedidoSeleccionado.vendedorId}`}
                  className="w-full px-5 py-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                  onClick={() => setPedidoSeleccionado(null)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-lg">Contactar al Vendedor</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
