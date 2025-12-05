"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import VendedorLayout from "@/components/vendedor/VendedorLayout";
import {
  getEstadisticasVendedor,
  getPedidosByVendedor,
  getEstudianteInfo,
  type EstadisticasVendedor,
} from "@/services/pedidos/vendedorPedidoService";
import type { Pedido } from "@/lib/firebase/types";
import { formatPrice } from "@/utils/formatters";

interface PedidoConCliente extends Pedido {
  clienteNombre?: string;
  clienteTelefono?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, vendedor, loading: authLoading } = useAuth();
  const [estadisticas, setEstadisticas] = useState<EstadisticasVendedor | null>(
    null
  );
  const [pedidosRecientes, setPedidosRecientes] = useState<PedidoConCliente[]>(
    []
  );
  const [pedidosCompletadosHoy, setPedidosCompletadosHoy] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/vendedor/login");
    }
  }, [user, authLoading, router]);

  const loadData = useCallback(async () => {
    if (!vendedor) return;

    try {
      setLoading(true);

      // Cargar estadísticas
      const stats = await getEstadisticasVendedor(vendedor.uid);
      setEstadisticas(stats);

      // Cargar todos los pedidos para calcular completados del día
      const pedidos = await getPedidosByVendedor(vendedor.uid);

      // Calcular pedidos completados del día
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const pedidosCompletadosDelDia = pedidos.filter((p) => {
        const fechaPedido = new Date(p.createdAt);
        fechaPedido.setHours(0, 0, 0, 0);
        return (
          fechaPedido.getTime() === hoy.getTime() && p.estado === "entregado"
        );
      }).length;
      setPedidosCompletadosHoy(pedidosCompletadosDelDia);

      // Cargar últimos 5 pedidos
      const ultimosCinco = pedidos.slice(0, 5);

      // Obtener información de los clientes
      const pedidosConCliente = await Promise.all(
        ultimosCinco.map(async (pedido) => {
          const clienteInfo = await getEstudianteInfo(pedido.estudianteId);
          return {
            ...pedido,
            clienteNombre: clienteInfo.nombre,
            clienteTelefono: clienteInfo.telefono,
          };
        })
      );

      setPedidosRecientes(pedidosConCliente);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  }, [vendedor]);

  useEffect(() => {
    if (vendedor) {
      loadData();
    }
  }, [vendedor, loadData]);

  const getEstadoBadge = (estado: Pedido["estado"]) => {
    const badges: Record<Pedido["estado"], string> = {
      pendiente: "bg-[#FFF9E6] text-[#7A6A00] border border-[#FFE699]",
      en_camino: "bg-[#E6F4FF] text-[#0056B3] border border-[#B3D9FF]",
      entregado: "bg-success-100 text-success-700 border border-success-300",
      cancelado: "bg-error-100 text-error-700 border border-error-300",
    };

    const textos: Record<Pedido["estado"], string> = {
      pendiente: "PENDIENTE",
      en_camino: "EN PREPARACIÓN",
      entregado: "ENTREGADO",
      cancelado: "CANCELADO",
    };

    return (
      <span
        className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase ${badges[estado]}`}
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
    <VendedorLayout title="Dashboard" subtitle="">
      {/* Estadísticas - Grid 2x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Pedidos del día */}
        <div className="bg-white rounded-xl shadow-soft p-5 lg:p-6 border border-gray-200 hover:shadow-medium transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-[#FFA552]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 lg:w-7 lg:h-7 text-[#FFA552]"
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
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#2E2E2E] font-semibold mb-1">
                Pedidos del día
              </p>
              <p className="text-3xl lg:text-4xl font-bold text-[#2E2E2E]">
                {estadisticas?.pedidosHoy || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Pedidos del día</p>
            </div>
          </div>
        </div>

        {/* Ingresos del día */}
        <div className="bg-white rounded-xl shadow-soft p-5 lg:p-6 border border-gray-200 hover:shadow-medium transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 lg:w-7 lg:h-7 text-success-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#2E2E2E] font-semibold mb-1">
                Ingresos del día
              </p>
              <p className="text-3xl lg:text-4xl font-bold text-[#2E2E2E]">
                {formatPrice(estadisticas?.ingresosHoy || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ingresos del día</p>
            </div>
          </div>
        </div>

        {/* Pedidos Completados */}
        <div className="bg-white rounded-xl shadow-soft p-5 lg:p-6 border border-gray-200 hover:shadow-medium transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 lg:w-7 lg:h-7 text-success-600"
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
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#2E2E2E] font-semibold mb-1">
                Pedidos Completados
              </p>
              <p className="text-3xl lg:text-4xl font-bold text-[#2E2E2E]">
                {pedidosCompletadosHoy}
              </p>
              <p className="text-xs text-gray-500 mt-1">Pedidos entregados</p>
            </div>
          </div>
        </div>

        {/* Pendientes */}
        <div className="bg-white rounded-xl shadow-soft p-5 lg:p-6 border border-gray-200 hover:shadow-medium transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-error-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 lg:w-7 lg:h-7 text-error-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#2E2E2E] font-semibold mb-1">
                Pendientes
              </p>
              <p className="text-3xl lg:text-4xl font-bold text-[#2E2E2E]">
                {estadisticas?.pedidosPendientes || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Órdenes pendientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Gestión */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-6 lg:mb-8">
        <Link
          href="/vendedor/ordenes"
          className="bg-white rounded-xl shadow-soft p-4 lg:p-5 border-2 border-gray-200 hover:border-[#FFA552] hover:shadow-medium transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFA552]/10 rounded-lg flex items-center justify-center group-hover:bg-[#FFA552] transition-colors flex-shrink-0">
              <svg
                className="w-5 h-5 text-[#FFA552] group-hover:text-white transition-colors"
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
            </div>
            <span className="font-bold text-[#2E2E2E] text-sm lg:text-base group-hover:text-[#FFA552] transition-colors">
              Gestionar Órdenes
            </span>
          </div>
        </Link>

        <Link
          href="/vendedor/menu"
          className="bg-white rounded-xl shadow-soft p-4 lg:p-5 border-2 border-gray-200 hover:border-[#FFA552] hover:shadow-medium transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFA552]/10 rounded-lg flex items-center justify-center group-hover:bg-[#FFA552] transition-colors flex-shrink-0">
              <svg
                className="w-5 h-5 text-[#FFA552] group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span className="font-bold text-[#2E2E2E] text-sm lg:text-base group-hover:text-[#FFA552] transition-colors">
              Gestionar Menú
            </span>
          </div>
        </Link>
      </div>

      {/* Órdenes Recientes */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-200">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-[#FFA552] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-base lg:text-lg font-bold text-[#2E2E2E] font-display">
            Órdenes Recientes
          </h2>
        </div>
        <div className="p-4 lg:p-6">
          {pedidosRecientes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay órdenes recientes
            </p>
          ) : (
            <div className="space-y-3 lg:space-y-4">
              {pedidosRecientes.map((pedido, index) => (
                <div
                  key={pedido.id}
                  className="border-2 border-gray-200 rounded-lg p-3 lg:p-4 hover:shadow-soft hover:border-[#FFA552]/30 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#FFA552] text-sm lg:text-base mb-1">
                        Orden #{pedidosRecientes.length - index}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600 mb-0.5">
                        {pedido.clienteNombre || "Cliente"}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <svg
                          className="w-3.5 h-3.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{pedido.clienteTelefono || "Sin teléfono"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg
                          className="w-3.5 h-3.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {new Date(pedido.createdAt).toLocaleString("es-MX", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2 lg:gap-1.5">
                      {getEstadoBadge(pedido.estado)}
                      <p className="text-xl lg:text-2xl font-bold text-[#2E2E2E] whitespace-nowrap">
                        Total: {formatPrice(pedido.precioTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </VendedorLayout>
  );
}
