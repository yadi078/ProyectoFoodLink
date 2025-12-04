/**
 * Página de Configuración para Vendedores
 * Permite gestionar preferencias de notificaciones y otros ajustes
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import VendedorLayout from "@/components/vendedor/VendedorLayout";
import NotificationSettings from "@/components/notifications/NotificationSettings";
import NotificationDebugger from "@/components/notifications/NotificationDebugger";

export default function ConfiguracionPage() {
  const router = useRouter();
  const { user, vendedor, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/vendedor/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <VendedorLayout title="Configuración">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </VendedorLayout>
    );
  }

  if (!user || !vendedor) {
    return null;
  }

  return (
    <VendedorLayout
      title="Configuración"
      subtitle="Administra tu configuración de cuenta"
    >
      {user && <NotificationDebugger userId={user.uid} />}
      
      {/* Notificaciones */}
      {user && <NotificationSettings userId={user.uid} />}

      {/* Información de la cuenta */}
      <div className="bg-white rounded-lg shadow-soft p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          👤 Información de la Cuenta
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Nombre</p>
            <p className="font-medium text-gray-900">{vendedor.nombre}</p>
          </div>
          {vendedor.nombreNegocio && (
            <div>
              <p className="text-sm text-gray-600">Nombre del Negocio</p>
              <p className="font-medium text-gray-900">
                {vendedor.nombreNegocio}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Correo Electrónico</p>
            <p className="font-medium text-gray-900">{vendedor.email}</p>
          </div>
          {vendedor.telefono && (
            <div>
              <p className="text-sm text-gray-600">Teléfono</p>
              <p className="font-medium text-gray-900">{vendedor.telefono}</p>
            </div>
          )}
          {vendedor.tipoComida && vendedor.tipoComida.length > 0 && (
            <div>
              <p className="text-sm text-gray-600">Tipo de Comida</p>
              <p className="font-medium text-gray-900">
                {vendedor.tipoComida.join(", ")}
              </p>
            </div>
          )}
          {vendedor.horario && (
            <div>
              <p className="text-sm text-gray-600">Horario de Servicio</p>
              <p className="font-medium text-gray-900">
                {vendedor.horario.inicio} - {vendedor.horario.fin}
              </p>
            </div>
          )}
        </div>
      </div>
    </VendedorLayout>
  );
}

