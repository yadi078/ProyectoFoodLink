/**
 * Tipos y interfaces para Firebase y la aplicación
 */

export interface Vendedor {
  uid: string;
  email: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
  descripcion?: string;
  horarios?: {
    lunes?: string;
    martes?: string;
    miercoles?: string;
    jueves?: string;
    viernes?: string;
    sabado?: string;
    domingo?: string;
  };
  metodosEntrega?: string[];
  tiempoPreparacion?: string;
  calificacion?: number;
  totalCalificaciones?: number;
  estado?: 'activo' | 'pendiente' | 'bloqueado';
  createdAt: Date;
  updatedAt: Date;
}

export interface Estudiante {
  uid: string;
  email: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
  campus?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Platillo {
  id: string;
  vendedorId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  ingredientes?: string[];
  disponible: boolean;
  categoria?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pedido {
  id: string;
  estudianteId: string;
  vendedorId: string;
  platilloId: string;
  platilloNombre: string;
  cantidad: number;
  precioUnitario: number;
  metodoEntrega: 'recoleccion' | 'domicilio';
  direccionEntrega?: string;
  notas?: string;
  estado: 'pendiente' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
  costoEntrega?: number;
  total: number;
  fecha: Date;
  hora: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Calificacion {
  id: string;
  estudianteId: string;
  vendedorId: string;
  platilloId?: string;
  calificacion: number; // 1-5
  comentario: string;
  fecha: Date;
  createdAt: Date;
}

export interface Reporte {
  id: string;
  reportadoPor: string; // ID del estudiante
  reportadoA: string; // ID del vendedor o platillo
  tipo: 'calidad' | 'fraude' | 'comportamiento' | 'otro';
  descripcion: string;
  estado: 'pendiente' | 'en_revision' | 'resuelto' | 'descartado';
  prioridad: 'baja' | 'media' | 'alta';
  fecha: Date;
  createdAt: Date;
}

export interface AuthUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  rol?: 'estudiante' | 'vendedor' | 'admin';
}

export interface AuthError {
  code: string;
  message: string;
}
