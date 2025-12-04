/**
 * Servicio de Pedidos para Estudiante
 * Maneja las operaciones de pedidos desde la perspectiva del estudiante
 */

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Pedido } from "@/lib/firebase/types";
import { timestampToDate } from "@/utils/formatters";

/**
 * Obtener pedidos del estudiante
 */
export const getPedidosByEstudiante = async (
  estudianteId: string
): Promise<Pedido[]> => {
  try {
    const pedidosRef = collection(db, "pedidos");
    const q = query(
      pedidosRef,
      where("estudianteId", "==", estudianteId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const pedidos: Pedido[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      pedidos.push({
        id: doc.id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
      } as Pedido);
    });

    return pedidos;
  } catch (error) {
    console.error("Error al obtener pedidos del estudiante:", error);
    throw new Error("No se pudieron cargar los pedidos");
  }
};

/**
 * Obtener información del vendedor para un pedido
 */
export const getVendedorInfo = async (vendedorId: string) => {
  try {
    const vendedorDoc = await getDoc(doc(db, "vendedores", vendedorId));

    if (vendedorDoc.exists()) {
      const data = vendedorDoc.data();
      return {
        nombre: data.nombre || "Vendedor",
        nombreNegocio: data.nombreNegocio || "Negocio",
        telefono: data.telefono || "No disponible",
      };
    }

    return {
      nombre: "Vendedor desconocido",
      nombreNegocio: "Negocio desconocido",
      telefono: "No disponible",
    };
  } catch (error) {
    console.error("Error al obtener información del vendedor:", error);
    return {
      nombre: "Vendedor",
      nombreNegocio: "Negocio",
      telefono: "No disponible",
    };
  }
};
