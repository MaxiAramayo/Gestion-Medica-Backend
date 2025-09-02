import { z } from 'zod';

// ============================================================================
// ESQUEMAS BASADOS EN EL SCHEMA DE PRISMA Y SERVICIOS EXISTENTES
// ============================================================================

// Esquema específico para registro de usuario - solo campos mínimos requeridos
const createPersonSchemaForUser = z.object({
  // Campos OBLIGATORIOS
  dni: z.number().min(1000000, "El DNI debe tener al menos 7 dígitos").max(99999999, "El DNI no debe exceder los 8 dígitos"),
  firstName: z.string().min(1, "El nombre es obligatorio").max(100, "El nombre no debe exceder los 100 caracteres"),
  lastName: z.string().min(1, "El apellido es obligatorio").max(100, "El apellido no debe exceder los 100 caracteres"),
  
  // Campos OPCIONALES - pueden ser omitidos o null
  birthDate: z.string().pipe(z.coerce.date()).nullable().optional(),
  gender: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  primaryEmail: z.string().email("Formato de email inválido").nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
});

// Esquema para el registro de un nuevo usuario
export const registerUserSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número"),
  roleId: z.number().int().positive("El ID del rol debe ser un número entero positivo"),
  person: createPersonSchemaForUser
});

// Esquema para login
export const loginUserSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(1, "La contraseña es requerida")
});

// Esquema para actualizar usuario (todos opcionales)
export const updateUserSchema = z.object({
  email: z.string().email("Formato de email inválido").optional(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número")
    .optional(),
  roleId: z.number().int().positive("El ID del rol debe ser un número entero positivo").optional(),
  isActive: z.boolean().optional()
});

// Esquema para buscar usuarios por id
export const userIdParamSchema = z.object({
  id: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "El ID debe ser un número entero positivo"
  })
});

// ============================================================================
// TIPOS INFERIDOS
// ============================================================================

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParamInput = z.infer<typeof userIdParamSchema>;