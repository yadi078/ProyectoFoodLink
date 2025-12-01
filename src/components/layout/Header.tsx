/**
 * Header Component - Navegación principal
 * Header responsivo estilo plantilla: transparente en hero, sticky con fondo blanco
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/context/CartContext";
import CartSidebar from "@/components/cart/CartSidebar";
import { logoutVendedor } from "@/services/auth/authService";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, vendedor, loading } = useAuth();
  const { getTotalItems, toggleCart, clearCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isVendedor = vendedor !== null;
  const totalItems = getTotalItems();

  const handleLogout = async () => {
    await logoutVendedor();
    clearCart();
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;
  const isHomePage = pathname === "/";

  // Detectar scroll para cambiar el estilo del header en la homepage
  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true); // En otras páginas siempre mostrar fondo blanco
      return;
    }

    const handleScroll = () => {
      // Cambiar estilo cuando se hace scroll más allá de la altura del viewport
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      // Cambiar cuando se haya scrolleado más del 80% de la altura del viewport
      setIsScrolled(scrollPosition > viewportHeight * 0.8);
    };

    // Verificar posición inicial
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Determinar si el header debe ser transparente
  const shouldBeTransparent = isHomePage && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-[999] py-2.5 lg:px-[60px] transition-all duration-300 ${
        shouldBeTransparent
          ? "bg-transparent shadow-none"
          : "bg-white shadow-[0_2px_5px_rgba(0,0,0,0.3)]"
      }`}
    >
      <nav className="max-w-[1366px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-3xl lg:text-[45px] font-bold font-display leading-none">
              <span
                className={
                  shouldBeTransparent ? "text-white" : "text-[#fbaf32]"
                }
              >
                Food
              </span>
              <span
                className={
                  shouldBeTransparent ? "text-white" : "text-[#719a0a]"
                }
              >
                Link
              </span>
            </span>
          </Link>

          {/* Botón mobile menu */}
          <button
            className={`lg:hidden focus:outline-none transition-colors ${
              shouldBeTransparent
                ? "text-white hover:text-white/80"
                : "text-[#666666] hover:text-[#fbaf32]"
            }`}
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
              className={`px-2.5 py-2.5 font-display text-lg font-semibold transition-colors ${
                isActive("/")
                  ? shouldBeTransparent
                    ? "text-white"
                    : "text-[#fbaf32]"
                  : shouldBeTransparent
                  ? "text-white/80 hover:text-white"
                  : "text-[#666666] hover:text-[#fbaf32]"
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/menu"
              className={`px-2.5 py-2.5 font-display text-lg font-semibold transition-colors ${
                isActive("/menu")
                  ? "text-[#fbaf32]"
                  : shouldBeTransparent
                  ? "text-white/80 hover:text-white"
                  : "text-[#666666] hover:text-[#fbaf32]"
              }`}
            >
              Menú
            </Link>
            <Link
              href="/sobre-nosotros"
              className={`px-2.5 py-2.5 font-display text-lg font-semibold transition-colors ${
                isActive("/sobre-nosotros")
                  ? "text-[#fbaf32]"
                  : shouldBeTransparent
                  ? "text-white/80 hover:text-white"
                  : "text-[#666666] hover:text-[#fbaf32]"
              }`}
            >
              Nosotros
            </Link>
            <Link
              href="/contacto"
              className={`px-2.5 py-2.5 font-display text-lg font-semibold transition-colors ${
                isActive("/contacto")
                  ? "text-[#fbaf32]"
                  : shouldBeTransparent
                  ? "text-white/80 hover:text-white"
                  : "text-[#666666] hover:text-[#fbaf32]"
              }`}
            >
              Contacto
            </Link>
            {!loading && !user && (
              <>
                <Link
                  href="/vendedor/login"
                  className={`px-4 py-2 font-display font-semibold transition-colors ${
                    shouldBeTransparent
                      ? "text-white/80 hover:text-white"
                      : "text-[#666666] hover:text-[#fbaf32]"
                  }`}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/vendedor/signup"
                  className={`px-6 py-2 text-sm font-display font-semibold transition-colors ${
                    shouldBeTransparent
                      ? "bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 hover:border-white/50"
                      : "btn-secondary"
                  }`}
                >
                  Registrarse
                </Link>
              </>
            )}
            {!loading && user && (
              <button
                onClick={handleLogout}
                className={`px-4 py-2 font-display font-semibold transition-colors ${
                  shouldBeTransparent
                    ? "text-white/80 hover:text-white"
                    : "text-[#666666] hover:text-[#fbaf32]"
                }`}
              >
                Cerrar Sesión
              </button>
            )}
            {user && isVendedor && (
              <Link
                href="/vendedor/dashboard"
                className="btn-primary px-6 py-2 text-sm"
              >
                Ir al Panel
              </Link>
            )}
            {(!user || !isVendedor) && (
              <button
                onClick={toggleCart}
                className="relative px-4 py-2 rounded-lg transition-colors hover:bg-gray-100"
                aria-label="Carrito de compras"
              >
                <svg
                  className={`w-6 h-6 ${
                    shouldBeTransparent ? "text-white" : "text-[#666666]"
                  }`}
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
                  <span className="absolute -top-1 -right-1 bg-[#fbaf32] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
        } bg-white`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 border-t border-gray-200">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive("/")
                ? "text-[#fbaf32] bg-primary-50"
                : "text-[#666666] hover:text-[#fbaf32] hover:bg-gray-50"
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive("/menu")
                ? "text-[#fbaf32] bg-primary-50"
                : "text-[#666666] hover:text-[#fbaf32] hover:bg-gray-50"
            }`}
          >
            Menú
          </Link>
          <Link
            href="/sobre-nosotros"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive("/sobre-nosotros")
                ? "text-[#fbaf32] bg-primary-50"
                : "text-[#666666] hover:text-[#fbaf32] hover:bg-gray-50"
            }`}
          >
            Nosotros
          </Link>
          <Link
            href="/contacto"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive("/contacto")
                ? "text-[#fbaf32] bg-primary-50"
                : "text-[#666666] hover:text-[#fbaf32] hover:bg-gray-50"
            }`}
          >
            Contacto
          </Link>
          {!loading && !user && (
            <>
              <Link
                href="/vendedor/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#666666] hover:text-[#fbaf32]"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/vendedor/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-secondary block text-center mt-2"
              >
                Registrarse
              </Link>
            </>
          )}
          {!loading && user && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="block w-full px-3 py-2 rounded-md text-base font-medium text-[#666666] hover:text-[#fbaf32] mt-2"
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
              className="relative w-full px-4 py-3 rounded-lg bg-[#fbaf32] text-white font-semibold mt-2 flex items-center justify-center gap-2"
              aria-label="Carrito de compras"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Carrito
              {totalItems > 0 && (
                <span className="bg-white text-[#fbaf32] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </header>
  );
}
