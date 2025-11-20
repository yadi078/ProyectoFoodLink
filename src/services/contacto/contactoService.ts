/**
 * Servicio de Contacto
 * Maneja los mensajes de contacto enviados desde el formulario
 */

import {
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const COLLECTION_NAME = 'mensajes_contacto';

interface MensajeContacto {
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
export const enviarMensajeContacto = async (mensaje: Omit<MensajeContacto, 'fecha' | 'leido'>): Promise<string> => {
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

