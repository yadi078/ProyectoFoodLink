/**
 * Servicio de Reportes
 * Maneja todas las operaciones relacionadas con reportes en Firestore
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
  orderBy,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Reporte } from '@/lib/firebase/types';

const COLLECTION_NAME = 'reportes';

/**
 * Crear un nuevo reporte
 */
export const crearReporte = async (
  reporte: Omit<Reporte, 'id' | 'fecha' | 'createdAt'>
): Promise<string> => {
  try {
    const reportesRef = collection(db, COLLECTION_NAME);
    const nuevoReporte = {
      ...reporte,
      fecha: Timestamp.now(),
      estado: 'pendiente' as const,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(reportesRef, nuevoReporte);
    return docRef.id;
  } catch (error) {
    console.error('Error creando reporte:', error);
    throw new Error('Error al crear el reporte');
  }
};

/**
 * Obtener todos los reportes
 */
export const getAllReportes = async (): Promise<Reporte[]> => {
  try {
    const reportesRef = collection(db, COLLECTION_NAME);
    const q = query(reportesRef, orderBy('createdAt', 'desc'), limit(100));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        fecha: data.fecha?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Reporte;
    });
  } catch (error) {
    console.error('Error obteniendo reportes:', error);
    throw new Error('Error al obtener los reportes');
  }
};

/**
 * Obtener reportes por estado
 */
export const getReportesPorEstado = async (estado: Reporte['estado']): Promise<Reporte[]> => {
  try {
    const reportesRef = collection(db, COLLECTION_NAME);
    const q = query(
      reportesRef,
      where('estado', '==', estado),
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
      } as Reporte;
    });
  } catch (error) {
    console.error('Error obteniendo reportes:', error);
    throw new Error('Error al obtener los reportes');
  }
};

/**
 * Obtener reportes por tipo
 */
export const getReportesPorTipo = async (tipo: Reporte['tipo']): Promise<Reporte[]> => {
  try {
    const reportesRef = collection(db, COLLECTION_NAME);
    const q = query(
      reportesRef,
      where('tipo', '==', tipo),
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
      } as Reporte;
    });
  } catch (error) {
    console.error('Error obteniendo reportes:', error);
    throw new Error('Error al obtener los reportes');
  }
};

/**
 * Actualizar estado de un reporte
 */
export const actualizarEstadoReporte = async (
  id: string,
  estado: Reporte['estado']
): Promise<void> => {
  try {
    const reporteRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(reporteRef, {
      estado,
    });
  } catch (error) {
    console.error('Error actualizando reporte:', error);
    throw new Error('Error al actualizar el estado del reporte');
  }
};

/**
 * Obtener un reporte por ID
 */
export const getReporte = async (id: string): Promise<Reporte | null> => {
  try {
    const reporteRef = doc(db, COLLECTION_NAME, id);
    const reporteSnap = await getDoc(reporteRef);

    if (!reporteSnap.exists()) {
      return null;
    }

    const data = reporteSnap.data();
    return {
      id: reporteSnap.id,
      ...data,
      fecha: data.fecha?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Reporte;
  } catch (error) {
    console.error('Error obteniendo reporte:', error);
    throw new Error('Error al obtener el reporte');
  }
};

