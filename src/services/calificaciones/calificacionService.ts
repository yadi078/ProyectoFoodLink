/**
 * Servicio de Calificaciones
 * Maneja todas las operaciones relacionadas con calificaciones en Firestore
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Calificacion } from '@/lib/firebase/types';
import { getVendedor, updateVendedor } from '../vendedores/vendedorService';

const COLLECTION_NAME = 'calificaciones';

/**
 * Crear una nueva calificación
 */
export const crearCalificacion = async (
  calificacion: Omit<Calificacion, 'id' | 'fecha' | 'createdAt'>
): Promise<string> => {
  try {
    const calificacionesRef = collection(db, COLLECTION_NAME);
    const nuevaCalificacion = {
      ...calificacion,
      fecha: Timestamp.now(),
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(calificacionesRef, nuevaCalificacion);

    // Actualizar calificación promedio del vendedor
    await actualizarCalificacionVendedor(calificacion.vendedorId);

    return docRef.id;
  } catch (error) {
    console.error('Error creando calificación:', error);
    throw new Error('Error al crear la calificación');
  }
};

/**
 * Obtener calificaciones de un vendedor
 */
export const getCalificacionesPorVendedor = async (vendedorId: string): Promise<Calificacion[]> => {
  try {
    const calificacionesRef = collection(db, COLLECTION_NAME);
    const q = query(
      calificacionesRef,
      where('vendedorId', '==', vendedorId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        fecha: data.fecha?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Calificacion;
    });
  } catch (error) {
    console.error('Error obteniendo calificaciones:', error);
    throw new Error('Error al obtener las calificaciones');
  }
};

/**
 * Obtener calificaciones de un estudiante
 */
export const getCalificacionesPorEstudiante = async (estudianteId: string): Promise<Calificacion[]> => {
  try {
    const calificacionesRef = collection(db, COLLECTION_NAME);
    const q = query(
      calificacionesRef,
      where('estudianteId', '==', estudianteId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        fecha: data.fecha?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Calificacion;
    });
  } catch (error) {
    console.error('Error obteniendo calificaciones:', error);
    throw new Error('Error al obtener las calificaciones');
  }
};

/**
 * Eliminar una calificación
 */
export const eliminarCalificacion = async (id: string, vendedorId: string): Promise<void> => {
  try {
    const calificacionRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(calificacionRef);

    // Actualizar calificación promedio del vendedor
    await actualizarCalificacionVendedor(vendedorId);
  } catch (error) {
    console.error('Error eliminando calificación:', error);
    throw new Error('Error al eliminar la calificación');
  }
};

/**
 * Actualizar calificación promedio del vendedor
 */
const actualizarCalificacionVendedor = async (vendedorId: string): Promise<void> => {
  try {
    const calificaciones = await getCalificacionesPorVendedor(vendedorId);

    if (calificaciones.length === 0) {
      await updateVendedor(vendedorId, {
        calificacion: 0,
        totalCalificaciones: 0,
      });
      return;
    }

    const suma = calificaciones.reduce((acc, cal) => acc + cal.calificacion, 0);
    const promedio = suma / calificaciones.length;

    await updateVendedor(vendedorId, {
      calificacion: Math.round(promedio * 10) / 10, // Redondear a 1 decimal
      totalCalificaciones: calificaciones.length,
    });
  } catch (error) {
    console.error('Error actualizando calificación del vendedor:', error);
  }
};

