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
  horaEntrega: string; // Formato HH:mm
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
    horaEntrega,
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

  if (!horaEntrega) {
    throw new Error("La hora de entrega es requerida");
  }

  // Validar formato de hora (HH:mm)
  const horaRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  if (!horaRegex.test(horaEntrega)) {
    throw new Error("Formato de hora inválido. Use HH:mm");
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

  // Validar hora de entrega (debe ser posterior a la hora actual del servidor)
  const ahora = new Date();
  const horaActual = `${ahora.getHours().toString().padStart(2, "0")}:${ahora
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  if (horaEntrega <= horaActual) {
    throw new Error("Selecciona una hora posterior a la hora actual.");
  }

  // La fecha del pedido siempre es el día actual
  const fechaEntrega = new Date();
  fechaEntrega.setHours(0, 0, 0, 0); // Resetear a medianoche del día actual

  // Validar horario laboral de los vendedores
  const vendedoresUnicos = Array.from(
    new Set(items.map((item) => item.platillo.vendedorId))
  );

  for (const vendedorId of vendedoresUnicos) {
    try {
      const vendedorDoc = await getDoc(doc(db, "vendedores", vendedorId));
      if (vendedorDoc.exists()) {
        const vendedorData = vendedorDoc.data();
        const horario = vendedorData.horario || { inicio: "10:00", fin: "15:00" };
        
        // Validar que la hora esté dentro del horario del vendedor
        const horaCruzaMedianoche = horario.fin < horario.inicio;
        
        if (horaCruzaMedianoche) {
          // Si el horario cruza medianoche (ej: 17:00 a 02:00)
          if (horaEntrega < horario.inicio && horaEntrega > horario.fin) {
            throw new Error(
              `La hora seleccionada está fuera del horario laboral del cocinero (${horario.inicio} — ${horario.fin}).`
            );
          }
        } else {
          // Horario normal (ej: 10:00 a 15:00)
          if (horaEntrega < horario.inicio || horaEntrega > horario.fin) {
            throw new Error(
              `La hora seleccionada está fuera del horario laboral del cocinero (${horario.inicio} — ${horario.fin}).`
            );
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("horario laboral")) {
        throw error; // Re-lanzar error de validación de horario
      }
      // Si no se puede obtener el vendedor, continuar con horario por defecto
      console.warn(`No se pudo validar horario del vendedor ${vendedorId}`);
    }
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
        horaEntrega, // Guardar la hora de entrega
        fechaEntrega, // Guardar la fecha (siempre el día actual)
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
