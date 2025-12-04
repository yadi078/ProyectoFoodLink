/**
 * Utilidades para formateo de datos
 * Reduce código duplicado en toda la aplicación
 */

/**
 * Formatea un número como precio en formato de moneda
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

/**
 * Formatea una fecha en formato legible
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formatea una fecha con hora en formato 24 horas
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Formato 24 horas
  });
};

/**
 * Trunca un texto a una longitud máxima
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Formatea una hora en formato 24 horas (HH:mm)
 * @param date - Fecha u hora
 * @returns Hora formateada en formato 24 horas (ej: 14:30, 18:00)
 */
export const formatTime24 = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Formato 24 horas
  });
};

/**
 * Valida que una hora esté en formato HH:mm (24 horas)
 * @param hora - Hora a validar (ej: "14:30", "18:00")
 * @returns true si es válida, false si no
 */
export const isValidTime24 = (hora: string): boolean => {
  const horaRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  return horaRegex.test(hora);
};

/**
 * Convierte un Timestamp de Firebase a Date
 * Útil para evitar duplicación en servicios
 */
export const timestampToDate = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
};
