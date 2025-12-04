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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);

  const isVendedor = vendedor !== null;
  // Solo mostrar el contador después de la hidratación para evitar problemas SSR
  const totalItems = mounted && isHydrated ? getTotalItems() : 0;

  // Marcar como montado en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cerrar dropdown de usuario al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logoutVendedor();
    clearCart();
    router.push("/");
  };

  // Obtener inicial del usuario
  const getUserInitial = () => {
    if (!user) return "U";
    if (user.displayName) return user.displayName[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return "U";
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

            {/* Carrito */}
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

            {/* Avatar de usuario con dropdown */}
            {!loading && user && (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm hover:bg-primary-600 transition-all duration-200 shadow-soft hover:shadow-medium border-2 border-primary-600"
                  aria-label="Menú de usuario"
                >
                  {getUserInitial()}
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href={
                        isVendedor
                          ? "/vendedor/configuracion"
                          : "/configuracion"
                      }
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-500 transition-colors duration-200"
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
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Configuración
                    </Link>

                    {isVendedor && (
                      <Link
                        href="/vendedor/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-500 transition-colors duration-200"
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
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        Panel Vendedor
                      </Link>
                    )}

                    <div className="border-t border-gray-200 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200 w-full text-left"
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Navegación Mobile */}
      <div
        className={`lg:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        } bg-[#faf8f5] shadow-medium`}
      >
        <div className="px-4 pt-3 pb-4 space-y-1 border-t border-gray-200">
          {/* Avatar de usuario móvil con dropdown */}
          {!loading && user && (
            <div className="mb-3">
              <div className="flex flex-col items-center mb-2">
                <button
                  onClick={() => setIsMobileUserMenuOpen(!isMobileUserMenuOpen)}
                  className={`w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-2xl shadow-medium border-2 transition-all duration-200 active:scale-95 ${
                    isMobileUserMenuOpen
                      ? "border-secondary-500 ring-4 ring-secondary-100"
                      : "border-primary-600 hover:bg-primary-600"
                  }`}
                >
                  {getUserInitial()}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  {isMobileUserMenuOpen
                    ? "▲ Ocultar opciones"
                    : "▼ Ver opciones"}
                </p>
              </div>

              {/* Dropdown móvil del usuario */}
              {isMobileUserMenuOpen && (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href={
                      isVendedor ? "/vendedor/configuracion" : "/configuracion"
                    }
                    onClick={() => {
                      setIsMobileUserMenuOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors duration-200 border-b border-gray-100"
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="font-medium">Configuración</span>
                  </Link>

                  {isVendedor && (
                    <Link
                      href="/vendedor/dashboard"
                      onClick={() => {
                        setIsMobileUserMenuOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors duration-200 border-b border-gray-100"
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      <span className="font-medium">Panel Vendedor</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setIsMobileUserMenuOpen(false);
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors duration-200 w-full"
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/")
                ? "text-primary-500 bg-primary-50 border-l-4 border-primary-500"
                : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/menu")
                ? "text-primary-500 bg-primary-50 border-l-4 border-primary-500"
                : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
            }`}
          >
            Menú
          </Link>
          <Link
            href="/sobre-nosotros"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/sobre-nosotros")
                ? "text-primary-500 bg-primary-50 border-l-4 border-primary-500"
                : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
            }`}
          >
            Nosotros
          </Link>
          <Link
            href="/contacto"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/contacto")
                ? "text-primary-500 bg-primary-50 border-l-4 border-primary-500"
                : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
            }`}
          >
            Contacto
          </Link>

          {/* Carrito */}
          {(!user || !isVendedor) && (
            <>
              <div className="border-t border-gray-200 my-2"></div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  toggleCart();
                }}
                className="relative w-full px-3 py-2 rounded-lg bg-primary-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 hover:text-white transition-all duration-200 shadow-medium"
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
                  <span className="bg-white text-primary-500 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-soft">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
