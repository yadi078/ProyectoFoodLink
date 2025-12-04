/**
 * Servicio de Menús
 * Maneja las operaciones relacionadas con platillos y menús
 */

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Platillo } from "@/lib/firebase/types";

/**
 * Obtener todos los platillos disponibles
 * Permite lectura pública según las reglas de Firestore
 */
export const getPlatillosDisponibles = async (): Promise<Platillo[]> => {
  try {
    // Verificar que db esté inicializado
    if (!db) {
      console.error("❌ Firestore no está inicializado");
      return [];
    }

    const platillosRef = collection(db, "platillos");

    // Consulta simplificada sin orderBy para evitar índices compuestos
    // El ordenamiento se hará en el cliente
    const q = query(platillosRef, where("disponible", "==", true));
    const querySnapshot = await getDocs(q);

    const platillos: Platillo[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();

      // Filtrar manualmente si obtuvimos todos los platillos
      // Considerar disponible si no está explícitamente en false
      const disponible = data.disponible !== false;

      if (disponible) {
        platillos.push({
          id: docSnapshot.id,
          nombre: data.nombre || "Sin nombre",
          descripcion: data.descripcion || "",
          precio: data.precio || 0,
          disponible: data.disponible ?? true,
          vendedorId: data.vendedorId || "",
          imagen: data.imagen,
          categoria: data.categoria || data.tipo || "Comida casera", // Compatibilidad con datos antiguos
          cantidadDisponible: data.cantidadDisponible,
          notasAdicionales: data.notasAdicionales,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      }
    });

    // Ordenar en el cliente por fecha de creación (más recientes primero)
    platillos.sort((a, b) => {
      const dateA = a.createdAt?.getTime() || 0;
      const dateB = b.createdAt?.getTime() || 0;
      return dateB - dateA; // Más recientes primero
    });

    return platillos;
  } catch (error: any) {
    console.error("❌ Error obteniendo platillos:", error);
    console.error("Código de error:", error.code);
    console.error("Mensaje de error:", error.message);
    console.error("Stack:", error.stack);

    // Si es un error de permisos, retornar array vacío
    if (error.code === "permission-denied") {
      console.warn("⚠️ Permisos insuficientes para leer platillos");
      console.warn("Verifica las reglas de Firestore en Firebase Console");
      return [];
    }

    // Si es un error de índice faltante, retornar array vacío
    if (error.code === "failed-precondition") {
      console.warn("⚠️ Índice faltante en Firestore");
      console.warn(
        "Firebase debería mostrar un enlace para crear el índice automáticamente"
      );
      return [];
    }

    // Para cualquier otro error, retornar array vacío en lugar de lanzar error
    console.warn("⚠️ Retornando array vacío debido a error");
    return [];
  }
};

/**
 * Obtener un platillo por ID
 */
export const getPlatilloById = async (
  platilloId: string
): Promise<Platillo | null> => {
  try {
    const platilloDoc = await getDoc(doc(db, "platillos", platilloId));

    if (!platilloDoc.exists()) {
      return null;
    }

    const data = platilloDoc.data();
    return {
      id: platilloDoc.id,
      nombre: data.nombre || "",
      descripcion: data.descripcion || "",
      precio: data.precio || 0,
      disponible: data.disponible ?? true,
      vendedorId: data.vendedorId || "",
      imagen: data.imagen,
      categoria: data.categoria || "Comida casera",
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  } catch (error: any) {
    console.error("Error obteniendo platillo:", error);
    throw new Error(
      "Error al cargar el platillo. Por favor, intenta de nuevo."
    );
  }
};

