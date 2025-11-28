/**
 * Validadores de autenticación
 * Validación estricta de entradas usando Zod
 * Principio de seguridad: Validación de entrada estricta
 */

import { z } from "zod";

/**
 * Validador para registro de usuario
 * Requisitos de seguridad:
 * - Email válido
 * - Contraseña con mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
 * - Nombre requerido
 * - Tipo de usuario requerido
 */
const baseRegisterSchema = {
  tipoUsuario: z.enum(["alumno", "vendedor"], {
    required_error: "Debes seleccionar un tipo de usuario",
  }),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("El correo electrónico no es válido")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    )
    .max(100, "La contraseña es demasiado larga"),
  confirmPassword: z.string().min(1, "Por favor confirma tu contraseña"),
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo")
    .trim()
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras y espacios"
    ),
  telefono: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, "El teléfono no es válido")
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(20, "El teléfono es demasiado largo")
    .optional()
    .or(z.literal("")),
  zona: z.enum(["Zona Norte", "Zona Centro", "Zona Sur"], {
    required_error: "Debes seleccionar una zona",
  }),
  institucionEducativa: z
    .string()
    .min(2, "El nombre de la institución debe tener al menos 2 caracteres")
    .max(200, "El nombre de la institución es demasiado largo")
    .trim()
    .optional(),
};

// Esquema para vendedores con campos adicionales
const vendedorSchema = z.object({
  ...baseRegisterSchema,
  tipoComida: z
    .array(z.string())
    .min(1, "Debes seleccionar al menos un tipo de comida")
    .refine(
      (val) =>
        val.every((item) =>
          ["Comida rápida", "Comida casera", "Bebidas", "Postres"].includes(
            item
          )
        ),
      "Tipo de comida no válido"
    ),
  horarioInicio: z
    .string()
    .regex(
      /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      "Formato de hora inválido (debe ser HH:mm)"
    ),
  horarioFin: z
    .string()
    .regex(
      /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      "Formato de hora inválido (debe ser HH:mm)"
    ),
  diasDescanso: z.array(z.string()).optional(),
});

// Esquema para alumnos (solo campos base)
const alumnoSchema = z.object(baseRegisterSchema);

// Esquema dinámico que valida según el tipo de usuario
export const registerSchema = z
  .object({
    ...baseRegisterSchema,
    nombreNegocio: z.string().optional(),
    tipoComida: z.array(z.string()).optional(),
    horarioInicio: z.string().optional(),
    horarioFin: z.string().optional(),
    diasDescanso: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
    // Si es alumno, validar institución educativa
    if (data.tipoUsuario === "alumno") {
      if (
        !data.institucionEducativa ||
        data.institucionEducativa.trim().length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El nombre de la institución educativa es requerido",
          path: ["institucionEducativa"],
        });
      }
    }

    // Si es vendedor, validar campos adicionales
    if (data.tipoUsuario === "vendedor") {
      if (!data.nombreNegocio || data.nombreNegocio.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El nombre del negocio es requerido",
          path: ["nombreNegocio"],
        });
      }
      if (!data.tipoComida || data.tipoComida.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debes seleccionar al menos un tipo de comida",
          path: ["tipoComida"],
        });
      }
      if (!data.horarioInicio) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El horario de inicio es requerido",
          path: ["horarioInicio"],
        });
      }
      if (!data.horarioFin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El horario de fin es requerido",
          path: ["horarioFin"],
        });
      }
      if (data.horarioInicio && data.horarioFin) {
        const inicio = data.horarioInicio.split(":").map(Number);
        const fin = data.horarioFin.split(":").map(Number);
        const inicioMinutos = inicio[0] * 60 + inicio[1];
        const finMinutos = fin[0] * 60 + fin[1];
        if (inicioMinutos >= finMinutos) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "El horario de fin debe ser posterior al horario de inicio",
            path: ["horarioFin"],
          });
        }
      }
    }
  });

/**
 * Validador para inicio de sesión
 */
export const loginSchema = z.object({
  tipoUsuario: z.enum(["alumno", "vendedor"], {
    required_error: "Debes seleccionar un tipo de usuario",
  }),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("El correo electrónico no es válido")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .max(100, "La contraseña es demasiado larga"),
});

// Tipos inferidos de los esquemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
