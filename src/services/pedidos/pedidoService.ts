/**
 * Servicio de Pedidos
 * Maneja todas las operaciones relacionadas con pedidos en Firestore
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
import type { Pedido } from '@/lib/firebase/types';

const COLLECTION_NAME = 'pedidos';

/**
 * Obtener un pedido por ID
 */
export const getPedido = async (id: string): Promise<Pedido | null> => {
  try {
    const pedidoRef = doc(db, COLLECTION_NAME, id);
    const pedidoSnap = await getDoc(pedidoRef);

    if (!pedidoSnap.exists()) {
      return null;
    }

    const data = pedidoSnap.data();
    return {
      id: pedidoSnap.id,
      ...data,
      fecha: data.fecha?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Pedido;
  } catch (error) {
    console.error('Error obteniendo pedido:', error);
    throw new Error('Error al obtener el pedido');
  }
};

/**
 * Crear un nuevo pedido
 */
export const crearPedido = async (
  pedido: Omit<Pedido, 'id' | 'fecha' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const pedidosRef = collection(db, COLLECTION_NAME);
    const nuevoPedido = {
      ...pedido,
      fecha: Timestamp.now(),
      hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      estado: 'pendiente' as const,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(pedidosRef, nuevoPedido);
    return docRef.id;
  } catch (error) {
    console.error('Error creando pedido:', error);
    throw new Error('Error al crear el pedido');
  }
};

/**
 * Obtener pedidos de un estudiante
 */
export const getPedidosPorEstudiante = async (estudianteId: string): Promise<Pedido[]> => {
  try {
    const pedidosRef = collection(db, COLLECTION_NAME);
    const q = query(
      pedidosRef,
      where('estudianteId', '==', estudianteId),
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
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Pedido;
    });
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    throw new Error('Error al obtener los pedidos');
  }
};

/**
 * Obtener pedidos de un vendedor
 */
export const getPedidosPorVendedor = async (vendedorId: string): Promise<Pedido[]> => {
  try {
    const pedidosRef = collection(db, COLLECTION_NAME);
    const q = query(
      pedidosRef,
      where('vendedorId', '==', vendedorId),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        fecha: data.fecha?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Pedido;
    });
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    throw new Error('Error al obtener los pedidos');
  }
};

/**
 * Actualizar estado de un pedido
 */
export const actualizarEstadoPedido = async (
  id: string,
  estado: Pedido['estado']
): Promise<void> => {
  try {
    const pedidoRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(pedidoRef, {
      estado,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error actualizando pedido:', error);
    throw new Error('Error al actualizar el estado del pedido');
  }
};

/**
 * Obtener pedidos por estado
 */
export const getPedidosPorEstado = async (
  vendedorId: string,
  estado: Pedido['estado']
): Promise<Pedido[]> => {
  try {
    const pedidosRef = collection(db, COLLECTION_NAME);
    const q = query(
      pedidosRef,
      where('vendedorId', '==', vendedorId),
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
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Pedido;
    });
  } catch (error) {
    console.error('Error obteniendo pedidos por estado:', error);
    throw new Error('Error al obtener los pedidos');
  }
};

