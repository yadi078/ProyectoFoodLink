"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import VendedorLayout from "@/components/vendedor/VendedorLayout";
import {
  getPedidosByVendedor,
  updateEstadoPedido,
  getEstudianteInfo,
} from "@/services/pedidos/vendedorPedidoService";
import type { Pedido } from "@/lib/firebase/types";
import { formatPrice } from "@/utils/formatters";
import { useAlert } from "@/components/context/AlertContext";

interface PedidoConCliente extends Pedido {
  clienteNombre?: string;
  clienteTelefono?: string;
}

type FiltroEstado = "todos" | Pedido["estado"];

export default function OrdenesPage() {
  const router = useRouter();
  const { user, vendedor, loading: authLoading } = useAuth();
  const { showAlert } = useAlert();
  const [pedidos, setPedidos] = useState<PedidoConCliente[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<PedidoConCliente[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<FiltroEstado>("todos");
  const [pedidoSeleccionado, setPedidoSeleccionado] =
    useState<PedidoConCliente | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/vendedor/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (vendedor) {
      loadPedidos();
    }
  }, [vendedor]);

  useEffect(() => {
    applyFilter();
  }, [pedidos, filtro]);

  const loadPedidos = async () => {
    if (!vendedor) return;

    try {
      setLoading(true);
      const data = await getPedidosByVendedor(vendedor.uid);

      // Obtener información de los clientes
      const pedidosConCliente = await Promise.all(
        data.map(async (pedido) => {
          const clienteInfo = await getEstudianteInfo(pedido.estudianteId);
          return {
            ...pedido,
            clienteNombre: clienteInfo.nombre,
            clienteTelefono: clienteInfo.telefono,
          };
        })
      );

      setPedidos(pedidosConCliente);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      showAlert("Error al cargar los pedidos", "error");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filtro === "todos") {
      setFilteredPedidos(pedidos);
    } else {
      setFilteredPedidos(pedidos.filter((p) => p.estado === filtro));
    }
  };

  const handleCambiarEstado = async (
    pedidoId: string,
    nuevoEstado: Pedido["estado"]
  ) => {
    try {
      await updateEstadoPedido(pedidoId, nuevoEstado);
      showAlert("Estado actualizado correctamente", "success");
      await loadPedidos();
      setPedidoSeleccionado(null);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      showAlert("Error al actualizar el estado", "error");
    }
  };

  const getEstadoBadge = (estado: Pedido["estado"]) => {
    const badges = {
      pendiente: "bg-[#FFF9E6] text-[#7A6A00] border-[#FFE699]",
      en_camino: "bg-[#E6F4FF] text-[#0056B3] border-[#B3D9FF]",
      entregado: "bg-success-100 text-success-700 border-success-300",
      cancelado: "bg-error-100 text-error-700 border-error-300",
    };

    const textos = {
      pendiente: "PENDIENTE",
      en_camino: "EN PREPARACIÓN",
      entregado: "ENTREGADO",
      cancelado: "CANCELADO",
    };

    return (
      <span
        className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase border ${badges[estado]}`}
      >
        {textos[estado]}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1EC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#719A0A] mx-auto"></div>
          <p className="mt-4 text-[#2E2E2E]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || !vendedor) {
    return null;
  }

  return (
    <VendedorLayout
      title="Gestión de Órdenes"
      subtitle="Administra los pedidos de tus clientes"
    >
      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-soft p-4 sm:p-6 border border-gray-200 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="font-semibold text-gray-800 text-sm sm:text-base">
              Gestión de Órdenes
            </span>
          </div>
          <div className="flex-1"></div>
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as FiltroEstado)}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            <option value="todos">Todas las órdenes</option>
            <option value="pendiente">Preparando</option>
            <option value="en_camino">Listas para entregar</option>
            <option value="entregado">Entregadas</option>
            <option value="cancelado">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Lista de Órdenes */}
      {filteredPedidos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-soft p-8 sm:p-12 text-center border border-gray-200">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4"
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
          <p className="text-gray-600 text-base sm:text-lg font-medium">
            {pedidos.length === 0
              ? "No tienes órdenes aún"
              : "No hay órdenes con este filtro"}
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredPedidos.map((pedido, index) => (
            <div
              key={pedido.id}
              className="bg-white rounded-xl shadow-soft border border-gray-200 hover:shadow-medium transition-shadow overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex-1 w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-bold text-gray-800">
                        Orden #{filteredPedidos.length - index}
                      </h3>
                      {getEstadoBadge(pedido.estado)}
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <p className="text-gray-700">
                        <span className="font-semibold">Cliente:</span>{" "}
                        {pedido.clienteNombre || "Usuario"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Teléfono:</span>{" "}
                        {pedido.clienteTelefono || "No disponible"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Entrega:</span> Puerta
                        principal de la UTNA
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Fecha:</span>{" "}
                        {new Date(pedido.createdAt).toLocaleString("es-MX", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false, // Formato 24 horas
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      Total
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-primary-600">
                      {formatPrice(pedido.precioTotal)}
                    </p>
                  </div>
                </div>

                {/* Items del pedido */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <p className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                    Productos:
                  </p>
                  <div className="space-y-1">
                    {pedido.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-xs sm:text-sm text-gray-700"
                      >
                        <span>
                          {item.cantidad}x {item.nombre}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.precioUnitario * item.cantidad)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {pedido.notas && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-700">
                        Notas:
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {pedido.notas}
                      </p>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {pedido.estado === "pendiente" && (
                    <>
                      <button
                        onClick={() =>
                          handleCambiarEstado(pedido.id, "en_camino")
                        }
                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Marcar Listo
                      </button>
                      <button
                        onClick={() =>
                          handleCambiarEstado(pedido.id, "cancelado")
                        }
                        className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-error-500 hover:bg-error-600 text-white font-semibold rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  {pedido.estado === "en_camino" && (
                    <button
                      onClick={() =>
                        handleCambiarEstado(pedido.id, "entregado")
                      }
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-success-500 hover:bg-success-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Entregar
                    </button>
                  )}
                  {pedido.estado === "entregado" && (
                    <div className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-100 text-gray-700 font-semibold rounded-lg flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-success-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-success-700 font-bold">
                        Entregado
                      </span>
                    </div>
                  )}
                  {pedido.estado !== "entregado" && (
                    <button
                      onClick={() => setPedidoSeleccionado(pedido)}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-info-500 hover:bg-info-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Detalles
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalles */}
      {pedidoSeleccionado && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[10000]"
            onClick={() => setPedidoSeleccionado(null)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:w-[90vw] max-w-lg bg-white rounded-2xl shadow-2xl z-[10001] max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 sm:p-4 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold">
                  Detalles del Pedido
                </h2>
                <button
                  onClick={() => setPedidoSeleccionado(null)}
                  className="text-white/90 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 flex-shrink-0"
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
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                  Información del Cliente
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 text-xs sm:text-sm">
                  <p>
                    <span className="font-semibold">Nombre:</span>{" "}
                    {pedidoSeleccionado.clienteNombre}
                  </p>
                  <p>
                    <span className="font-semibold">Teléfono:</span>{" "}
                    {pedidoSeleccionado.clienteTelefono}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                  Productos
                </h3>
                <div className="space-y-2">
                  {pedidoSeleccionado.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-gray-50 rounded-lg p-2.5 sm:p-3 gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">
                          {item.nombre}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {formatPrice(item.precioUnitario)} c/u
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                          x{item.cantidad}
                        </p>
                        <p className="text-xs sm:text-sm text-primary-600 font-semibold">
                          {formatPrice(item.precioUnitario * item.cantidad)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-3 sm:pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-semibold text-gray-800">
                    Total:
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-primary-600">
                    {formatPrice(pedidoSeleccionado.precioTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </VendedorLayout>
  );
}
