/**
 * Hook para obtener el contador de mensajes no leídos
 * Funciona tanto para vendedor como para estudiante
 */

import { useState, useEffect } from "react";
import {
  getTotalNoLeidosEstudiante,
  getTotalNoLeidosVendedor,
  getConversacionesEstudiante,
  getConversacionesVendedor,
} from "@/services/chat/chatService";
import type { Conversacion } from "@/lib/firebase/types";

interface UltimoMensajeNuevo {
  nombreRemitente: string;
  mensaje: string;
  conversacionId: string;
}

interface MensajesNoLeidosResult {
  totalNoLeidos: number;
  conversacionesConMensajes: Conversacion[];
  ultimoMensajeNuevo: UltimoMensajeNuevo | null;
  loading: boolean;
}

export const useMensajesNoLeidos = (
  userId?: string,
  tipo: "estudiante" | "vendedor" = "estudiante"
): MensajesNoLeidosResult => {
  const [totalNoLeidos, setTotalNoLeidos] = useState<number>(0);
  const [conversacionesConMensajes, setConversacionesConMensajes] = useState<
    Conversacion[]
  >([]);
  const [ultimoMensajeNuevo, setUltimoMensajeNuevo] =
    useState<UltimoMensajeNuevo | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalAnterior, setTotalAnterior] = useState<number>(0);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!userId) {
        setTotalNoLeidos(0);
        setConversacionesConMensajes([]);
        setLoading(false);
        return;
      }

      try {
        // Obtener total de no leídos
        const total =
          tipo === "estudiante"
            ? await getTotalNoLeidosEstudiante(userId)
            : await getTotalNoLeidosVendedor(userId);
        setTotalNoLeidos(total);

        // Obtener conversaciones con mensajes no leídos
        const conversaciones =
          tipo === "estudiante"
            ? await getConversacionesEstudiante(userId)
            : await getConversacionesVendedor(userId);

        // Filtrar solo las que tienen mensajes no leídos
        const conMensajes = conversaciones.filter((conv) => {
          const noLeidos =
            tipo === "estudiante"
              ? conv.noLeidos.estudiante
              : conv.noLeidos.vendedor;
          return noLeidos > 0;
        });

        setConversacionesConMensajes(conMensajes);

        // Detectar nuevo mensaje
        if (
          total > totalAnterior &&
          totalAnterior > 0 &&
          conMensajes.length > 0
        ) {
          // Encontrar la conversación con el mensaje más reciente
          const conversacionMasReciente = conMensajes.reduce(
            (prev, current) => {
              const prevFecha = prev.ultimoMensajeFecha?.getTime() || 0;
              const currentFecha = current.ultimoMensajeFecha?.getTime() || 0;
              return currentFecha > prevFecha ? current : prev;
            }
          );

          const nombreRemitente =
            tipo === "estudiante"
              ? conversacionMasReciente.vendedorNombre
              : conversacionMasReciente.estudianteNombre;

          setUltimoMensajeNuevo({
            nombreRemitente,
            mensaje: conversacionMasReciente.ultimoMensaje || "Nuevo mensaje",
            conversacionId: conversacionMasReciente.id,
          });

          // Limpiar después de 5 segundos
          setTimeout(() => setUltimoMensajeNuevo(null), 5000);
        }

        setTotalAnterior(total);
      } catch (error) {
        console.error("Error cargando mensajes no leídos:", error);
        setTotalNoLeidos(0);
        setConversacionesConMensajes([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();

    // Actualizar cada 10 segundos
    const interval = setInterval(cargarDatos, 10000);
    return () => clearInterval(interval);
  }, [userId, tipo, totalAnterior]);

  return {
    totalNoLeidos,
    conversacionesConMensajes,
    ultimoMensajeNuevo,
    loading,
  };
};
