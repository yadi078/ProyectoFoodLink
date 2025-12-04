/**
 * Hook para obtener el contador de reseñas del vendedor
 */

import { useState, useEffect } from "react";
import { getEstadisticasCalificacionesVendedor } from "@/services/platillos/calificacionService";

export const useResenasCount = (vendedorId?: string) => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCount = async () => {
      if (!vendedorId) {
        setCount(0);
        setLoading(false);
        return;
      }

      try {
        const estadisticas = await getEstadisticasCalificacionesVendedor(vendedorId);
        setCount(estadisticas.totalResenas);
      } catch (error) {
        console.error("Error cargando contador de reseñas:", error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    cargarCount();
  }, [vendedorId]);

  return { count, loading };
};

