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
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-[#faf8f5] shadow-soft py-2 sm:py-3 h-14 sm:h-16 flex items-center z-50">
      <nav className="max-w-[1366px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center gap-2">
          {/* Espaciador izquierdo para centrar el logo */}
          <div className="w-16 sm:w-20 md:w-24 lg:w-32"></div>

          {/* Logo Centrado */}
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105 duration-200 flex-shrink-0"
          >
            <Image
              src="/icons/web-app-manifest-192x192.png"
              alt="FoodLink"
              width={50}
              height={50}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg flex-shrink-0"
            />
            <span className="ml-1.5 sm:ml-2 md:ml-3 text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold font-display leading-none whitespace-nowrap">
              <span className="text-primary-500">Food</span>
              <span className="text-secondary-500">Link</span>
            </span>
          </Link>

          {/* Botón de Cerrar Sesión */}
          {user ? (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={loading}
              className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-error-500 hover:bg-error-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold shadow-soft hover:shadow-medium flex-shrink-0"
              title="Cerrar sesión"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
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
              <span className="hidden sm:inline whitespace-nowrap">
                {loading ? "Cerrando..." : "Cerrar sesión"}
              </span>
            </button>
          ) : (
            <div className="w-16 sm:w-20 md:w-24 lg:w-32"></div>
          )}
        </div>
      </nav>

      {/* Confirmación de Cierre de Sesión */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        onConfirm={handleLogout}
        onCancel={() => setShowConfirm(false)}
        type="warning"
      />
    </header>
  );
}
