/**
 * Servicio de Platillos
 * Maneja las operaciones CRUD para platillos de vendedores
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
  deleteDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
import type { Platillo, CategoriaPlatillo } from "@/lib/firebase/types";

/**
 * Subir imagen de producto a Firebase Storage
 */
export async function uploadProductImage(file: File): Promise<string> {
  try {
    const imageRef = ref(storage, `products/${Date.now()}-${file.name}`);
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error: any) {
    console.error("Error subiendo imagen:", error);
    throw new Error("Error al subir la imagen");
  }
}

/**
 * Helper para limpiar campos opcionales antes de guardar en Firebase
 */
const cleanOptionalField = <T>(
  value: T | undefined | null,
  validator?: (val: T) => boolean
): T | null => {
  if (value === undefined || value === null) return null;
  if (validator && !validator(value)) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  return value;
};

/**
 * Obtener todos los platillos de un vendedor
 */
export const getPlatillosByVendedor = async (
  vendedorId: string
): Promise<Platillo[]> => {
  try {
    const platillosRef = collection(db, "platillos");
    
    // Intentar consulta con ordenamiento primero
    let querySnapshot;
    try {
      const q = query(
        platillosRef,
        where("vendedorId", "==", vendedorId),
        orderBy("createdAt", "desc")
      );
      querySnapshot = await getDocs(q);
    } catch (indexError: any) {
      // Si falta el índice, usar consulta simple sin ordenamiento
      if (indexError.code === "failed-precondition") {
        // Silenciar el warning - esto es normal si el índice aún no está creado
        const qSimple = query(
          platillosRef,
          where("vendedorId", "==", vendedorId)
        );
        querySnapshot = await getDocs(qSimple);
      } else {
        throw indexError;
      }
    }

    const platillos: Platillo[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      platillos.push({
        id: doc.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        disponible: data.disponible ?? true,
        vendedorId: data.vendedorId,
        imagen: data.imagen,
        categoria: data.categoria || "Comida casera", // Valor por defecto
        cantidadDisponible: data.cantidadDisponible,
        notasAdicionales: data.notasAdicionales,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });

    // Ordenar manualmente si no se pudo usar orderBy
    platillos.sort((a, b) => {
      const dateA = a.createdAt?.getTime() || 0;
      const dateB = b.createdAt?.getTime() || 0;
      return dateB - dateA; // Más recientes primero
    });

    return platillos;
  } catch (error: any) {
    console.error("Error obteniendo platillos:", error);
    throw new Error("Error al cargar los platillos");
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
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      disponible: data.disponible ?? true,
      vendedorId: data.vendedorId,
      imagen: data.imagen,
      categoria: data.categoria,
      cantidadDisponible: data.cantidadDisponible,
      notasAdicionales: data.notasAdicionales,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  } catch (error: any) {
    console.error("Error obteniendo platillo:", error);
    throw new Error("Error al cargar el platillo");
  }
};

/**
 * Crear un nuevo platillo
 */
export const createPlatillo = async (
  platilloData: Omit<Platillo, "id" | "createdAt" | "updatedAt">,
  imageFile?: File
): Promise<string> => {
  try {
    const platillosRef = collection(db, "platillos");
    
    // Subir imagen si se proporciona un archivo
    let imageUrl = platilloData.imagen;
    if (imageFile) {
      imageUrl = await uploadProductImage(imageFile);
    }
    
    // Filtrar campos undefined para evitar errores en Firebase
    const cleanData: any = {
      nombre: platilloData.nombre,
      descripcion: platilloData.descripcion,
      precio: platilloData.precio,
      disponible: platilloData.disponible,
      vendedorId: platilloData.vendedorId,
      categoria: platilloData.categoria,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Agregar campos opcionales solo si tienen valor válido
    const imagen = cleanOptionalField(imageUrl, (url) => url.trim() !== "");
    if (imagen) cleanData.imagen = imagen.trim();

    const cantidad = cleanOptionalField(
      platilloData.cantidadDisponible,
      (val) => !isNaN(val)
    );
    if (cantidad !== null) cleanData.cantidadDisponible = cantidad;

    const notas = cleanOptionalField(platilloData.notasAdicionales);
    if (notas) cleanData.notasAdicionales = notas.trim();

    const docRef = await addDoc(platillosRef, cleanData);
    return docRef.id;
  } catch (error: any) {
    console.error("Error creando platillo:", error);
    throw new Error("Error al crear el platillo");
  }
};

/**
 * Actualizar un platillo existente
 */
export const updatePlatillo = async (
  platilloId: string,
  platilloData: Partial<Omit<Platillo, "id" | "vendedorId" | "createdAt">>,
  imageFile?: File
): Promise<void> => {
  try {
    const platilloRef = doc(db, "platillos", platilloId);
    
    // Subir imagen si se proporciona un archivo
    let imageUrl = platilloData.imagen;
    if (imageFile) {
      imageUrl = await uploadProductImage(imageFile);
    }
    
    // Filtrar campos undefined para evitar errores en Firebase
    const updateData: any = {
      updatedAt: Timestamp.now(),
    };

    // Agregar campos solo si están definidos
    if (platilloData.nombre !== undefined) updateData.nombre = platilloData.nombre;
    if (platilloData.descripcion !== undefined) updateData.descripcion = platilloData.descripcion;
    if (platilloData.precio !== undefined) updateData.precio = platilloData.precio;
    if (platilloData.disponible !== undefined) updateData.disponible = platilloData.disponible;
    if (platilloData.categoria !== undefined) updateData.categoria = platilloData.categoria;

    // Manejar imagen: priorizar nueva imagen subida, luego imagen del formulario
    const finalImageUrl = imageUrl !== undefined ? imageUrl : platilloData.imagen;
    if (finalImageUrl !== undefined) {
      updateData.imagen = cleanOptionalField(finalImageUrl, (url) => url.trim() !== "");
    }

    // Campos opcionales
    if (platilloData.cantidadDisponible !== undefined) {
      updateData.cantidadDisponible = cleanOptionalField(
        platilloData.cantidadDisponible,
        (val) => !isNaN(val)
      );
    }
    if (platilloData.notasAdicionales !== undefined) {
      updateData.notasAdicionales = cleanOptionalField(platilloData.notasAdicionales);
    }

    await updateDoc(platilloRef, updateData);
  } catch (error: any) {
    console.error("Error actualizando platillo:", error);
    throw new Error("Error al actualizar el platillo");
  }
};

/**
 * Eliminar un platillo
 */
export const deletePlatillo = async (platilloId: string): Promise<void> => {
  try {
    const platilloRef = doc(db, "platillos", platilloId);
    await deleteDoc(platilloRef);
  } catch (error: any) {
    console.error("Error eliminando platillo:", error);
    throw new Error("Error al eliminar el platillo");
  }
};

