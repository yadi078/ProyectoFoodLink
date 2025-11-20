/**
 * Servicio de Menús/Platillos
 * Maneja todas las operaciones relacionadas con platillos en Firestore
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Platillo } from '@/lib/firebase/types';

const COLLECTION_NAME = 'platillos';

/**
 * Obtener un platillo por ID
 */
export const getPlatillo = async (id: string): Promise<Platillo | null> => {
  try {
    const platilloRef = doc(db, COLLECTION_NAME, id);
    const platilloSnap = await getDoc(platilloRef);

    if (!platilloSnap.exists()) {
      return null;
    }

    const data = platilloSnap.data();
    return {
      id: platilloSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Platillo;
  } catch (error) {
    console.error('Error obteniendo platillo:', error);
    throw new Error('Error al obtener el platillo');
  }
};

/**
 * Obtener todos los platillos de un vendedor
 */
export const getPlatillosPorVendedor = async (vendedorId: string): Promise<Platillo[]> => {
  try {
    const platillosRef = collection(db, COLLECTION_NAME);
    const q = query(
      platillosRef,
      where('vendedorId', '==', vendedorId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Platillo;
    });
  } catch (error) {
    console.error('Error obteniendo platillos:', error);
    throw new Error('Error al obtener los platillos');
  }
};

/**
 * Obtener todos los platillos disponibles
 */
export const getPlatillosDisponibles = async (): Promise<Platillo[]> => {
  try {
    const platillosRef = collection(db, COLLECTION_NAME);
    const q = query(
      platillosRef,
      where('disponible', '==', true),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Platillo;
    });
  } catch (error) {
    console.error('Error obteniendo platillos disponibles:', error);
    throw new Error('Error al obtener los platillos disponibles');
  }
};

/**
 * Crear un nuevo platillo
 */
export const crearPlatillo = async (platillo: Omit<Platillo, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const platillosRef = collection(db, COLLECTION_NAME);
    const nuevoPlatillo = {
      ...platillo,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(platillosRef, nuevoPlatillo);
    return docRef.id;
  } catch (error) {
    console.error('Error creando platillo:', error);
    throw new Error('Error al crear el platillo');
  }
};

/**
 * Actualizar un platillo
 */
export const updatePlatillo = async (
  id: string,
  datos: Partial<Platillo>
): Promise<void> => {
  try {
    const platilloRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(platilloRef, {
      ...datos,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error actualizando platillo:', error);
    throw new Error('Error al actualizar el platillo');
  }
};

/**
 * Eliminar un platillo
 */
export const eliminarPlatillo = async (id: string): Promise<void> => {
  try {
    const platilloRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(platilloRef);
  } catch (error) {
    console.error('Error eliminando platillo:', error);
    throw new Error('Error al eliminar el platillo');
  }
};

/**
 * Cambiar disponibilidad de un platillo
 */
export const toggleDisponibilidad = async (id: string, disponible: boolean): Promise<void> => {
  try {
    await updatePlatillo(id, { disponible });
  } catch (error) {
    console.error('Error cambiando disponibilidad:', error);
    throw new Error('Error al cambiar la disponibilidad del platillo');
  }
};

