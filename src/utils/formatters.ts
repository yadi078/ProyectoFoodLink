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
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formatea una fecha con hora
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Trunca un texto a una longitud máxima
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

