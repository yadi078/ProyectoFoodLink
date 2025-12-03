"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logoutVendedor } from "@/services/auth/authService";
import VendedorSidebar from "./VendedorSidebar";

interface VendedorLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function VendedorLayout({
  children,
  title,
  subtitle,
}: VendedorLayoutProps) {
  const router = useRouter();
  const { vendedor } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutVendedor();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Sidebar */}
      <VendedorSidebar />

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 font-display">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {vendedor && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center font-bold text-white">
                    {vendedor.nombre?.[0]?.toUpperCase() || "V"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {vendedor.nombre}
                    </p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-error-500 hover:bg-error-600 rounded-lg transition-all duration-200 shadow-soft hover:shadow-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

