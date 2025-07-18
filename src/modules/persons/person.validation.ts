import { z } from 'zod';

// Esquema para crear persona - solo campos obligatorios son required
export const createPersonSchema = z.object({
  // Campos OBLIGATORIOS
  dni: z.string().min(7, "El DNI debe tener al menos 7 caracteres").max(20, "El DNI no debe exceder los 20 caracteres"),
  firstName: z.string().min(1, "El nombre es obligatorio").max(100, "El nombre no debe exceder los 100 caracteres"),
  lastName: z.string().min(1, "El apellido es obligatorio").max(100, "El apellido no debe exceder los 100 caracteres"),

  // Campos OPCIONALES - solo nullable, sin .optional()
  birthDate: z.string().pipe(z.coerce.date()).nullable(),
  gender: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  primaryEmail: z.string().email("Formato de email inválido").nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  province: z.string().nullable(),
  country: z.string().nullable(),
  postalCode: z.string().nullable(),
});

// Para update, todos son opcionales
export const updatePersonSchema = createPersonSchema.partial();

// Esquema para validar parámetros de ID
export const idParamSchema = z.object({
  id: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "El ID debe ser un número entero positivo"
  })
});

// Esquema para validar query de búsqueda
export const searchQuerySchema = z.object({
  query: z.string()
    .min(1, "El término de búsqueda no puede estar vacío")
    .max(100, "El término de búsqueda no debe exceder los 100 caracteres")
    .optional()
});

// Tipos inferidos
export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;