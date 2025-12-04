/**
 * Servicio de Pedidos
 * Maneja las operaciones relacionadas con la creación y gestión de pedidos
 */

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { CartItem } from "@/components/context/CartContext";
import { registrarUsoPromocion } from "@/services/promociones/promocionService";

export interface CrearPedidoParams {
  estudianteId: string;
  items: CartItem[];
  tipoEntrega: "entrega" | "recoger";
  notas?: string;
  descuentoAplicado?: number;
  codigoPromocional?: string;
  promocionId?: string;
}

export interface PedidoCreado {
  id: string;
  vendedorId: string;
  items: {
    platilloId: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
  }[];
  precioTotal: number;
}

/**
 * Crear un nuevo pedido en Firebase
 * Agrupa los items por vendedor y crea un pedido por cada vendedor
 */
export const crearPedido = async (
  params: CrearPedidoParams
): Promise<PedidoCreado[]> => {
  const {
    estudianteId,
    items,
    tipoEntrega,
    notas,
    descuentoAplicado,
    codigoPromocional,
    promocionId,
  } = params;

  if (!estudianteId) {
    throw new Error("El ID del estudiante es requerido");
  }

  if (!items || items.length === 0) {
    throw new Error("El carrito está vacío");
  }

  // Validar que el usuario exista en vendedores o estudiantes
  try {
    // Primero buscar en vendedores
    let userDoc = await getDoc(doc(db, "vendedores", estudianteId));

    // Si no existe en vendedores, buscar en estudiantes
    if (!userDoc.exists()) {
      userDoc = await getDoc(doc(db, "estudiantes", estudianteId));
    }

    // Si no existe en ninguna colección, error
    if (!userDoc.exists()) {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al validar usuario:", error);
    throw new Error("No se pudo validar el usuario");
  }

  // Agrupar items por vendedor
  const itemsPorVendedor = items.reduce((acc, item) => {
    const vendedorId = item.platillo.vendedorId;
    if (!acc[vendedorId]) {
      acc[vendedorId] = [];
    }
    acc[vendedorId].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  // Crear un pedido por cada vendedor
  const pedidosCreados: PedidoCreado[] = [];
  const vendedoresArray = Object.entries(itemsPorVendedor);
  let descuentoYaAplicado = false;

  for (let i = 0; i < vendedoresArray.length; i++) {
    const [vendedorId, itemsVendedor] = vendedoresArray[i];
    try {
      // Calcular el precio total de este vendedor
      let precioTotal = itemsVendedor.reduce(
        (total, item) => total + item.platillo.precio * item.cantidad,
        0
      );

      const precioOriginal = precioTotal;

      // Aplicar descuento SOLO al primer vendedor
      let descuentoVendedor = 0;
      if (descuentoAplicado && descuentoAplicado > 0 && !descuentoYaAplicado) {
        descuentoVendedor = Math.min(descuentoAplicado, precioTotal);
        precioTotal = Math.max(0, precioTotal - descuentoVendedor);
        descuentoYaAplicado = true;
      }

      // Preparar los items para guardar
      const itemsParaGuardar = itemsVendedor.map((item) => ({
        platilloId: item.platillo.id,
        nombre: item.platillo.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.platillo.precio,
      }));

      // Crear el documento del pedido
      const pedidoData = {
        estudianteId,
        vendedorId,
        items: itemsParaGuardar,
        precioTotal,
        precioOriginal: descuentoVendedor > 0 ? precioOriginal : undefined,
        descuentoAplicado:
          descuentoVendedor > 0 ? descuentoVendedor : undefined,
        codigoPromocional: codigoPromocional || undefined,
        estado: "pendiente",
        tipoEntrega,
        notas: notas || null,
        vendedorCalificado: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Guardar en Firestore
      const docRef = await addDoc(collection(db, "pedidos"), pedidoData);

      // Registrar uso de promoción si aplica
      if (promocionId && descuentoVendedor > 0) {
        try {
          await registrarUsoPromocion(
            promocionId,
            estudianteId,
            docRef.id,
            descuentoVendedor
          );
        } catch (error) {
          console.error("Error registrando uso de promoción:", error);
          // No fallar el pedido por esto
        }
      }

      pedidosCreados.push({
        id: docRef.id,
        vendedorId,
        items: itemsParaGuardar,
        precioTotal,
      });
    } catch (error) {
      console.error(
        `Error al crear pedido para vendedor ${vendedorId}:`,
        error
      );
      throw new Error(
        `No se pudo crear el pedido para el vendedor ${vendedorId}`
      );
    }
  }

  return pedidosCreados;
};

/**
 * Validar que los platillos estén disponibles antes de crear el pedido
 */
export const validarDisponibilidadPlatillos = async (
  items: CartItem[]
): Promise<{ valido: boolean; mensaje?: string }> => {
  try {
    for (const item of items) {
      const platilloDoc = await getDoc(doc(db, "platillos", item.platillo.id));

      if (!platilloDoc.exists()) {
        return {
          valido: false,
          mensaje: `El platillo "${item.platillo.nombre}" ya no existe`,
        };
      }

      const platilloData = platilloDoc.data();

      if (!platilloData.disponible) {
        return {
          valido: false,
          mensaje: `El platillo "${item.platillo.nombre}" ya no está disponible`,
        };
      }

      // Si tiene cantidad disponible definida, validar
      if (
        platilloData.cantidadDisponible !== undefined &&
        platilloData.cantidadDisponible < item.cantidad
      ) {
        return {
          valido: false,
          mensaje: `Solo hay ${platilloData.cantidadDisponible} unidades disponibles de "${item.platillo.nombre}"`,
        };
      }
    }

    return { valido: true };
  } catch (error) {
    console.error("Error al validar disponibilidad:", error);
    return {
      valido: false,
      mensaje: "No se pudo verificar la disponibilidad de los platillos",
    };
  }
};
