/**
 * Servicio de Estudiantes
 * Maneja todas las operaciones relacionadas con estudiantes en Firestore
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Estudiante } from '@/lib/firebase/types';

const COLLECTION_NAME = 'estudiantes';

/**
 * Obtener un estudiante por ID
 */
export const getEstudiante = async (uid: string): Promise<Estudiante | null> => {
  try {
    const estudianteRef = doc(db, COLLECTION_NAME, uid);
    const estudianteSnap = await getDoc(estudianteRef);

    if (!estudianteSnap.exists()) {
      return null;
    }

    const data = estudianteSnap.data();
    return {
      uid,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Estudiante;
  } catch (error) {
    console.error('Error obteniendo estudiante:', error);
    throw new Error('Error al obtener la información del estudiante');
  }
};

/**
 * Crear o actualizar un estudiante
 */
export const saveEstudiante = async (estudiante: Partial<Estudiante>): Promise<void> => {
  try {
    if (!estudiante.uid) {
      throw new Error('UID es requerido para guardar estudiante');
    }

    const estudianteRef = doc(db, COLLECTION_NAME, estudiante.uid);
    const estudianteActual = await getEstudiante(estudiante.uid);

    const datosActualizar: any = {
      ...estudiante,
      updatedAt: Timestamp.now(),
    };

    if (!estudianteActual) {
      // Crear nuevo estudiante
      datosActualizar.createdAt = Timestamp.now();
    }

    // Remover campos undefined
    Object.keys(datosActualizar).forEach(
      (key) => datosActualizar[key] === undefined && delete datosActualizar[key]
    );

    await setDoc(estudianteRef, datosActualizar, { merge: true });
  } catch (error) {
    console.error('Error guardando estudiante:', error);
    throw new Error('Error al guardar la información del estudiante');
  }
};

/**
 * Actualizar perfil de estudiante
 */
export const updateEstudiante = async (
  uid: string,
  datos: Partial<Estudiante>
): Promise<void> => {
  try {
    const estudianteRef = doc(db, COLLECTION_NAME, uid);
    await updateDoc(estudianteRef, {
      ...datos,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error actualizando estudiante:', error);
    throw new Error('Error al actualizar la información del estudiante');
  }
};

/**
 * Obtener todos los estudiantes (solo admin)
 */
export const getAllEstudiantes = async (): Promise<Estudiante[]> => {
  try {
    const estudiantesRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(estudiantesRef);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Estudiante;
    });
  } catch (error) {
    console.error('Error obteniendo estudiantes:', error);
    throw new Error('Error al obtener la lista de estudiantes');
  }
};

