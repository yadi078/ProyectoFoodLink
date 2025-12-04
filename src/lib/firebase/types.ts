/**
 * Tipos y interfaces para Firebase y la aplicación
 */

export type InstitucionEducativa = "Universidad Tecnológica del Norte de Aguascalientes (UTNA)" | "No pertenezco a esta institución";

export interface Vendedor {
  uid: string;
  email: string;
  nombre: string;
  nombreNegocio?: string; // Nombre del negocio del vendedor
  telefono?: string;
  direccion?: string;
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
  institucionEducativa: InstitucionEducativa; // Solo UTNA permitido
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

export type CategoriaPlatillo =
  | "Comida rápida"
  | "Comida casera"
  | "Bebidas"
  | "Postres";

export interface Platillo {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
  vendedorId: string;
  imagen?: string;
  categoria: CategoriaPlatillo; // Categoría obligatoria
  cantidadDisponible?: number; // Opcional
  notasAdicionales?: string; // Opcional
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Pedido {
  id: string;
  estudianteId: string;
  vendedorId: string;
  items: {
    platilloId: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
  }[];
  precioTotal: number;
  estado:
    | "pendiente"
    | "en_camino"
    | "entregado"
    | "cancelado";
  tipoEntrega: "entrega"; // Siempre entrega en la puerta principal de UTNA
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
