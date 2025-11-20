/**
 * Tipos y interfaces para Firebase y la aplicación
 */

export interface Vendedor {
  uid: string;
  email: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
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

