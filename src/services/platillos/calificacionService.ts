/**
 * Servicio de Calificaciones de Productos
 * Maneja las operaciones relacionadas con calificaciones y reseñas de platillos
 */

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export interface CalificacionProducto {
  id?: string;
  estudianteId: string;
  platilloId: string;
  vendedorId: string;
  calificacion: number; // 1-5
  comentario?: string;
  estudianteNombre?: string;
  createdAt?: Date;
}

/**
 * Obtener calificaciones de un producto
 */
export const getCalificacionesByPlatillo = async (
  platilloId: string
): Promise<CalificacionProducto[]> => {
  try {
    const calificacionesRef = collection(db, "calificaciones");
    
    // Intentar consulta con ordenamiento primero
    let querySnapshot;
    try {
      const q = query(
        calificacionesRef,
        where("platilloId", "==", platilloId),
        orderBy("createdAt", "desc")
      );
      querySnapshot = await getDocs(q);
    } catch (indexError: any) {
      // Si falla por falta de índice, usar consulta simple sin ordenamiento
      if (indexError.code === "failed-precondition") {
        console.log("Índice no disponible, usando consulta simple...");
        const qSimple = query(
          calificacionesRef,
          where("platilloId", "==", platilloId)
        );
        querySnapshot = await getDocs(qSimple);
      } else {
        throw indexError;
      }
    }

    const calificaciones: CalificacionProducto[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      calificaciones.push({
        id: doc.id,
        estudianteId: data.estudianteId,
        platilloId: data.platilloId,
        vendedorId: data.vendedorId,
        calificacion: data.calificacion || 0,
        comentario: data.comentario,
        estudianteNombre: data.estudianteNombre,
        createdAt: data.createdAt?.toDate(),
      });
    });

    // Ordenar manualmente si no se pudo usar orderBy
    calificaciones.sort((a, b) => {
      const dateA = a.createdAt?.getTime() || 0;
      const dateB = b.createdAt?.getTime() || 0;
      return dateB - dateA; // Más recientes primero
    });

    console.log(`✅ Calificaciones encontradas para platillo ${platilloId}:`, calificaciones.length);
    return calificaciones;
  } catch (error: any) {
    console.error("Error obteniendo calificaciones:", error);
    console.error("Detalles del error:", {
      code: error.code,
      message: error.message,
    });
    return [];
  }
};

/**
 * Calcular promedio de calificaciones de un producto
 */
export const getPromedioCalificacion = async (
  platilloId: string
): Promise<{ promedio: number; total: number }> => {
  try {
    const calificaciones = await getCalificacionesByPlatillo(platilloId);
    
    if (calificaciones.length === 0) {
      return { promedio: 0, total: 0 };
    }

    const suma = calificaciones.reduce(
      (acc, cal) => acc + cal.calificacion,
      0
    );
    const promedio = suma / calificaciones.length;

    return { promedio, total: calificaciones.length };
  } catch (error) {
    console.error("Error calculando promedio:", error);
    return { promedio: 0, total: 0 };
  }
};

/**
 * Obtener todas las calificaciones de un vendedor
 */
export const getCalificacionesByVendedor = async (
  vendedorId: string
): Promise<CalificacionProducto[]> => {
  try {
    const calificacionesRef = collection(db, "calificaciones");
    
    // Intentar consulta con ordenamiento primero
    let querySnapshot;
    try {
      const q = query(
        calificacionesRef,
        where("vendedorId", "==", vendedorId),
        orderBy("createdAt", "desc")
      );
      querySnapshot = await getDocs(q);
    } catch (indexError: any) {
      // Si falla por falta de índice, usar consulta simple sin ordenamiento
      if (indexError.code === "failed-precondition") {
        console.log("Índice no disponible, usando consulta simple...");
        const qSimple = query(
          calificacionesRef,
          where("vendedorId", "==", vendedorId)
        );
        querySnapshot = await getDocs(qSimple);
      } else {
        throw indexError;
      }
    }

    const calificaciones: CalificacionProducto[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      calificaciones.push({
        id: doc.id,
        estudianteId: data.estudianteId,
        platilloId: data.platilloId,
        vendedorId: data.vendedorId,
        calificacion: data.calificacion || 0,
        comentario: data.comentario,
        estudianteNombre: data.estudianteNombre,
        createdAt: data.createdAt?.toDate(),
      });
    });

    // Ordenar manualmente si no se pudo usar orderBy
    calificaciones.sort((a, b) => {
      const dateA = a.createdAt?.getTime() || 0;
      const dateB = b.createdAt?.getTime() || 0;
      return dateB - dateA; // Más recientes primero
    });

    console.log(`✅ Calificaciones encontradas para vendedor ${vendedorId}:`, calificaciones.length);
    return calificaciones;
  } catch (error: any) {
    console.error("Error obteniendo calificaciones del vendedor:", error);
    console.error("Detalles del error:", {
      code: error.code,
      message: error.message,
    });
    return [];
  }
};

/**
 * Calcular estadísticas de calificaciones de un vendedor
 */
export const getEstadisticasCalificacionesVendedor = async (
  vendedorId: string
): Promise<{
  promedioGeneral: number;
  totalResenas: number;
  distribucion: { [key: number]: number };
}> => {
  try {
    const calificaciones = await getCalificacionesByVendedor(vendedorId);
    
    if (calificaciones.length === 0) {
      return {
        promedioGeneral: 0,
        totalResenas: 0,
        distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const suma = calificaciones.reduce(
      (acc, cal) => acc + cal.calificacion,
      0
    );
    const promedioGeneral = suma / calificaciones.length;

    // Calcular distribución de calificaciones
    const distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    calificaciones.forEach((cal) => {
      if (cal.calificacion >= 1 && cal.calificacion <= 5) {
        distribucion[cal.calificacion as keyof typeof distribucion]++;
      }
    });

    return {
      promedioGeneral,
      totalResenas: calificaciones.length,
      distribucion,
    };
  } catch (error) {
    console.error("Error calculando estadísticas:", error);
    return {
      promedioGeneral: 0,
      totalResenas: 0,
      distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }
};

/**
 * Crear una nueva calificación/reseña de producto
 */
export const crearCalificacionProducto = async (
  calificacion: Omit<CalificacionProducto, "id" | "createdAt">
): Promise<string> => {
  try {
    console.log("📝 Creando calificación con datos:", calificacion);
    
    const calificacionesRef = collection(db, "calificaciones");
    
    const data = {
      estudianteId: calificacion.estudianteId,
      platilloId: calificacion.platilloId,
      vendedorId: calificacion.vendedorId,
      calificacion: calificacion.calificacion,
      comentario: calificacion.comentario || "",
      estudianteNombre: calificacion.estudianteNombre || "Usuario",
      createdAt: Timestamp.now(),
    };

    console.log("📤 Datos a guardar en Firestore:", data);

    const docRef = await addDoc(calificacionesRef, data);
    
    console.log("✅ Calificación creada exitosamente con ID:", docRef.id);
    
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error creando calificación:", error);
    console.error("Detalles del error:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`Error al crear la calificación: ${error.message || "Error desconocido"}`);
  }
};

