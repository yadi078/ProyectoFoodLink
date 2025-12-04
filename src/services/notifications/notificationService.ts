/**
 * Servicio de Notificaciones
 * Gestiona permisos y envío de notificaciones push
 */

export type NotificationPermissionState =
  | "granted"
  | "denied"
  | "default"
  | "unsupported";

export interface NotificationSettings {
  enabled: boolean;
  pedidosNuevos: boolean;
  actualizacionesPedidos: boolean;
  mensajesVendedor: boolean;
  promociones: boolean;
  lastPermissionRequest?: number; // timestamp
  permissionDeniedCount: number; // cuántas veces se negó
}

/**
 * Datos adicionales que se pueden enviar con una notificación
 * Permite manejar clics y redirigir a pantallas específicas
 */
export interface NotificationData {
  url?: string; // URL de destino al hacer clic
  pedidoId?: string;
  vendedorId?: string;
  productoId?: string;
  type?: "pedido" | "mensaje" | "promocion" | "actualizacion";
  [key: string]: any; // Permitir datos adicionales
}

/**
 * Opciones para crear una notificación
 */
export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: NotificationData;
  tag?: string;
  requireInteraction?: boolean; // Si la notificación debe permanecer hasta que el usuario interactúe
}

const PERMISSION_RETRY_DELAY = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
const MAX_PERMISSION_DENIALS = 3; // Máximo de veces que se muestra el mensaje

// Límites de longitud para notificaciones
const MAX_TITLE_LENGTH = 50; // Máximo caracteres para el título
const MAX_BODY_LENGTH = 150; // Máximo caracteres para el cuerpo
const TRUNCATE_SUFFIX = "..."; // Sufijo para indicar truncamiento

/**
 * Trunca un texto si excede la longitud máxima
 * Agrega '...' al final para indicar que fue truncado
 */
function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  const truncateLength = maxLength - TRUNCATE_SUFFIX.length;
  return text.substring(0, truncateLength).trim() + TRUNCATE_SUFFIX;
}

/**
 * Valida y sanitiza el título de una notificación
 */
export function validateTitle(title: string): string {
  if (!title || title.trim().length === 0) {
    throw new Error("El título de la notificación no puede estar vacío");
  }
  return truncateText(title.trim(), MAX_TITLE_LENGTH);
}

/**
 * Valida y sanitiza el cuerpo de una notificación
 */
export function validateBody(body: string): string {
  if (!body || body.trim().length === 0) {
    throw new Error("El cuerpo de la notificación no puede estar vacío");
  }
  return truncateText(body.trim(), MAX_BODY_LENGTH);
}

/**
 * Obtiene el estado actual de los permisos de notificaciones
 */
