/**
 * Header Component - Navegación principal
 * Header responsivo estilo plantilla: transparente en hero, sticky con fondo blanco
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/context/CartContext";
import { logoutVendedor } from "@/services/auth/authService";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, vendedor, loading } = useAuth();
  const { getTotalItems, toggleCart, clearCart, isHydrated } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isVendedor = vendedor !== null;
  // Solo mostrar el contador después de la hidratación para evitar problemas SSR
  const totalItems = mounted && isHydrated ? getTotalItems() : 0;

  // Marcar como montado en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logoutVendedor();
    clearCart();
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;
  const isHomePage = pathname === "/";

  // Siempre mostrar el header con fondo sólido
  useEffect(() => {
    setIsScrolled(true);
  }, []);

  // El header siempre tiene fondo sólido
  const shouldBeTransparent = false;

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[999] py-2 sm:py-2.5 md:py-3 transition-all duration-300 bg-[#faf8f5] shadow-soft backdrop-blur-sm">
      <nav className="max-w-[1366px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center h-11 sm:h-12 md:h-14 lg:h-auto">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105 duration-200"
          >
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[45px] font-bold font-display leading-none">
              <span className="text-primary-500">Food</span>
              <span className="text-secondary-500">Link</span>
            </span>
          </Link>

          {/* Botón mobile menu */}
          <button
            className="lg:hidden focus:outline-none transition-colors text-[#666666] hover:text-[#FFA552]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link
              href="/"
              className={`px-3 py-2 font-display text-sm font-medium transition-all duration-200 rounded-lg ${
                isActive("/")
                  ? "text-primary-500 bg-primary-50"
                  : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/menu"
              className={`px-3 py-2 font-display text-sm font-medium transition-all duration-200 rounded-lg ${
                isActive("/menu")
                  ? "text-primary-500 bg-primary-50"
                  : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
              }`}
            >
              Menú
            </Link>
            <Link
              href="/sobre-nosotros"
              className={`px-3 py-2 font-display text-sm font-medium transition-all duration-200 rounded-lg ${
                isActive("/sobre-nosotros")
                  ? "text-primary-500 bg-primary-50"
                  : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
              }`}
            >
              Nosotros
            </Link>
            <Link
              href="/contacto"
              className={`px-3 py-2 font-display text-sm font-medium transition-all duration-200 rounded-lg ${
                isActive("/contacto")
                  ? "text-primary-500 bg-primary-50"
                  : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
              }`}
            >
              Contacto
            </Link>
            {!loading && !user && (
              <>
                <Link
                  href="/vendedor/login"
                  className="px-3 py-2 font-display text-sm font-medium transition-all duration-200 rounded-lg text-gray-700 hover:text-primary-500 hover:bg-gray-50"
                >
                  Iniciar Sesión
                </Link>
                <Link href="/menu" className="btn-primary px-4 py-2 text-sm">
                  Hacer pedido
                </Link>
              </>
            )}
            {!loading && user && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 font-display text-sm font-medium transition-all duration-200 rounded-lg text-gray-700 hover:text-primary-500 hover:bg-gray-50"
              >
                Cerrar Sesión
              </button>
            )}
            {user && isVendedor && (
              <Link
                href="/vendedor/dashboard"
                className="btn-primary px-4 py-2 text-sm"
              >
                Ir al Panel
              </Link>
            )}
            {(!user || !isVendedor) && (
              <button
                onClick={toggleCart}
                className="relative px-2 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
                aria-label="Carrito de compras"
              >
                <svg
                  className="w-5 h-5 transition-colors text-gray-700"
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
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shadow-medium">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Navegación Mobile */}
      <div
        className={`lg:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        } bg-[#faf8f5] shadow-medium`}
      >
        <div className="px-4 pt-3 pb-4 space-y-1 border-t border-gray-200">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center ${
              isActive("/")
                ? "text-primary-500 bg-primary-50"
                : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center ${
              isActive("/menu")
                ? "text-primary-500 bg-primary-50"
                : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
            }`}
          >
            Menú
          </Link>
          <Link
            href="/sobre-nosotros"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center ${
              isActive("/sobre-nosotros")
                ? "text-primary-500 bg-primary-50"
                : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
            }`}
          >
            Nosotros
          </Link>
          <Link
            href="/contacto"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center ${
              isActive("/contacto")
                ? "text-primary-500 bg-primary-50"
                : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
            }`}
          >
            Contacto
          </Link>
          {!loading && !user && (
            <>
              <Link
                href="/vendedor/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-500 hover:bg-gray-50 transition-all duration-200 text-center"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary block text-center mt-2"
              >
                Hacer pedido
              </Link>
            </>
          )}
          {!loading && user && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="block w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-500 hover:bg-gray-50 transition-all duration-200 mt-2 text-center"
            >
              Cerrar Sesión
            </button>
          )}
          {user && isVendedor && (
            <Link
              href="/vendedor/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-primary block text-center mt-2"
            >
              Ir al Panel
            </Link>
          )}
          {(!user || !isVendedor) && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                toggleCart();
              }}
              className="relative w-full px-3 py-2 rounded-lg bg-primary-500 text-white text-sm font-semibold mt-2 flex items-center justify-center gap-2 hover:bg-primary-600 hover:text-white transition-all duration-200 shadow-medium"
              aria-label="Carrito de compras"
            >
              <svg
                className="w-4 h-4"
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
              Carrito
              {totalItems > 0 && (
                <span className="bg-white text-primary-500 text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shadow-soft">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
