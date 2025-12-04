/**
 * Tipos y interfaces para Firebase y la aplicación
 */

export type InstitucionEducativa =
  | "Universidad Tecnológica del Norte de Aguascalientes (UTNA)"
  | "No pertenezco a esta institución";

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
  calificacionPromedio?: number; // Promedio de calificaciones del servicio
  totalCalificaciones?: number; // Total de calificaciones recibidas
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
  puntos?: number; // Puntos de fidelidad
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  uid: string;
  email: string;
  emailVerified: boolean;
}

export type CategoriaPlatillo =
  | "Comida rápida"
  | "Comida casera"
  | "Bebidas"
  | "Postres";

export interface Platillo {
  id: string;
  vendedorId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: CategoriaPlatillo;
  imagen?: string;
  disponible: boolean;
  ingredientes?: string[];
  cantidadDisponible?: number; // Cantidad disponible del platillo
  notasAdicionales?: string; // Notas adicionales del vendedor
  createdAt: Date;
  updatedAt: Date;
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
  precioOriginal?: number; // Precio antes de descuentos
  descuentoAplicado?: number; // Monto del descuento
  codigoPromocional?: string; // Código promocional usado
  estado: "pendiente" | "en_camino" | "entregado" | "cancelado";
  tipoEntrega: "entrega" | "recoger"; // Entrega en UTNA o recoger en el lugar
  horaEntrega: string; // Hora de entrega en formato HH:mm
  fechaEntrega: Date; // Fecha del pedido (siempre el día actual)
  notas?: string;
  vendedorCalificado?: boolean; // Si ya se calificó al vendedor
  createdAt: Date;
  updatedAt: Date;
}

// Nuevo: Calificación de vendedor (servicio)
export interface CalificacionVendedor {
  id: string;
  vendedorId: string;
  estudianteId: string;
  pedidoId: string;
  calificacion: number; // 1-5
  comentario?: string;
  estudianteNombre: string;
  createdAt: Date;
}

// Nuevo: Sistema de chat
export interface Conversacion {
  id: string;
  estudianteId: string;
  vendedorId: string;
  pedidoId?: string; // Opcional, puede ser una consulta general
  ultimoMensaje: string;
  ultimoMensajeFecha: Date;
  estudianteNombre: string;
  vendedorNombre: string;
  noLeidos: {
    estudiante: number;
    vendedor: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Mensaje {
  id: string;
  conversacionId: string;
  remitenteId: string;
  remitenteNombre: string;
  remitenteTipo: "estudiante" | "vendedor";
  mensaje: string;
  leido: boolean;
  createdAt: Date;
}

// Nuevo: Sistema de promociones
export interface Promocion {
  id: string;
  codigo: string;
  descripcion: string;
  tipo: "porcentaje" | "fijo"; // Descuento en % o cantidad fija
  valor: number; // 10 para 10%, o 50 para $50
  montoMinimo?: number; // Compra mínima requerida
  fechaInicio: Date;
  fechaFin: Date;
  usosPorUsuario: number; // Cuántas veces puede usar cada usuario
  usosRestantes?: number; // Total de usos disponibles (null = ilimitado)
  activo: boolean;
  createdAt: Date;
}

export interface UsoPromocion {
  id: string;
  promocionId: string;
  estudianteId: string;
  pedidoId: string;
  descuentoAplicado: number;
  createdAt: Date;
}
