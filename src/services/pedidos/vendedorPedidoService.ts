/**
 * Servicio de Pedidos para Vendedor
 * Maneja las operaciones de pedidos desde la perspectiva del vendedor
 */

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Pedido } from "@/lib/firebase/types";
import { timestampToDate } from "@/utils/formatters";

/**
 * Obtener pedidos del vendedor
 */
export const getPedidosByVendedor = async (
  vendedorId: string,
  estado?: Pedido["estado"]
): Promise<Pedido[]> => {
  try {
    const pedidosRef = collection(db, "pedidos");
    let q;

    if (estado) {
      // Filtrar por vendedor y estado
      q = query(
        pedidosRef,
        where("vendedorId", "==", vendedorId),
        where("estado", "==", estado)
      );
    } else {
      // Solo filtrar por vendedor
      q = query(pedidosRef, where("vendedorId", "==", vendedorId));
    }

    const querySnapshot = await getDocs(q);
    const pedidos: Pedido[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      pedidos.push({
        id: doc.id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
        fechaEntrega: data.fechaEntrega
          ? timestampToDate(data.fechaEntrega)
          : undefined,
      } as Pedido);
    });

    // Ordenar en el cliente por fecha de creación (más reciente primero)
    pedidos.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return pedidos;
  } catch (error) {
    console.error("Error al obtener pedidos del vendedor:", error);
    throw new Error("No se pudieron cargar los pedidos");
  }
};

/**
 * Actualizar el estado de un pedido
 */
export const updateEstadoPedido = async (
  pedidoId: string,
  nuevoEstado: Pedido["estado"],
  motivoCancelacion?: string
): Promise<void> => {
  try {
    const pedidoRef = doc(db, "pedidos", pedidoId);

    const updateData: any = {
      estado: nuevoEstado,
      updatedAt: serverTimestamp(),
    };

    // Si el estado es cancelado, agregar el motivo
    if (nuevoEstado === "cancelado" && motivoCancelacion) {
      updateData.motivoCancelacion = motivoCancelacion;
    }

    await updateDoc(pedidoRef, updateData);
  } catch (error) {
    console.error("Error al actualizar estado del pedido:", error);
    throw new Error("No se pudo actualizar el estado del pedido");
  }
};

/**
 * Obtener estadísticas del vendedor
 */
export interface EstadisticasVendedor {
  pedidosHoy: number;
  ingresosHoy: number;
  pedidosPendientes: number;
  totalPedidos: number;
  pedidosPorEstado: {
    pendiente: number;
    en_camino: number;
    entregado: number;
    cancelado: number;
  };
}

export const getEstadisticasVendedor = async (
  vendedorId: string
): Promise<EstadisticasVendedor> => {
  try {
    const pedidos = await getPedidosByVendedor(vendedorId);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const pedidosHoy = pedidos.filter((p) => {
      const fechaPedido = new Date(p.createdAt);
      fechaPedido.setHours(0, 0, 0, 0);
      return fechaPedido.getTime() === hoy.getTime();
    });

    const ingresosHoy = pedidosHoy
      .filter((p) => p.estado !== "cancelado")
      .reduce((total, p) => total + p.precioTotal, 0);

    const pedidosPendientes = pedidos.filter(
      (p) => p.estado === "pendiente" || p.estado === "en_camino"
    ).length;

    const pedidosPorEstado = {
      pendiente: pedidos.filter((p) => p.estado === "pendiente").length,
      en_camino: pedidos.filter((p) => p.estado === "en_camino").length,
      entregado: pedidos.filter((p) => p.estado === "entregado").length,
      cancelado: pedidos.filter((p) => p.estado === "cancelado").length,
    };

    return {
      pedidosHoy: pedidosHoy.length,
      ingresosHoy,
      pedidosPendientes,
      totalPedidos: pedidos.length,
      pedidosPorEstado,
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return {
      pedidosHoy: 0,
      ingresosHoy: 0,
      pedidosPendientes: 0,
      totalPedidos: 0,
      pedidosPorEstado: {
        pendiente: 0,
        en_camino: 0,
        entregado: 0,
        cancelado: 0,
      },
    };
  }
};

/**
 * Obtener información del estudiante para un pedido
 */
export const getEstudianteInfo = async (estudianteId: string) => {
  try {
    // Primero buscar en vendedores
    let userDoc = await getDoc(doc(db, "vendedores", estudianteId));

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        nombre: data.nombre || "Usuario",
        telefono: data.telefono || "No disponible",
      };
    }

    // Si no existe en vendedores, buscar en estudiantes
    userDoc = await getDoc(doc(db, "estudiantes", estudianteId));

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        nombre: data.nombre || "Usuario",
        telefono: data.telefono || "No disponible",
      };
    }

    return {
      nombre: "Usuario desconocido",
      telefono: "No disponible",
    };
  } catch (error) {
    console.error("Error al obtener información del estudiante:", error);
    return {
      nombre: "Usuario",
      telefono: "No disponible",
    };
  }
};
