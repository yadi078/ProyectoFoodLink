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
      pendiente: "bg-warning-100 text-warning-700 border-warning-300",
      en_camino: "bg-info-100 text-info-700 border-info-300",
      entregado: "bg-success-100 text-success-700 border-success-300",
      cancelado: "bg-error-100 text-error-700 border-error-300",
    };

    const textos = {
      pendiente: "PENDIENTE",
      en_camino: "EN CAMINO",
      entregado: "ENTREGADO",
      cancelado: "CANCELADO",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[estado]}`}
      >
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
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-soft">
            <div className="text-2xl font-bold text-primary-600">
              {pedidos.length}
            </div>
            <div className="text-sm text-gray-600">Total de pedidos</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-soft">
            <div className="text-2xl font-bold text-warning-600">
              {pedidos.filter((p) => p.estado === "pendiente").length}
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-soft">
            <div className="text-2xl font-bold text-info-600">
              {pedidos.filter((p) => p.estado === "en_camino").length}
            </div>
            <div className="text-sm text-gray-600">En camino</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-soft">
            <div className="text-2xl font-bold text-success-600">
              {pedidos.filter((p) => p.estado === "entregado").length}
            </div>
            <div className="text-sm text-gray-600">Entregados</div>
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
                className="bg-white rounded-xl shadow-soft border border-gray-200 hover:shadow-medium transition-shadow overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {getEstadoIcono(pedido.estado)}
                        </span>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            Pedido #{pedidos.length - index}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {pedido.vendedorNegocio || "Vendedor"}
                          </p>
                        </div>
                      </div>
                      {getEstadoBadge(pedido.estado)}
                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">Fecha:</span>{" "}
                          {new Date(pedido.createdAt).toLocaleString("es-MX", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p>
                          <span className="font-semibold">Entrega:</span> Puerta
                          principal de la UTNA
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {formatPrice(pedido.precioTotal)}
                      </p>
                    </div>
                  </div>

                  {/* Items del pedido - Vista compacta */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="font-semibold text-gray-800 mb-2 text-sm">
                      Productos ({pedido.items.length})
                    </p>
                    <div className="space-y-1">
                      {pedido.items.slice(0, 2).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm text-gray-700"
                        >
                          <span>
                            {item.cantidad}x {item.nombre}
                          </span>
                          <span className="font-medium">
                            {formatPrice(item.precioUnitario * item.cantidad)}
                          </span>
                        </div>
                      ))}
                      {pedido.items.length > 2 && (
                        <p className="text-xs text-gray-500 italic">
                          + {pedido.items.length - 2} producto(s) más
                        </p>
                      )}
                    </div>
                    {pedido.notas && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-700">
                          Notas:
                        </p>
                        <p className="text-sm text-gray-600">{pedido.notas}</p>
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setPedidoSeleccionado(pedido)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      Ver Detalles
                    </button>
                    {pedido.estado === "entregado" &&
                      !pedido.vendedorCalificado && (
                        <button
                          onClick={() => setPedidoParaCalificar(pedido)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <span>⭐</span>
                          <span>Calificar Servicio</span>
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
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(pedidoSeleccionado.precioTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
