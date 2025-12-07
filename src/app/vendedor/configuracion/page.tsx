/**
 * Página de Configuración para Vendedores
 * Permite gestionar preferencias de notificaciones y otros ajustes
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import VendedorLayout from "@/components/vendedor/VendedorLayout";
import NotificationSettings from "@/components/notifications/NotificationSettings";
import { updateVendedor } from "@/services/vendedores/vendedorService";
import { useAlert } from "@/components/context/AlertContext";
import type { Vendedor } from "@/lib/firebase/types";

export default function ConfiguracionPage() {
  const router = useRouter();
  const { user, vendedor, loading } = useAuth();
  const { showAlert } = useAlert();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    nombreNegocio: "",
    telefono: "",
    tipoComida: [] as string[],
    horarioInicio: "",
    horarioFin: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/vendedor/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (vendedor) {
      setFormData({
        nombre: vendedor.nombre || "",
        nombreNegocio: vendedor.nombreNegocio || "",
        telefono: vendedor.telefono || "",
        tipoComida: vendedor.tipoComida || [],
        horarioInicio: vendedor.horario?.inicio || "",
        horarioFin: vendedor.horario?.fin || "",
      });
    }
  }, [vendedor]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTipoComidaChange = (tipo: string) => {
    setFormData((prev) => ({
      ...prev,
      tipoComida: prev.tipoComida.includes(tipo)
        ? prev.tipoComida.filter((t) => t !== tipo)
        : [...prev.tipoComida, tipo],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendedor?.uid) return;

    setIsSaving(true);
    try {
      const updateData: Partial<Vendedor> = {
        nombre: formData.nombre,
        nombreNegocio: formData.nombreNegocio,
        telefono: formData.telefono,
        tipoComida: formData.tipoComida,
      };

      if (formData.horarioInicio && formData.horarioFin) {
        updateData.horario = {
          inicio: formData.horarioInicio,
          fin: formData.horarioFin,
        };
      }

      await updateVendedor(vendedor.uid, updateData);
      showAlert("Perfil actualizado exitosamente", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      showAlert("Error al actualizar el perfil", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (vendedor) {
      setFormData({
        nombre: vendedor.nombre || "",
        nombreNegocio: vendedor.nombreNegocio || "",
        telefono: vendedor.telefono || "",
        tipoComida: vendedor.tipoComida || [],
        horarioInicio: vendedor.horario?.inicio || "",
        horarioFin: vendedor.horario?.fin || "",
      });
    }
    setIsEditing(false);
  };

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
      {/* Notificaciones */}
      {user && <NotificationSettings userId={user.uid} />}

      {/* Información de la cuenta */}
      <div className="bg-white rounded-lg shadow-soft p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            👤 Información de la Cuenta
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary flex items-center gap-2"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Nombre del Negocio *</label>
              <input
                type="text"
                name="nombreNegocio"
                value={formData.nombreNegocio}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                value={vendedor.email}
                className="form-input bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                El correo no se puede modificar
              </p>
            </div>

            <div>
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: 1234567890"
              />
            </div>

            <div>
              <label className="form-label">Tipo de Comida</label>
              <div className="grid grid-cols-2 gap-3">
                {["Comida rápida", "Comida casera", "Bebidas", "Postres"].map(
                  (tipo) => (
                    <label
                      key={tipo}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.tipoComida.includes(tipo)}
                        onChange={() => handleTipoComidaChange(tipo)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{tipo}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Horario de Inicio</label>
                <input
                  type="time"
                  name="horarioInicio"
                  value={formData.horarioInicio}
                  onChange={handleChange}
                  className="form-input"
                  step="60"
                  // Formato 24 horas (HH:mm)
                />
              </div>
              <div>
                <label className="form-label">Horario de Cierre</label>
                <input
                  type="time"
                  name="horarioFin"
                  value={formData.horarioFin}
                  onChange={handleChange}
                  className="form-input"
                  step="60"
                  // Formato 24 horas (HH:mm)
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        ) : (
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
        )}
      </div>
    </VendedorLayout>
  );
}
