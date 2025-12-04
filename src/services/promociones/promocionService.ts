/**
 * Servicio de Promociones
 * Maneja la validación y aplicación de códigos promocionales
 */

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Promocion, UsoPromocion } from "@/lib/firebase/types";

/**
 * Validar y aplicar código promocional
 */
export const validarPromocion = async (
  codigo: string,
  estudianteId: string,
  montoCompra: number
): Promise<{
  valido: boolean;
  mensaje: string;
  descuento?: number;
  promocion?: Promocion;
}> => {
  try {
    // Buscar promoción por código
    const promocionesRef = collection(db, "promociones");
    const q = query(
      promocionesRef,
      where("codigo", "==", codigo.toUpperCase()),
      where("activo", "==", true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        valido: false,
        mensaje: "Código promocional no válido",
      };
    }

    const promocionDoc = snapshot.docs[0];
    const promocion = {
      id: promocionDoc.id,
      ...promocionDoc.data(),
    } as Promocion;

    // Verificar fechas
    const ahora = new Date();
    const fechaInicio =
      promocion.fechaInicio instanceof Date
        ? promocion.fechaInicio
        : new Date(promocion.fechaInicio);
    const fechaFin =
      promocion.fechaFin instanceof Date
        ? promocion.fechaFin
        : new Date(promocion.fechaFin);

    if (ahora < fechaInicio) {
      return {
        valido: false,
        mensaje: "Esta promoción aún no está disponible",
      };
    }

    if (ahora > fechaFin) {
      return {
        valido: false,
        mensaje: "Esta promoción ha expirado",
      };
    }

    // Verificar monto mínimo
    if (promocion.montoMinimo && montoCompra < promocion.montoMinimo) {
      return {
        valido: false,
        mensaje: `Compra mínima de $${promocion.montoMinimo.toFixed(
          2
        )} requerida`,
      };
    }

    // Verificar usos del usuario
    const usosRef = collection(db, "usos_promociones");
    const usosQuery = query(
      usosRef,
      where("promocionId", "==", promocion.id),
      where("estudianteId", "==", estudianteId)
    );
    const usosSnapshot = await getDocs(usosQuery);

    if (usosSnapshot.size >= promocion.usosPorUsuario) {
      return {
        valido: false,
        mensaje: "Ya has usado este código el máximo de veces permitido",
      };
    }

    // Verificar usos restantes totales
    if (
      promocion.usosRestantes !== undefined &&
      promocion.usosRestantes !== null &&
      promocion.usosRestantes <= 0
    ) {
      return {
        valido: false,
        mensaje: "Esta promoción ya no tiene usos disponibles",
      };
    }

    // Calcular descuento
    let descuento = 0;
    if (promocion.tipo === "porcentaje") {
      descuento = (montoCompra * promocion.valor) / 100;
    } else {
      descuento = promocion.valor;
    }

    // No puede ser mayor al monto de compra
    descuento = Math.min(descuento, montoCompra);

    return {
      valido: true,
      mensaje: `¡Descuento de $${descuento.toFixed(2)} aplicado!`,
      descuento,
      promocion,
    };
  } catch (error) {
    console.error("Error validando promoción:", error);
    return {
      valido: false,
      mensaje: "Error al validar el código promocional",
    };
  }
};

/**
 * Registrar uso de promoción
 */
export const registrarUsoPromocion = async (
  promocionId: string,
  estudianteId: string,
  pedidoId: string,
  descuentoAplicado: number
): Promise<void> => {
  try {
    // Crear registro de uso
    const usosRef = collection(db, "usos_promociones");
    await addDoc(usosRef, {
      promocionId,
      estudianteId,
      pedidoId,
      descuentoAplicado,
      createdAt: new Date(),
    });

    // Decrementar usos restantes si aplica
    const promocionRef = doc(db, "promociones", promocionId);
    const promocionDoc = await getDoc(promocionRef);

    if (promocionDoc.exists()) {
      const promocion = promocionDoc.data();
      if (
        promocion.usosRestantes !== undefined &&
        promocion.usosRestantes !== null
      ) {
        await updateDoc(promocionRef, {
          usosRestantes: increment(-1),
        });
      }
    }
  } catch (error) {
    console.error("Error registrando uso de promoción:", error);
    throw error;
  }
};

/**
 * Obtener promociones activas (para mostrar al usuario)
 */
export const getPromocionesActivas = async (): Promise<Promocion[]> => {
  try {
    const promocionesRef = collection(db, "promociones");
    const ahora = new Date();

    const q = query(
      promocionesRef,
      where("activo", "==", true),
      where("fechaFin", ">=", ahora)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Promocion[];
  } catch (error) {
    console.error("Error obteniendo promociones activas:", error);
    return [];
  }
};
