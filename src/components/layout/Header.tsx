/**
 * Header Component - Logo y botón de cerrar sesión
 * Header con logo centrado y botón de logout para estudiantes
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/auth/authService";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    // Usar confirm() solo si está disponible, sino asumir confirmación
    const isConfirmed =
      typeof window !== "undefined" && window.confirm
        ? window.confirm("¿Estás seguro de que deseas cerrar sesión?")
        : true;

    if (!isConfirmed) return;

    setLoading(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // No usar alert() en APK - solo console.error
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-[#faf8f5] shadow-soft py-2 h-16 flex items-center z-50">
      <nav className="max-w-[1366px] mx-auto px-4 sm:px-6 md:px-8 w-full">
        <div className="flex justify-between items-center">
          {/* Espaciador izquierdo para centrar el logo */}
          <div className="w-24 sm:w-32"></div>

          {/* Logo Centrado */}
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105 duration-200"
          >
            <Image
              src="/icons/web-app-manifest-192x192.png"
              alt="FoodLink"
              width={50}
              height={50}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg"
            />
            <span className="ml-2 sm:ml-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-display leading-none">
              <span className="text-primary-500">Food</span>
              <span className="text-secondary-500">Link</span>
            </span>
          </Link>

          {/* Botón de Cerrar Sesión */}
          {user ? (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-error-500 hover:bg-error-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold shadow-soft hover:shadow-medium"
              title="Cerrar sesión"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">
                {loading ? "Cerrando..." : "Cerrar sesión"}
              </span>
            </button>
          ) : (
            <div className="w-24 sm:w-32"></div>
          )}
        </div>
      </nav>
    </header>
  );
}
