/**
 * Servicio de Chat
 * Maneja las conversaciones y mensajes entre estudiantes y vendedores
 */

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Conversacion, Mensaje } from "@/lib/firebase/types";
import { timestampToDate } from "@/utils/formatters";

/**
 * Crear o obtener conversación existente
 */
export const crearObtenerConversacion = async (
  estudianteId: string,
  vendedorId: string,
  pedidoId?: string
): Promise<string> => {
  try {
    // Buscar conversación existente
    const conversacionesRef = collection(db, "conversaciones");
    const q = query(
      conversacionesRef,
      where("estudianteId", "==", estudianteId),
      where("vendedorId", "==", vendedorId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }

    // Obtener nombres
    const estudianteDoc = await getDoc(doc(db, "estudiantes", estudianteId));
    const vendedorDoc = await getDoc(doc(db, "vendedores", vendedorId));

    const estudianteNombre = estudianteDoc.exists()
      ? estudianteDoc.data().nombre
      : "Estudiante";
    const vendedorNombre = vendedorDoc.exists()
      ? vendedorDoc.data().nombre
      : "Vendedor";

    // Crear nueva conversación
    const conversacionData = {
      estudianteId,
      vendedorId,
      pedidoId: pedidoId || null,
      ultimoMensaje: "",
      ultimoMensajeFecha: new Date(),
      estudianteNombre,
      vendedorNombre,
      noLeidos: {
        estudiante: 0,
        vendedor: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(conversacionesRef, conversacionData);
    return docRef.id;
  } catch (error) {
    console.error("Error creando/obteniendo conversación:", error);
    throw error;
  }
};

/**
 * Enviar mensaje
 */
export const enviarMensaje = async (
  conversacionId: string,
  remitenteId: string,
  remitenteNombre: string,
  remitenteTipo: "estudiante" | "vendedor",
  mensaje: string
): Promise<void> => {
  try {
    // Crear mensaje
    const mensajesRef = collection(db, "mensajes");
    await addDoc(mensajesRef, {
      conversacionId,
      remitenteId,
      remitenteNombre,
      remitenteTipo,
      mensaje: mensaje.trim(),
      leido: false,
      createdAt: new Date(),
    });

    // Actualizar conversación
    const conversacionRef = doc(db, "conversaciones", conversacionId);
    const conversacionDoc = await getDoc(conversacionRef);

    if (conversacionDoc.exists()) {
      const data = conversacionDoc.data();
      const noLeidos = data.noLeidos || { estudiante: 0, vendedor: 0 };

      // Incrementar no leídos del receptor
      if (remitenteTipo === "estudiante") {
        noLeidos.vendedor += 1;
      } else {
        noLeidos.estudiante += 1;
      }

      await updateDoc(conversacionRef, {
        ultimoMensaje: mensaje.trim().substring(0, 100),
        ultimoMensajeFecha: new Date(),
        noLeidos,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    throw error;
  }
};

/**
 * Obtener conversaciones del estudiante
 */
export const getConversacionesEstudiante = async (
  estudianteId: string
): Promise<Conversacion[]> => {
  return getConversaciones("estudiante", estudianteId);
};

/**
 * Obtener conversaciones del vendedor
 */
export const getConversacionesVendedor = async (
  vendedorId: string
): Promise<Conversacion[]> => {
  return getConversaciones("vendedor", vendedorId);
};

/**
 * Función genérica para obtener conversaciones
 */
const getConversaciones = async (
  tipo: "estudiante" | "vendedor",
  userId: string
): Promise<Conversacion[]> => {
  try {
    const conversacionesRef = collection(db, "conversaciones");
    const campoFiltro = tipo === "estudiante" ? "estudianteId" : "vendedorId";

    const q = query(
      conversacionesRef,
      where(campoFiltro, "==", userId),
      orderBy("ultimoMensajeFecha", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        ultimoMensajeFecha: timestampToDate(data.ultimoMensajeFecha),
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
      } as Conversacion;
    });
  } catch (error) {
    console.error(`Error obteniendo conversaciones de ${tipo}:`, error);
    return [];
  }
};

/**
 * Suscribirse a mensajes de una conversación (tiempo real)
 */
export const suscribirseAMensajes = (
  conversacionId: string,
  callback: (mensajes: Mensaje[]) => void
): (() => void) => {
  const mensajesRef = collection(db, "mensajes");
  const q = query(
    mensajesRef,
    where("conversacionId", "==", conversacionId),
    orderBy("createdAt", "asc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const mensajes = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
      } as Mensaje;
    });
    callback(mensajes);
  });

  return unsubscribe;
};

/**
 * Marcar mensajes como leídos
 */
export const marcarMensajesComoLeidos = async (
  conversacionId: string,
  usuarioTipo: "estudiante" | "vendedor"
): Promise<void> => {
  try {
    const conversacionRef = doc(db, "conversaciones", conversacionId);
    const conversacionDoc = await getDoc(conversacionRef);

    if (conversacionDoc.exists()) {
      const data = conversacionDoc.data();
      const noLeidos = data.noLeidos || { estudiante: 0, vendedor: 0 };

      // Resetear contador del usuario
      if (usuarioTipo === "estudiante") {
        noLeidos.estudiante = 0;
      } else {
        noLeidos.vendedor = 0;
      }

      await updateDoc(conversacionRef, {
        noLeidos,
      });
    }
  } catch (error) {
    console.error("Error marcando mensajes como leídos:", error);
  }
};

/**
 * Obtener total de mensajes no leídos del estudiante
 */
export const getTotalNoLeidosEstudiante = async (
  estudianteId: string
): Promise<number> => {
  return getTotalNoLeidos("estudiante", estudianteId);
};

/**
 * Obtener total de mensajes no leídos del vendedor
 */
export const getTotalNoLeidosVendedor = async (
  vendedorId: string
): Promise<number> => {
  return getTotalNoLeidos("vendedor", vendedorId);
};

/**
 * Función genérica para obtener total de mensajes no leídos
 */
const getTotalNoLeidos = async (
  tipo: "estudiante" | "vendedor",
  userId: string
): Promise<number> => {
  try {
    const conversacionesRef = collection(db, "conversaciones");
    const campoFiltro = tipo === "estudiante" ? "estudianteId" : "vendedorId";

    const q = query(conversacionesRef, where(campoFiltro, "==", userId));
    const snapshot = await getDocs(q);

    let total = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      total += data.noLeidos?.[tipo] || 0;
    });

    return total;
  } catch (error) {
    console.error(`Error obteniendo total no leídos de ${tipo}:`, error);
    return 0;
  }
};
