/**
 * Servicio de Calificación de Vendedores
 * Maneja las calificaciones del servicio de los vendedores
 */

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { CalificacionVendedor } from "@/lib/firebase/types";

/**
 * Crear calificación de vendedor
 */
export const crearCalificacionVendedor = async (data: {
  vendedorId: string;
  estudianteId: string;
  pedidoId: string;
  calificacion: number;
  comentario?: string;
  estudianteNombre: string;
}): Promise<string> => {
  try {
    // Verificar que no haya calificado ya este pedido
    const calificacionesRef = collection(db, "calificaciones_vendedores");
    const q = query(
      calificacionesRef,
      where("pedidoId", "==", data.pedidoId),
      where("estudianteId", "==", data.estudianteId)
    );
    const existentes = await getDocs(q);

    if (!existentes.empty) {
      throw new Error("Ya has calificado este pedido");
    }

    // Crear la calificación
    const calificacionData = {
      ...data,
      createdAt: new Date(),
    };

    const docRef = await addDoc(calificacionesRef, calificacionData);

    // Marcar el pedido como calificado
    const pedidoRef = doc(db, "pedidos", data.pedidoId);
    await updateDoc(pedidoRef, {
      vendedorCalificado: true,
    });

    // Actualizar promedio del vendedor
    await actualizarPromedioVendedor(data.vendedorId);

    return docRef.id;
  } catch (error) {
    console.error("Error creando calificación de vendedor:", error);
    throw error;
  }
};

/**
 * Actualizar el promedio de calificaciones del vendedor
 */
const actualizarPromedioVendedor = async (vendedorId: string): Promise<void> => {
  try {
    const calificacionesRef = collection(db, "calificaciones_vendedores");
    const q = query(calificacionesRef, where("vendedorId", "==", vendedorId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return;
    }

    let suma = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      suma += data.calificacion;
    });

    const promedio = suma / snapshot.size;

    // Actualizar el vendedor
    const vendedorRef = doc(db, "vendedores", vendedorId);
    await updateDoc(vendedorRef, {
      calificacionPromedio: promedio,
      totalCalificaciones: snapshot.size,
    });
  } catch (error) {
    console.error("Error actualizando promedio de vendedor:", error);
  }
};

/**
 * Obtener calificaciones de un vendedor
 */
export const getCalificacionesVendedor = async (
  vendedorId: string
): Promise<CalificacionVendedor[]> => {
  try {
    const calificacionesRef = collection(db, "calificaciones_vendedores");
    const q = query(
      calificacionesRef,
      where("vendedorId", "==", vendedorId)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CalificacionVendedor[];
  } catch (error) {
    console.error("Error obteniendo calificaciones de vendedor:", error);
    return [];
  }
};

/**
 * Verificar si un pedido ya fue calificado
 */
export const pedidoYaCalificado = async (
  pedidoId: string,
  estudianteId: string
): Promise<boolean> => {
  try {
    const calificacionesRef = collection(db, "calificaciones_vendedores");
    const q = query(
      calificacionesRef,
      where("pedidoId", "==", pedidoId),
      where("estudianteId", "==", estudianteId)
    );
    const snapshot = await getDocs(q);

    return !snapshot.empty;
  } catch (error) {
    console.error("Error verificando calificación:", error);
    return false;
  }
};

/**
 * Obtener promedio de calificaciones de un vendedor
 */
export const getPromedioVendedor = async (
  vendedorId: string
): Promise<{ promedio: number; total: number }> => {
  try {
    const vendedorRef = doc(db, "vendedores", vendedorId);
    const vendedorDoc = await getDoc(vendedorRef);

    if (!vendedorDoc.exists()) {
      return { promedio: 0, total: 0 };
    }

    const data = vendedorDoc.data();
    return {
      promedio: data.calificacionPromedio || 0,
      total: data.totalCalificaciones || 0,
    };
  } catch (error) {
    console.error("Error obteniendo promedio de vendedor:", error);
    return { promedio: 0, total: 0 };
  }
};

