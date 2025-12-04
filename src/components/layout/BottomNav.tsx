/**
 * BottomNav Component - Navegación inferior estilo Shein
 * Nav fijo en la parte inferior con iconos
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/context/CartContext";
import { useState, useEffect } from "react";
import { getPedidosByEstudiante } from "@/services/pedidos/estudiantePedidoService";
import { useMensajesNoLeidos } from "@/hooks/useMensajesNoLeidos";

export default function BottomNav() {
  const pathname = usePathname();
  const { user, vendedor } = useAuth();
  const { getTotalItems, toggleCart, isHydrated } = useCart();
  const [mounted, setMounted] = useState(false);
  const [pedidosActivos, setPedidosActivos] = useState(0);

  const isVendedor = vendedor !== null;
  const totalItems = mounted && isHydrated ? getTotalItems() : 0;
  const { totalNoLeidos: mensajesNoLeidos } = useMensajesNoLeidos(
    user?.uid,
    "estudiante"
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Obtener conteo de pedidos activos (pendientes + en_camino)
  useEffect(() => {
    if (user && !isVendedor) {
      const loadPedidosActivos = async () => {
        try {
          const pedidos = await getPedidosByEstudiante(user.uid);
          const activos = pedidos.filter(
            (p) => p.estado === "pendiente" || p.estado === "en_camino"
          ).length;
          setPedidosActivos(activos);
        } catch (error) {
          console.error("Error cargando pedidos activos:", error);
        }
      };
      loadPedidosActivos();

      // Actualizar cada 30 segundos
      const interval = setInterval(loadPedidosActivos, 30000);
      return () => clearInterval(interval);
    }
  }, [user, isVendedor]);

  const isActive = (path: string) => pathname === path;

  // No mostrar nav inferior en rutas de vendedor
  if (pathname?.startsWith("/vendedor")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-[999]">
      <div className="max-w-[600px] mx-auto px-4 py-3">
        <div className="flex justify-around items-center">
          {/* Inicio */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
              isActive("/")
                ? "text-primary-500"
                : "text-gray-600 hover:text-primary-500"
            }`}
            aria-label="Inicio"
          >
            <svg
              className="w-7 h-7"
              fill={isActive("/") ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>

          {/* Menú / Productos */}
          <Link
            href="/menu"
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
              isActive("/menu")
                ? "text-primary-500"
                : "text-gray-600 hover:text-primary-500"
            }`}
            aria-label="Menú"
          >
            {/* Icono de cubiertos (tenedor y cuchillo) */}
            <svg
              className="w-7 h-7"
              fill={isActive("/menu") ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              {/* Tenedor (izquierda) */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 2v6.5M8 8.5V22M6 2v6.5M10 2v6.5"
              />
              {/* Cuchillo (derecha) */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 2v20M16 8c1.5 0 2.5-1 2.5-2.5S17.5 3 16 3"
              />
            </svg>
          </Link>

          {/* Mis Pedidos */}
          {user && !isVendedor && (
            <Link
              href="/mis-pedidos"
              className={`relative flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                isActive("/mis-pedidos")
                  ? "text-primary-500"
                  : "text-gray-600 hover:text-primary-500"
              }`}
              aria-label="Mis Pedidos"
            >
              <svg
                className="w-7 h-7"
                fill={isActive("/mis-pedidos") ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              {pedidosActivos > 0 && (
                <span className="absolute top-0 right-0 bg-warning-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {pedidosActivos > 9 ? "9+" : pedidosActivos}
                </span>
              )}
            </Link>
          )}

          {/* Mensajes */}
          {user && !isVendedor && (
            <Link
              href="/mensajes"
              className={`relative flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                isActive("/mensajes")
                  ? "text-primary-500"
                  : "text-gray-600 hover:text-primary-500"
              }`}
              aria-label="Mensajes"
            >
              <svg
                className="w-7 h-7"
                fill={isActive("/mensajes") ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {mensajesNoLeidos > 0 && (
                <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {mensajesNoLeidos > 9 ? "9+" : mensajesNoLeidos}
                </span>
              )}
            </Link>
          )}

          {/* Carrito */}
          {(!user || !isVendedor) && (
            <button
              onClick={toggleCart}
              className="relative flex flex-col items-center justify-center p-3 rounded-lg text-gray-600 hover:text-primary-500 transition-all duration-200"
              aria-label="Carrito"
            >
              <svg
                className="w-7 h-7"
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
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          )}

          {/* Perfil / Usuario */}
          <Link
            href={
              user
                ? isVendedor
                  ? "/vendedor/dashboard"
                  : "/configuracion"
                : "/vendedor/login"
            }
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
              isActive("/configuracion") || isActive("/vendedor/dashboard")
                ? "text-primary-500"
                : "text-gray-600 hover:text-primary-500"
            }`}
            aria-label="Perfil"
          >
            <svg
              className="w-7 h-7"
              fill={
                isActive("/configuracion") || isActive("/vendedor/dashboard")
                  ? "currentColor"
                  : "none"
              }
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
