/**
 * Servicio de Vendedores
 * Maneja las operaciones relacionadas con vendedores
 */

import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Vendedor } from '@/lib/firebase/types';

/**
 * Obtener información de un vendedor por ID
 * Permite lectura pública según las reglas de Firestore
 */
export const getVendedor = async (vendedorId: string): Promise<Vendedor | null> => {
  try {
    const vendedorDoc = await getDoc(doc(db, 'vendedores', vendedorId));
    
    if (!vendedorDoc.exists()) {
      return null;
    }

    const data = vendedorDoc.data();
    
    return {
      uid: vendedorDoc.id,
      email: data.email || '',
      nombre: data.nombre || '',
      telefono: data.telefono,
      direccion: data.direccion,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  } catch (error: any) {
    console.error('Error obteniendo vendedor:', error);
    
    // Si es un error de permisos, retornar null en lugar de lanzar error
    if (error.code === 'permission-denied') {
      console.warn('Permisos insuficientes para leer vendedor');
      return null;
    }
    
    throw new Error('Error al cargar la información del vendedor.');
  }
};

/**
 * Obtener calificación promedio de un vendedor
 * Calcula el promedio de todas las calificaciones del vendedor
 */
export const getVendedorCalificacion = async (vendedorId: string): Promise<number> => {
  try {
    const calificacionesRef = collection(db, 'calificaciones');
    
    const q = query(
      calificacionesRef,
      where('vendedorId', '==', vendedorId)
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return 0; // Sin calificaciones aún
    }

    let sumaCalificaciones = 0;
    let totalCalificaciones = 0;

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const calificacion = data.calificacion || 0;
      if (calificacion > 0 && calificacion <= 5) {
        sumaCalificaciones += calificacion;
        totalCalificaciones++;
      }
    });

    if (totalCalificaciones === 0) {
      return 0;
    }

    return sumaCalificaciones / totalCalificaciones;
  } catch (error: any) {
    console.error('Error obteniendo calificación del vendedor:', error);
    return 0; // Retornar 0 si hay error
  }
};

/**
 * Obtener vendedor con calificación
 * Retorna el vendedor junto con su calificación promedio
 */
export const getVendedorConCalificacion = async (
  vendedorId: string
): Promise<(Vendedor & { calificacion: number }) | null> => {
  try {
    const vendedor = await getVendedor(vendedorId);
    
    if (!vendedor) {
      return null;
    }

    const calificacion = await getVendedorCalificacion(vendedorId);

    return {
      ...vendedor,
      calificacion,
    };
  } catch (error) {
    console.error('Error obteniendo vendedor con calificación:', error);
    return null;
  }
};

