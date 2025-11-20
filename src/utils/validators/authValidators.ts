/**
 * Validadores de autenticación
 * Validación estricta de entradas usando Zod
 * Principio de seguridad: Validación de entrada estricta
 */

import { z } from 'zod';

/**
 * Validador para registro de vendedor
 * Requisitos de seguridad:
 * - Email válido
 * - Contraseña con mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
 * - Nombre requerido
 */
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('El correo electrónico no es válido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    )
    .max(100, 'La contraseña es demasiado larga'),
  confirmPassword: z.string().min(1, 'Por favor confirma tu contraseña'),
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .trim()
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  telefono: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, 'El teléfono no es válido')
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(20, 'El teléfono es demasiado largo')
    .optional()
    .or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

/**
 * Validador para inicio de sesión
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('El correo electrónico no es válido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .max(100, 'La contraseña es demasiado larga'),
});

// Tipos inferidos de los esquemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

