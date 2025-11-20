/**
 * Servicio de Vendedores
 * Maneja todas las operaciones relacionadas con vendedores en Firestore
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Vendedor } from '@/lib/firebase/types';

const COLLECTION_NAME = 'vendedores';

/**
 * Obtener un vendedor por ID
 */
export const getVendedor = async (uid: string): Promise<Vendedor | null> => {
  try {
    const vendedorRef = doc(db, COLLECTION_NAME, uid);
    const vendedorSnap = await getDoc(vendedorRef);

    if (!vendedorSnap.exists()) {
      return null;
    }

    const data = vendedorSnap.data();
    return {
      uid,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Vendedor;
  } catch (error) {
    console.error('Error obteniendo vendedor:', error);
    throw new Error('Error al obtener la información del vendedor');
  }
};

/**
 * Crear o actualizar un vendedor
 */
export const saveVendedor = async (vendedor: Partial<Vendedor>): Promise<void> => {
  try {
    if (!vendedor.uid) {
      throw new Error('UID es requerido para guardar vendedor');
    }

    const vendedorRef = doc(db, COLLECTION_NAME, vendedor.uid);
    const vendedorActual = await getVendedor(vendedor.uid);

    const datosActualizar: any = {
      ...vendedor,
      updatedAt: Timestamp.now(),
    };

    if (!vendedorActual) {
      // Crear nuevo vendedor
      datosActualizar.createdAt = Timestamp.now();
      datosActualizar.estado = datosActualizar.estado || 'pendiente';
      datosActualizar.calificacion = 0;
      datosActualizar.totalCalificaciones = 0;
    }

    // Remover campos undefined
    Object.keys(datosActualizar).forEach(
      (key) => datosActualizar[key] === undefined && delete datosActualizar[key]
    );

    await setDoc(vendedorRef, datosActualizar, { merge: true });
  } catch (error) {
    console.error('Error guardando vendedor:', error);
    throw new Error('Error al guardar la información del vendedor');
  }
};

/**
 * Actualizar perfil de vendedor
 */
export const updateVendedor = async (
  uid: string,
  datos: Partial<Vendedor>
): Promise<void> => {
  try {
    const vendedorRef = doc(db, COLLECTION_NAME, uid);
    await updateDoc(vendedorRef, {
      ...datos,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error actualizando vendedor:', error);
    throw new Error('Error al actualizar la información del vendedor');
  }
};

/**
 * Obtener todos los vendedores activos
 */
export const getVendedoresActivos = async (): Promise<Vendedor[]> => {
  try {
    const vendedoresRef = collection(db, COLLECTION_NAME);
    const q = query(
      vendedoresRef,
      where('estado', '==', 'activo'),
      orderBy('calificacion', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Vendedor;
    });
  } catch (error) {
    console.error('Error obteniendo vendedores:', error);
    throw new Error('Error al obtener la lista de vendedores');
  }
};

/**
 * Obtener vendedores pendientes de aprobación (solo admin)
 */
export const getVendedoresPendientes = async (): Promise<Vendedor[]> => {
  try {
    const vendedoresRef = collection(db, COLLECTION_NAME);
    const q = query(vendedoresRef, where('estado', '==', 'pendiente'));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Vendedor;
    });
  } catch (error) {
    console.error('Error obteniendo vendedores pendientes:', error);
    throw new Error('Error al obtener vendedores pendientes');
  }
};

/**
 * Aprobar un vendedor (solo admin)
 */
export const aprobarVendedor = async (uid: string): Promise<void> => {
  try {
    await updateVendedor(uid, { estado: 'activo' });
  } catch (error) {
    console.error('Error aprobando vendedor:', error);
    throw new Error('Error al aprobar el vendedor');
  }
};

/**
 * Rechazar un vendedor (solo admin)
 */
export const rechazarVendedor = async (uid: string): Promise<void> => {
  try {
    await updateVendedor(uid, { estado: 'bloqueado' });
  } catch (error) {
    console.error('Error rechazando vendedor:', error);
    throw new Error('Error al rechazar el vendedor');
  }
};

