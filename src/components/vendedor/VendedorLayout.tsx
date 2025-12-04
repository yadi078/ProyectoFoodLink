"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logoutVendedor } from "@/services/auth/authService";
import VendedorSidebar from "./VendedorSidebar";

interface VendedorLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function VendedorLayout({
  children,
  title,
  subtitle,
}: VendedorLayoutProps) {
  const router = useRouter();
  const { vendedor } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutVendedor();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EC]">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <VendedorSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden">
            <VendedorSidebar onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 lg:py-5 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-700"
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

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 font-display truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{subtitle}</p>
              )}
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {vendedor && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#719A0A] rounded-full flex items-center justify-center font-bold text-white text-sm lg:text-base shadow-md">
                    {vendedor.nombre?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-[#2E2E2E] truncate max-w-[120px]">
                      {vendedor.nombre}
                    </p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-white bg-error-500 hover:bg-error-600 rounded-lg transition-all duration-200 shadow-soft hover:shadow-medium whitespace-nowrap"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

