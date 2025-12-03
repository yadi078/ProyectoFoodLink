"use client";

import { useEffect, useState } from "react";
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

export default function DashboardNuevoPage() {
  const router = useRouter();
  const { user, vendedor, loading: authLoading } = useAuth();
  const [estadisticas, setEstadisticas] = useState<EstadisticasVendedor | null>(
    null
  );
  const [pedidosRecientes, setPedidosRecientes] = useState<
    PedidoConCliente[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/vendedor/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (vendedor) {
      loadData();
    }
  }, [vendedor]);

  const loadData = async () => {
    if (!vendedor) return;

    try {
      setLoading(true);
      
      // Cargar estadísticas
      const stats = await getEstadisticasVendedor(vendedor.uid);
      setEstadisticas(stats);

      // Cargar últimos 3 pedidos
      const pedidos = await getPedidosByVendedor(vendedor.uid);
      const ultimosTres = pedidos.slice(0, 3);

      // Obtener información de los clientes
      const pedidosConCliente = await Promise.all(
        ultimosTres.map(async (pedido) => {
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
  };

  const getEstadoBadge = (estado: Pedido["estado"]) => {
    const badges = {
      pendiente: "bg-warning-100 text-warning-700 border-warning-300",
      confirmado: "bg-info-100 text-info-700 border-info-300",
      en_preparacion: "bg-info-100 text-info-700 border-info-300",
      listo: "bg-success-100 text-success-700 border-success-300",
      entregado: "bg-gray-100 text-gray-700 border-gray-300",
      cancelado: "bg-error-100 text-error-700 border-error-300",
    };

    const textos = {
      pendiente: "PENDIENTE",
      confirmado: "CONFIRMADO",
      en_preparacion: "EN PREPARACIÓN",
      listo: "LISTO",
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

  if (!user || !vendedor) {
    return null;
  }

  return (
    <VendedorLayout title="Dashboard" subtitle="Resumen de tu negocio">
      {/* Estadísticas - Grid 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Órdenes Hoy */}
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-200 hover:shadow-medium transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-600"
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
            <div>
              <p className="text-sm text-gray-600 font-medium">Órdenes Hoy</p>
              <p className="text-3xl font-bold text-gray-800">
                {estadisticas?.pedidosHoy || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Órdenes del día</p>
            </div>
          </div>
        </div>

        {/* Ingresos Hoy */}
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-200 hover:shadow-medium transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-success-600"
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
            <div>
              <p className="text-sm text-gray-600 font-medium">Ingresos Hoy</p>
              <p className="text-3xl font-bold text-gray-800">
                {formatPrice(estadisticas?.ingresosHoy || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ventas del día</p>
            </div>
          </div>
        </div>

        {/* Pendientes */}
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-200 hover:shadow-medium transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-warning-600"
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
            <div>
              <p className="text-sm text-gray-600 font-medium">Pendientes</p>
              <p className="text-3xl font-bold text-gray-800">
                {estadisticas?.pedidosPendientes || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Órdenes pendientes</p>
            </div>
          </div>
        </div>

        {/* Total Órdenes */}
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-200 hover:shadow-medium transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-secondary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Total Órdenes
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {estadisticas?.totalPedidos || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Históricas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          href="/vendedor/ordenes"
          className="bg-white rounded-xl shadow-soft p-6 border border-gray-200 hover:shadow-medium hover:border-primary-500 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
              <svg
                className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors"
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
            <span className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
              Gestionar Órdenes
            </span>
          </div>
        </Link>

        <Link
          href="/vendedor/menu"
          className="bg-white rounded-xl shadow-soft p-6 border border-gray-200 hover:shadow-medium hover:border-secondary-500 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center group-hover:bg-secondary-500 transition-colors">
              <svg
                className="w-5 h-5 text-secondary-600 group-hover:text-white transition-colors"
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
            <span className="font-semibold text-gray-800 group-hover:text-secondary-600 transition-colors">
              Gestionar Menú
            </span>
          </div>
        </Link>
      </div>

      {/* Órdenes Recientes */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 font-display">
              Órdenes Recientes
            </h2>
            <Link
              href="/vendedor/ordenes"
              className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
            >
              Ver todas →
            </Link>
          </div>
        </div>
        <div className="p-6">
          {pedidosRecientes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay órdenes recientes
            </p>
          ) : (
            <div className="space-y-4">
              {pedidosRecientes.map((pedido, index) => (
                <div
                  key={pedido.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-soft transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Orden #{pedidosRecientes.length - index}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {pedido.clienteNombre || "Cliente"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {pedido.clienteTelefono || "Sin teléfono"}
                      </p>
                    </div>
                    {getEstadoBadge(pedido.estado)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {new Date(pedido.createdAt).toLocaleString("es-MX", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="font-bold text-primary-600">
                      {formatPrice(pedido.precioTotal)}
                    </span>
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

