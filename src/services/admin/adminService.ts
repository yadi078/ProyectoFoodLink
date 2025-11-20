/**
 * Servicio de Administración
 * Maneja operaciones administrativas del sistema
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Vendedor, Estudiante, Reporte, Pedido } from '@/lib/firebase/types';
import { getVendedor, aprobarVendedor as aprobarVendedorService, rechazarVendedor as rechazarVendedorService, getVendedoresPendientes as getVendedoresPendientesService } from '../vendedores/vendedorService';
import { getEstudiante } from '../estudiantes/estudianteService';
import { getAllReportes as getAllReportesService, actualizarEstadoReporte as actualizarEstadoReporteService } from '../reportes/reporteService';

const COLLECTION_NAME_ADMINS = 'admins';

/**
 * Verificar si un usuario es admin
 */
export const esAdmin = async (uid: string): Promise<boolean> => {
  try {
    const adminDoc = await getDoc(doc(db, COLLECTION_NAME_ADMINS, uid));
    return adminDoc.exists();
  } catch (error) {
    console.error('Error verificando admin:', error);
    return false;
  }
};

/**
 * Obtener todos los usuarios (Estudiantes y Vendedores)
 */
export const getAllUsuarios = async (): Promise<(Estudiante | Vendedor)[]> => {
  try {
    const [estudiantes, vendedores] = await Promise.all([
      getDocs(collection(db, 'estudiantes')),
      getDocs(collection(db, 'vendedores')),
    ]);

    const usuarios: (Estudiante | Vendedor)[] = [];

    estudiantes.docs.forEach((docSnap) => {
      const data = docSnap.data();
      usuarios.push({
        uid: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Estudiante);
    });

    vendedores.docs.forEach((docSnap) => {
      const data = docSnap.data();
      usuarios.push({
        uid: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Vendedor);
    });

    return usuarios;
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw new Error('Error al obtener la lista de usuarios');
  }
};

/**
 * Bloquear/Desbloquear un usuario
 */
export const toggleUsuarioEstado = async (
  uid: string,
  rol: 'estudiante' | 'vendedor',
  estado: 'activo' | 'bloqueado'
): Promise<void> => {
  try {
    if (rol === 'vendedor') {
      const vendedor = await getVendedor(uid);
      if (vendedor) {
        const nuevoEstado = estado === 'activo' ? 'activo' : 'bloqueado';
        await updateDoc(doc(db, 'vendedores', uid), {
          estado: nuevoEstado,
          updatedAt: Timestamp.now(),
        });
      }
    } else {
      // Para estudiantes, podrías agregar un campo de estado si es necesario
      // Por ahora, no implementamos bloqueo de estudiantes
      throw new Error('Operación no disponible para estudiantes');
    }
  } catch (error) {
    console.error('Error cambiando estado de usuario:', error);
    throw new Error('Error al cambiar el estado del usuario');
  }
};

/**
 * Obtener estadísticas generales del sistema
 */
export interface EstadisticasSistema {
  totalUsuarios: number;
  totalEstudiantes: number;
  totalVendedores: number;
  totalPedidos: number;
  ingresosTotales: number;
}

export const getEstadisticasSistema = async (): Promise<EstadisticasSistema> => {
  try {
    // TODO: Implementar consultas optimizadas con agregaciones
    // Por ahora, retornamos datos de ejemplo que se deben reemplazar con consultas reales
    return {
      totalUsuarios: 0,
      totalEstudiantes: 0,
      totalVendedores: 0,
      totalPedidos: 0,
      ingresosTotales: 0,
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw new Error('Error al obtener las estadísticas del sistema');
  }
};

// Re-exportar funciones de otros servicios para uso en admin
export const getVendedoresPendientes = getVendedoresPendientesService;
export const aprobarVendedor = aprobarVendedorService;
export const rechazarVendedor = rechazarVendedorService;
export const getAllReportes = getAllReportesService;
export const actualizarEstadoReporte = actualizarEstadoReporteService;

