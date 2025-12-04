/**
 * Página de Configuración para Alumnos
 * Permite gestionar preferencias de notificaciones y editar perfil
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NotificationSettings from "@/components/notifications/NotificationSettings";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Estudiante } from "@/lib/firebase/types";

export default function ConfiguracionPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [cargandoEstudiante, setCargandoEstudiante] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "success" | "error";
    texto: string;
  } | null>(null);

  // Formulario
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    institucionEducativa: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/vendedor/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const cargarEstudiante = async () => {
      if (!user) return;

      try {
        const estudianteDoc = await getDoc(doc(db, "estudiantes", user.uid));
        if (estudianteDoc.exists()) {
          const data = {
            uid: estudianteDoc.id,
            ...estudianteDoc.data(),
          } as Estudiante;
          setEstudiante(data);
          setFormData({
            nombre: data.nombre || "",
            telefono: data.telefono || "",
            institucionEducativa: data.institucionEducativa || "",
          });
        }
      } catch (error) {
        console.error("Error al cargar estudiante:", error);
      } finally {
        setCargandoEstudiante(false);
      }
    };

    if (user) {
      cargarEstudiante();
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardarCambios = async () => {
    if (!user || !estudiante) return;

    setGuardando(true);
    setMensaje(null);

    try {
      await updateDoc(doc(db, "estudiantes", user.uid), {
        nombre: formData.nombre,
        telefono: formData.telefono,
        updatedAt: new Date(),
      });

      setEstudiante({
        ...estudiante,
        nombre: formData.nombre,
        telefono: formData.telefono,
        updatedAt: new Date(),
      });

      setModoEdicion(false);
      setMensaje({
        tipo: "success",
        texto: "¡Perfil actualizado exitosamente!",
      });

      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setMensaje({
        tipo: "error",
        texto: "Error al guardar los cambios. Inténtalo de nuevo.",
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelarEdicion = () => {
    if (estudiante) {
      setFormData({
        nombre: estudiante.nombre || "",
        telefono: estudiante.telefono || "",
        institucionEducativa: estudiante.institucionEducativa || "",
      });
    }
    setModoEdicion(false);
    setMensaje(null);
  };

  if (loading || cargandoEstudiante) {
    return (
      <div className="bg-[#faf8f5] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Header de la página */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            ⚙️ Configuración
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Administra tu perfil y preferencias de cuenta
          </p>
        </div>

        {/* Mensaje de éxito/error */}
        {mensaje && (
          <div
            className={`mb-4 p-3 sm:p-4 rounded-lg ${
              mensaje.tipo === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {mensaje.tipo === "success" ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <p className="font-medium">{mensaje.texto}</p>
            </div>
          </div>
        )}

        {/* Información del Perfil */}
        {estudiante && (
          <div className="bg-white rounded-xl shadow-soft p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary-500"
                  fill="none"
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
                Información del Perfil
              </h2>
              {!modoEdicion && (
                <button
                  onClick={() => setModoEdicion(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200 shadow-soft hover:shadow-medium"
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
                  Editar Perfil
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                {modoEdicion ? (
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="Tu nombre completo"
                  />
                ) : (
                  <p className="text-gray-900 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                    {estudiante.nombre}
                  </p>
                )}
              </div>

              {/* Email (no editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-600 font-medium">
                    {estudiante.email}
                  </p>
                  <span className="ml-auto text-xs text-gray-500 italic">
                    No editable
                  </span>
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                {modoEdicion ? (
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="Tu número de teléfono"
                  />
                ) : (
                  <p className="text-gray-900 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                    {estudiante.telefono || "No especificado"}
                  </p>
                )}
              </div>

              {/* Institución Educativa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institución Educativa
                </label>
                <p className="text-gray-900 font-medium px-4 py-2 bg-gray-50 rounded-lg">
                  {estudiante.institucionEducativa || "No especificado"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  La institución no se puede modificar
                </p>
              </div>
            </div>

            {/* Botones de acción en modo edición */}
            {modoEdicion && (
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleGuardarCambios}
                  disabled={guardando}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-soft hover:shadow-medium font-semibold"
                >
                  {guardando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Guardar Cambios
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelarEdicion}
                  disabled={guardando}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notificaciones */}
        {user && <NotificationSettings userId={user.uid} />}
      </div>
    </div>
  );
}