export function getNotificationPermission(): NotificationPermissionState {
  if (!("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission as NotificationPermissionState;
}

/**
 * Verifica si las notificaciones están soportadas en el navegador
 */
export function isNotificationSupported(): boolean {
  return "Notification" in window;
}

/**
 * Verifica si podemos solicitar permisos de notificaciones
 * Retorna false si el usuario ha rechazado múltiples veces recientemente
 */
export function canRequestPermission(userId: string): boolean {
  const settings = getNotificationSettings(userId);

  // Si ya está concedido, siempre se puede usar
  if (getNotificationPermission() === "granted") {
    return true;
  }

  // Si está bloqueado permanentemente, no podemos hacer nada
  if (getNotificationPermission() === "denied") {
    return false;
  }

  // Si el usuario rechazó muchas veces, esperar un tiempo
  if (settings.permissionDeniedCount >= MAX_PERMISSION_DENIALS) {
    const lastRequest = settings.lastPermissionRequest || 0;
    const timeSinceLastRequest = Date.now() - lastRequest;

    if (timeSinceLastRequest < PERMISSION_RETRY_DELAY) {
      return false; // Aún no ha pasado suficiente tiempo
    }
  }

  return true;
}

/**
 * Solicita permisos de notificaciones al usuario
 * Retorna el estado del permiso después de la solicitud
 */
export async function requestNotificationPermission(
  userId: string
): Promise<NotificationPermissionState> {
  if (!isNotificationSupported()) {
    return "unsupported";
  }

  const currentPermission = getNotificationPermission();

  // Si ya está concedido, retornar
  if (currentPermission === "granted") {
    return "granted";
  }

  // Si está bloqueado permanentemente, no podemos solicitar
  if (currentPermission === "denied") {
    return "denied";
  }

  try {
    const permission = await Notification.requestPermission();

    // Actualizar configuración según la respuesta
    const settings = getNotificationSettings(userId);
    settings.lastPermissionRequest = Date.now();

    if (permission === "denied") {
      settings.permissionDeniedCount += 1;
      settings.enabled = false;
    } else if (permission === "granted") {
      settings.permissionDeniedCount = 0; // Reset counter
      settings.enabled = true;
    }

    saveNotificationSettings(userId, settings);

    return permission as NotificationPermissionState;
  } catch (error) {
    console.error("Error al solicitar permisos de notificaciones:", error);
    return "denied";
  }
}

/**
 * Obtiene la configuración de notificaciones del usuario desde localStorage
 */
export function getNotificationSettings(userId: string): NotificationSettings {
  const defaultSettings: NotificationSettings = {
    enabled: false,
    pedidosNuevos: true,
    actualizacionesPedidos: true,
    mensajesVendedor: true,
    promociones: false,
    permissionDeniedCount: 0,
  };

  try {
    const stored = localStorage.getItem(`notification_settings_${userId}`);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error("Error al cargar configuración de notificaciones:", error);
  }

  return defaultSettings;
}

/**
 * Guarda la configuración de notificaciones del usuario en localStorage
 */
export function saveNotificationSettings(
  userId: string,
  settings: NotificationSettings
): void {
  try {
    localStorage.setItem(
      `notification_settings_${userId}`,
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error("Error al guardar configuración de notificaciones:", error);
  }
}

/**
 * Actualiza una preferencia específica de notificaciones
 */
export function updateNotificationPreference(
  userId: string,
  preference: keyof NotificationSettings,
  value: boolean
): void {
  const settings = getNotificationSettings(userId);
  (settings[preference] as boolean) = value;
  saveNotificationSettings(userId, settings);
}

/**
 * Verifica si hay un Service Worker activo
 */
function isServiceWorkerActive(): boolean {
  return (
    "serviceWorker" in navigator && navigator.serviceWorker.controller !== null
  );
}

/**
 * Obtiene el registro del Service Worker
 */
async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  try {
    return await navigator.serviceWorker.ready;
  } catch (error) {
    console.error("❌ Error al obtener Service Worker:", error);
    return null;
  }
}

/**
 * Crea y muestra una notificación con validaciones y manejo de clics
 * Usa Service Worker si está disponible (mejor para móvil)
 * @param options - Opciones de la notificación (título, cuerpo, datos, etc.)
 * @returns Promise<boolean> - true si se envió correctamente
 */
export async function createNotification(
  options: NotificationOptions
): Promise<boolean> {
  // Verificar permisos
  if (getNotificationPermission() !== "granted") {
    console.warn("⚠️ No se tienen permisos para enviar notificaciones");
    return false;
  }

  try {
    // Validar y sanitizar contenido
    const title = validateTitle(options.title);
    const body = validateBody(options.body);

    // Preparar opciones de la notificación
    const notificationOptions: any = {
      body,
      icon: options.icon || "/icons/icon-192x192.png",
      badge: options.badge || "/icons/badge-72x72.png",
      tag: options.tag || `notification-${Date.now()}`,
      data: options.data || {},
      requireInteraction: options.requireInteraction || false,
      vibrate: [200, 100, 200], // Patrón de vibración para móvil
      silent: false,
    };

    // INTENTAR USAR SERVICE WORKER PRIMERO (mejor para móvil)
    const registration = await getServiceWorkerRegistration();

    if (registration) {
      console.log("📱 Usando Service Worker para notificación (móvil)");

      // Usar Service Worker para mostrar la notificación
      await registration.showNotification(title, notificationOptions);

      return true;
    }

    // FALLBACK: Usar API básica de notificaciones (escritorio)
    console.log("💻 Usando API básica de notificaciones (escritorio)");

    const notification = new Notification(title, notificationOptions);

    // Manejar clic en la notificación (solo en escritorio)
    notification.onclick = (event) => {
      event.preventDefault();

      const data = notificationOptions.data as NotificationData;

      console.log("🔔 Click en notificación:", {
        title,
        data,
      });

      // Enfocar la ventana
      if (window.parent) {
        window.parent.focus();
      }
      window.focus();

      // Redirigir según los datos
      if (data?.url) {
        window.location.href = data.url;
      } else if (data?.pedidoId) {
        // Redirigir a la página del pedido
        window.location.href = `/vendedor/pedidos/${data.pedidoId}`;
      } else if (data?.productoId) {
        // Redirigir a la página del producto
        window.location.href = `/menu?producto=${data.productoId}`;
      } else if (data?.type === "mensaje") {
        // Redirigir a mensajes
        window.location.href = "/mensajes";
      }

      // Cerrar la notificación
      notification.close();
    };

    // Manejar error en la notificación
    notification.onerror = (event) => {
      console.error("❌ Error en la notificación:", event);
    };

    // Auto-cerrar después de 10 segundos si no requiere interacción
    if (!options.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 10000);
    }

    return true;
  } catch (error) {
    console.error("❌ Error al crear notificación:", error);
    return false;
  }
}

/**
 * Envía una notificación de prueba
 */
export async function sendTestNotification(): Promise<boolean> {
  return createNotification({
    title: "FoodLink",
    body: "¡Las notificaciones están activas! 🎉",
    tag: "test-notification",
    data: {
      type: "promocion",
      url: "/menu",
    },
  });
}

/**
 * Envía una notificación de nuevo pedido
 */
export async function notifyNewOrder(
  pedidoId: string,
  clienteNombre: string,
  total: number
): Promise<boolean> {
  return createNotification({
    title: "🛒 Nuevo Pedido",
    body: `${clienteNombre} realizó un pedido de $${total.toFixed(2)}`,
    tag: `pedido-${pedidoId}`,
    requireInteraction: true, // Requiere que el usuario interactúe
    data: {
      type: "pedido",
      pedidoId,
      url: `/vendedor/pedidos/${pedidoId}`,
    },
  });
}

/**
 * Envía una notificación de actualización de pedido
 */
export async function notifyOrderUpdate(
  pedidoId: string,
  status: string,
  mensaje?: string
): Promise<boolean> {
  const statusMessages: Record<string, string> = {
    confirmado: "Tu pedido ha sido confirmado",
    preparando: "Tu pedido está siendo preparado",
    listo: "¡Tu pedido está listo para recoger!",
    entregado: "Tu pedido ha sido entregado",
    cancelado: "Tu pedido ha sido cancelado",
  };

  const body =
    mensaje || statusMessages[status] || "Tu pedido ha sido actualizado";

  return createNotification({
    title: "📦 Actualización de Pedido",
    body,
    tag: `pedido-update-${pedidoId}`,
    data: {
      type: "actualizacion",
      pedidoId,
      url: `/pedidos/${pedidoId}`,
    },
  });
}

/**
 * Envía una notificación de mensaje de vendedor
 */
export async function notifyVendorMessage(
  vendedorId: string,
  vendedorNombre: string,
  mensaje: string
): Promise<boolean> {
  return createNotification({
    title: `💬 Mensaje de ${vendedorNombre}`,
    body: mensaje,
    tag: `mensaje-${vendedorId}`,
    data: {
      type: "mensaje",
      vendedorId,
      url: `/mensajes?vendedor=${vendedorId}`,
    },
  });
}

/**
 * Envía una notificación de promoción
 */
export async function notifyPromotion(
  titulo: string,
  descripcion: string,
  productoId?: string
): Promise<boolean> {
  return createNotification({
    title: `🎉 ${titulo}`,
    body: descripcion,
    tag: `promo-${Date.now()}`,
    data: {
      type: "promocion",
      productoId,
      url: productoId ? `/menu?producto=${productoId}` : "/menu",
    },
  });
}

/**
 * Verifica el estado de los permisos y actualiza la configuración si cambió
 * Esto detecta cuando el usuario desactiva permisos desde el sistema operativo
 */
export function checkAndUpdatePermissionState(userId: string): boolean {
  const currentPermission = getNotificationPermission();
  const settings = getNotificationSettings(userId);
  let changed = false;

  // Si los permisos se revocaron desde el SO, actualizar configuración
  if (currentPermission === "denied" && settings.enabled) {
    console.log(
      "🔄 Permisos revocados desde el SO - Desactivando notificaciones"
    );
    settings.enabled = false;
    saveNotificationSettings(userId, settings);
    changed = true;
  }

  // Si los permisos se concedieron desde el SO y el usuario tenía activado
  if (
    currentPermission === "granted" &&
    !settings.enabled &&
    settings.permissionDeniedCount === 0
  ) {
    console.log(
      "🔄 Permisos concedidos desde el SO - Activando notificaciones"
    );
    settings.enabled = true;
    saveNotificationSettings(userId, settings);
    changed = true;
  }

  return changed;
}

/**
 * Obtiene un mensaje apropiado según el estado de los permisos
 */
export function getPermissionMessage(state: NotificationPermissionState): {
  title: string;
  message: string;
  canRetry: boolean;
} {
  switch (state) {
    case "granted":
      return {
        title: "¡Notificaciones activas!",
        message:
          "Recibirás notificaciones sobre tus pedidos y actualizaciones.",
        canRetry: false,
      };
    case "denied":
      return {
        title: "Notificaciones bloqueadas",
        message:
          "Activa las notificaciones desde los ajustes del sistema. " +
          "Ve a Configuración del navegador → Permisos → Notificaciones.",
        canRetry: false,
      };
    case "default":
      return {
        title: "Activa las notificaciones",
        message:
          "Te mantendremos informado sobre tus pedidos y nuevas ofertas.",
        canRetry: true,
      };
    case "unsupported":
      return {
        title: "Notificaciones no disponibles",
        message: "Tu navegador no soporta notificaciones push.",
        canRetry: false,
      };
  }
}

/**
 * Hook auxiliar para detectar cambios en permisos
 * Se debe ejecutar periódicamente cuando el usuario está activo
 */
export function startPermissionMonitoring(
  userId: string,
  onPermissionChange: (state: NotificationPermissionState) => void
): () => void {
  let lastPermission = getNotificationPermission();

  const intervalId = setInterval(() => {
    const currentPermission = getNotificationPermission();

    if (currentPermission !== lastPermission) {
      lastPermission = currentPermission;
      checkAndUpdatePermissionState(userId);
      onPermissionChange(currentPermission);
    }
  }, 5000); // Verificar cada 5 segundos

  // Retornar función para limpiar el interval
  return () => clearInterval(intervalId);
}
