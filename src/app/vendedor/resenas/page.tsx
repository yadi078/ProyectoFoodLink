"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import VendedorLayout from "@/components/vendedor/VendedorLayout";
import {
  getCalificacionesByVendedor,
  getEstadisticasCalificacionesVendedor,
  type CalificacionProducto,
} from "@/services/platillos/calificacionService";
import { getPlatillosByVendedor } from "@/services/platillos/platilloService";
import type { Platillo } from "@/lib/firebase/types";
import { formatDate } from "@/utils/formatters";

interface CalificacionConPlatillo extends CalificacionProducto {
  platilloNombre?: string;
  platilloImagen?: string;
}

export default function ResenasPage() {
  const router = useRouter();
  const { user, vendedor, loading: authLoading } = useAuth();
  const [calificaciones, setCalificaciones] = useState<
    CalificacionConPlatillo[]
  >([]);
  const [estadisticas, setEstadisticas] = useState<{
    promedioGeneral: number;
    totalResenas: number;
    distribucion: { [key: number]: number };
  }>({
    promedioGeneral: 0,
    totalResenas: 0,
    distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [filtroCalificacion, setFiltroCalificacion] = useState<
    number | "todos"
  >("todos");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/vendedor/login");
    }
  }, [user, authLoading, router]);

  const cargarResenas = useCallback(async () => {
    if (!vendedor) return;

    try {
      setLoading(true);

      // Cargar calificaciones y estadísticas
      const [calificacionesData, estadisticasData, platillos] =
        await Promise.all([
          getCalificacionesByVendedor(vendedor.uid),
          getEstadisticasCalificacionesVendedor(vendedor.uid),
          getPlatillosByVendedor(vendedor.uid),
        ]);

      // Enriquecer calificaciones con información del platillo
      const calificacionesEnriquecidas = calificacionesData.map((cal) => {
        const platillo = platillos.find((p) => p.id === cal.platilloId);
        return {
          ...cal,
          platilloNombre: platillo?.nombre || "Platillo no encontrado",
          platilloImagen: platillo?.imagen,
        };
      });

      setCalificaciones(calificacionesEnriquecidas);
      setEstadisticas(estadisticasData);
    } catch (error) {
      console.error("Error cargando reseñas:", error);
    } finally {
      setLoading(false);
    }
  }, [vendedor]);

  useEffect(() => {
    if (vendedor) {
      cargarResenas();
    }
  }, [vendedor, cargarResenas]);

  const calificacionesFiltradas =
    filtroCalificacion === "todos"
      ? calificaciones
      : calificaciones.filter((cal) => cal.calificacion === filtroCalificacion);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1EC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#719A0A] mx-auto"></div>
          <p className="mt-4 text-[#2E2E2E]">Cargando reseñas...</p>
        </div>
      </div>
    );
  }

  if (!user || !vendedor) {
    return null;
  }

  return (
    <VendedorLayout
      title="Reseñas"
      subtitle="Calificaciones y comentarios de tus clientes"
    >
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Promedio General */}
        <div className="bg-white rounded-xl shadow-soft p-5 sm:p-6 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FFA552]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFA552]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 font-semibold mb-1">
                Calificación Promedio
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-[#2E2E2E]">
                {estadisticas.promedioGeneral > 0
                  ? estadisticas.promedioGeneral.toFixed(1)
                  : "0.0"}
              </p>
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const promedio = estadisticas.promedioGeneral;
                  const isFullStar = star <= Math.floor(promedio);
                  const isHalfStar = !isFullStar && star === Math.ceil(promedio) && promedio % 1 >= 0.5;
                  
                  return (
                    <span
                      key={star}
                      className={`text-lg ${
                        isFullStar || isHalfStar
                          ? "text-[#FFA552]"
                          : "text-gray-300"
                      }`}
                    >
                      ⭐
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Total de Reseñas */}
        <div className="bg-white rounded-xl shadow-soft p-5 sm:p-6 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 font-semibold mb-1">
                Total de Reseñas
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-[#2E2E2E]">
                {estadisticas.totalResenas}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Comentarios de clientes
              </p>
            </div>
          </div>
        </div>

        {/* Distribución de Calificaciones */}
        <div className="bg-white rounded-xl shadow-soft p-5 sm:p-6 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Distribución de Calificaciones
          </h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                estadisticas.distribucion[
                  rating as keyof typeof estadisticas.distribucion
                ] || 0;
              const percentage =
                estadisticas.totalResenas > 0
                  ? (count / estadisticas.totalResenas) * 100
                  : 0;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600 w-8">
                    {rating} ⭐
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFA552] rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-soft p-4 sm:p-6 border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="font-semibold text-gray-800 text-sm">
              Filtrar por calificación:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroCalificacion("todos")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filtroCalificacion === "todos"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFiltroCalificacion(rating)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                  filtroCalificacion === rating
                    ? "bg-[#FFA552] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {rating} ⭐
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Reseñas */}
      {calificacionesFiltradas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-soft p-8 sm:p-12 text-center border border-gray-200">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <p className="text-gray-600 text-base sm:text-lg font-medium">
            {calificaciones.length === 0
              ? "Aún no tienes reseñas"
              : "No hay reseñas con este filtro"}
          </p>
          {calificaciones.length === 0 && (
            <p className="text-gray-500 text-sm mt-2">
              Las reseñas de tus clientes aparecerán aquí
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {calificacionesFiltradas.map((calificacion) => (
            <div
              key={calificacion.id}
              className="bg-white rounded-xl shadow-soft border border-gray-200 hover:shadow-medium transition-shadow overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Imagen del platillo */}
                  <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {calificacion.platilloImagen ? (
                      <Image
                        src={calificacion.platilloImagen}
                        alt={calificacion.platilloNombre || "Platillo"}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-3xl">🍽️</span>
                      </div>
                    )}
                  </div>

                  {/* Contenido de la reseña */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-800">
                          {calificacion.platilloNombre}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          por {calificacion.estudianteNombre || "Cliente"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-base sm:text-lg ${
                              star <= calificacion.calificacion
                                ? "text-[#FFA552]"
                                : "text-gray-300"
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    {calificacion.comentario && (
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          "{calificacion.comentario}"
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {calificacion.createdAt
                          ? formatDate(calificacion.createdAt)
                          : "Fecha no disponible"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </VendedorLayout>
  );
}
