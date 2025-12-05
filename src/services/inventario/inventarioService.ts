/**
 * Servicio de Inventario
 * Maneja las operaciones de inventario dinámico de los platillos
 */

import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

/**
 * Reducir inventario de un platillo
 * @param platilloId - ID del platillo
 * @param cantidad - Cantidad a reducir
 * @returns Cantidad disponible actualizada o null si no hay inventario suficiente
 */
export const reducirInventario = async (
  platilloId: string,
  cantidad: number = 1
): Promise<number | null> => {
  try {
    const platilloRef = doc(db, "platillos", platilloId);
    const platilloDoc = await getDoc(platilloRef);

    if (!platilloDoc.exists()) {
      throw new Error("Platillo no encontrado");
    }

    const platilloData = platilloDoc.data();
    const cantidadDisponible = platilloData.cantidadDisponible;

    // Si no tiene campo cantidadDisponible, no manejar inventario
    if (cantidadDisponible === undefined) {
      return null;
    }

    // Verificar si hay suficiente inventario
    if (cantidadDisponible < cantidad) {
      throw new Error(
        `No hay suficiente inventario. Disponibles: ${cantidadDisponible}`
      );
    }

    // Reducir inventario
    await updateDoc(platilloRef, {
      cantidadDisponible: increment(-cantidad),
    });

    return cantidadDisponible - cantidad;
  } catch (error) {
    console.error("Error reduciendo inventario:", error);
    throw error;
  }
};

/**
 * Incrementar inventario de un platillo
 * @param platilloId - ID del platillo
 * @param cantidad - Cantidad a incrementar
 * @returns Cantidad disponible actualizada o null si no maneja inventario
 */
export const incrementarInventario = async (
  platilloId: string,
  cantidad: number = 1
): Promise<number | null> => {
  try {
    const platilloRef = doc(db, "platillos", platilloId);
    const platilloDoc = await getDoc(platilloRef);

    if (!platilloDoc.exists()) {
      throw new Error("Platillo no encontrado");
    }

    const platilloData = platilloDoc.data();

    // Si no tiene campo cantidadDisponible, no manejar inventario
    if (platilloData.cantidadDisponible === undefined) {
      return null;
    }

    // Incrementar inventario
    await updateDoc(platilloRef, {
      cantidadDisponible: increment(cantidad),
    });

    return (platilloData.cantidadDisponible || 0) + cantidad;
  } catch (error) {
    console.error("Error incrementando inventario:", error);
    throw error;
  }
};

/**
 * Obtener la cantidad disponible actual de un platillo
 * @param platilloId - ID del platillo
 * @returns Cantidad disponible o null si no maneja inventario
 */
export const obtenerCantidadDisponible = async (
  platilloId: string
): Promise<number | null> => {
  try {
    const platilloRef = doc(db, "platillos", platilloId);
    const platilloDoc = await getDoc(platilloRef);

    if (!platilloDoc.exists()) {
      throw new Error("Platillo no encontrado");
    }

    const platilloData = platilloDoc.data();
    return platilloData.cantidadDisponible ?? null;
  } catch (error) {
    console.error("Error obteniendo cantidad disponible:", error);
    throw error;
  }
};

/**
 * Verificar si un platillo tiene inventario disponible
 * @param platilloId - ID del platillo
 * @param cantidadRequerida - Cantidad que se necesita
 * @returns true si hay suficiente inventario, false si no
 */
export const verificarInventarioDisponible = async (
  platilloId: string,
  cantidadRequerida: number = 1
): Promise<boolean> => {
  try {
    const cantidadDisponible = await obtenerCantidadDisponible(platilloId);

    // Si no maneja inventario, siempre está disponible
    if (cantidadDisponible === null) {
      return true;
    }

    return cantidadDisponible >= cantidadRequerida;
  } catch (error) {
    console.error("Error verificando inventario disponible:", error);
    return false;
  }
};

