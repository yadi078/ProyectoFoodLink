/**
 * Servicio de Contacto
 * Maneja los mensajes de contacto enviados desde el formulario
 */

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const COLLECTION_NAME = 'mensajes_contacto';

export interface MensajeContacto {
  id?: string;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  fecha: Date;
  leido: boolean;
}

/**
 * Enviar mensaje de contacto
 */
export const enviarMensajeContacto = async (mensaje: Omit<MensajeContacto, 'fecha' | 'leido' | 'id'>): Promise<string> => {
  try {
    const mensajesRef = collection(db, COLLECTION_NAME);
    const nuevoMensaje = {
      ...mensaje,
      fecha: Timestamp.now(),
      leido: false,
    };

    const docRef = await addDoc(mensajesRef, nuevoMensaje);
    return docRef.id;
  } catch (error) {
    console.error('Error enviando mensaje de contacto:', error);
    throw new Error('Error al enviar el mensaje. Por favor, intenta de nuevo.');
  }
};

/**
 * Obtener comentarios de usuarios (últimos 5)
 */
export const getComentariosUsuarios = async (): Promise<MensajeContacto[]> => {
  try {
    const mensajesRef = collection(db, COLLECTION_NAME);
    const q = query(
      mensajesRef,
      orderBy('fecha', 'desc'),
      limit(5)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        nombre: data.nombre,
        email: data.email,
        asunto: data.asunto,
        mensaje: data.mensaje,
        fecha: data.fecha?.toDate() || new Date(),
        leido: data.leido || false,
      } as MensajeContacto;
    });
  } catch (error) {
    console.error('Error obteniendo comentarios:', error);
    throw new Error('Error al obtener los comentarios.');
  }
};

