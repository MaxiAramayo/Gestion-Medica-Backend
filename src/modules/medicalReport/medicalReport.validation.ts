import { z } from 'zod';

/**
 * Esquema para validar una imagen de reporte (solo URL)
 */
export const reportImageSchema = z.object({
  url: z.string()
    .url({ message: "La URL de la imagen debe ser válida" })
    .max(500, { message: "La URL no debe exceder los 500 caracteres" }),
  
  imageType: z.string()
    .max(50, { message: "El tipo de imagen no debe exceder los 50 caracteres" })
    .nullable()
    .optional(),
  
  description: z.string()
    .max(1000, { message: "La descripción no debe exceder los 1000 caracteres" })
    .trim()
    .nullable()
    .optional()
});

/**
 * Esquema para crear un nuevo reporte médico con imágenes opcionales
 */
export const createMedicalReportSchema = z.object({
  patientId: z.number()
    .int({ message: "El ID del paciente debe ser un número entero" })
    .positive({ message: "El ID del paciente debe ser positivo" }),
  
  doctorId: z.number()
    .int({ message: "El ID del doctor debe ser un número entero" })
    .positive({ message: "El ID del doctor debe ser positivo" }),
  
  reportTypeId: z.number()
    .int({ message: "El ID del tipo de reporte debe ser un número entero" })
    .positive({ message: "El ID del tipo de reporte debe ser positivo" }),
  
  centerId: z.number()
    .int({ message: "El ID del centro debe ser un número entero" })
    .positive({ message: "El ID del centro debe ser positivo" })
    .nullable()
    .optional(),
  
  title: z.string()
    .min(1, { message: "El título es obligatorio" })
    .max(255, { message: "El título no debe exceder los 255 caracteres" })
    .trim(),
  
  content: z.string()
    .min(1, { message: "El contenido es obligatorio" })
    .max(10000, { message: "El contenido no debe exceder los 10,000 caracteres" })
    .trim(),
  
  // Imágenes opcionales al crear el reporte
  images: z.array(reportImageSchema)
    .max(10, { message: "No se pueden agregar más de 10 imágenes por reporte" })
    .optional()
});

/**
 * Esquema para actualizar un reporte médico existente
 */
export const updateMedicalReportSchema = z.object({
  patientId: z.number()
    .int({ message: "El ID del paciente debe ser un número entero" })
    .positive({ message: "El ID del paciente debe ser positivo" })
    .optional(),
  
  doctorId: z.number()
    .int({ message: "El ID del doctor debe ser un número entero" })
    .positive({ message: "El ID del doctor debe ser positivo" })
    .optional(),
  
  reportTypeId: z.number()
    .int({ message: "El ID del tipo de reporte debe ser un número entero" })
    .positive({ message: "El ID del tipo de reporte debe ser positivo" })
    .optional(),
  
  centerId: z.number()
    .int({ message: "El ID del centro debe ser un número entero" })
    .positive({ message: "El ID del centro debe ser positivo" })
    .nullable()
    .optional(),
  
  title: z.string()
    .min(1, { message: "El título no puede estar vacío" })
    .max(255, { message: "El título no debe exceder los 255 caracteres" })
    .trim()
    .optional(),
  
  content: z.string()
    .min(1, { message: "El contenido no puede estar vacío" })
    .max(10000, { message: "El contenido no debe exceder los 10,000 caracteres" })
    .trim()
    .optional()
});

/**
 * Esquema para filtros de búsqueda
 */
export const medicalReportFiltersSchema = z.object({
  patientId: z.string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, { message: "ID de paciente inválido" })
    .optional(),
  
  doctorId: z.string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, { message: "ID de doctor inválido" })
    .optional(),
  
  reportTypeId: z.string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, { message: "ID de tipo de reporte inválido" })
    .optional(),
  
  centerId: z.string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, { message: "ID de centro inválido" })
    .optional(),
  
  dateFrom: z.string()
    .pipe(z.coerce.date())
    .optional(),
  
  dateTo: z.string()
    .pipe(z.coerce.date())
    .optional(),
  
  searchTerm: z.string()
    .min(1, { message: "El término de búsqueda no puede estar vacío" })
    .max(100, { message: "El término de búsqueda no debe exceder los 100 caracteres" })
    .trim()
    .optional()
});

/**
 * Esquema para opciones de paginación
 */
export const paginationSchema = z.object({
  page: z.string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, { message: "La página debe ser un número positivo" })
    .default("1"),
  
  limit: z.string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0 && val <= 100, { 
      message: "El límite debe ser un número entre 1 y 100" 
    })
    .default("10"),
  
  sortBy: z.enum(['createdAt', 'title', 'patientName', 'doctorName'], {
    message: "Campo de ordenamiento inválido"
  })
    .default('createdAt'),
  
  sortOrder: z.enum(['asc', 'desc'], {
    message: "Orden de clasificación inválido"
  })
    .default('desc')
});

/**
 * Esquema para validar parámetros de ID
 */
export const idParamSchema = z.object({
  id: z.string()
    .refine(val => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0;
    }, {
      message: "El ID debe ser un número entero positivo"
    })
});

/**
 * Esquema para búsqueda de reportes
 */
export const searchReportsSchema = z.object({
  query: z.string()
    .min(1, { message: "El término de búsqueda no puede estar vacío" })
    .max(100, { message: "El término de búsqueda no debe exceder los 100 caracteres" })
    .trim()
    .optional()
});

// Tipos inferidos
export type CreateMedicalReportInput = z.infer<typeof createMedicalReportSchema>;
export type UpdateMedicalReportInput = z.infer<typeof updateMedicalReportSchema>;
export type MedicalReportFiltersInput = z.infer<typeof medicalReportFiltersSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
export type SearchReportsInput = z.infer<typeof searchReportsSchema>;