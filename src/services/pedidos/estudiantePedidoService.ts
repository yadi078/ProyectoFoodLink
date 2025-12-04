/**
 * Servicio de Pedidos para Estudiante
 * Maneja las operaciones de pedidos desde la perspectiva del estudiante
 */

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Pedido } from "@/lib/firebase/types";

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
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
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
    const vendedorDoc = await getDocs(
      query(collection(db, "vendedores"), where("__name__", "==", vendedorId))
    );

    if (!vendedorDoc.empty) {
      const data = vendedorDoc.docs[0].data();
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

