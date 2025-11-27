/**
 * Tipos y interfaces para Firebase y la aplicación
 */

export type Zona = 'Zona Norte' | 'Zona Centro' | 'Zona Sur';

export interface Vendedor {
  uid: string;
  email: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
  zona: Zona; // Zona de Rincón de Romos
  tipoComida?: string[]; // ['Comida rápida', 'Comida casera', 'Bebidas', 'Postres']
  horario?: HorarioServicio;
  diasDescanso?: string[]; // ['Lunes', 'Martes', etc.]
  createdAt: Date;
  updatedAt: Date;
}

export interface HorarioServicio {
  inicio: string; // Formato HH:mm
  fin: string; // Formato HH:mm
}

export interface Estudiante {
  uid: string;
  email: string;
  nombre: string;
  telefono?: string;
  zona: Zona; // Zona de Rincón de Romos
  institucionEducativa?: string; // Nombre de la escuela/universidad
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  uid: string;
  email: string;
  emailVerified: boolean;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface Platillo {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
  vendedorId: string;
  imagen?: string;
  tipo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Pedido {
  id: string;
  estudianteId: string;
  vendedorId: string;
  platilloId: string;
  cantidad: number;
  precioTotal: number;
  estado: 'pendiente' | 'confirmado' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado';
  direccionEntrega?: string;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Calificacion {
  id: string;
  estudianteId: string;
  vendedorId: string;
  pedidoId: string;
  calificacion: number; // 1-5
  comentario?: string;
  createdAt: Date;
}

