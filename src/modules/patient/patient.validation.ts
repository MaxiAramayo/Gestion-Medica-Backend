import { z } from "zod";

export const createPatientSchema = z.object({
  personId: z.number().int().positive(),              // referencia a Person.id
  socialSecurityProviderId: z.number().int().positive().optional(),
  affiliateNumber: z.string().trim().max(50).optional(),
  bloodGroup: z.string().trim().max(5).optional(),
  allergies: z.string().trim().optional(),
  preExistingConditions: z.string().trim().optional(),
  medications: z.string().trim().optional(),
});

export const updatePatientSchema = z.object({
  socialSecurityProviderId: z.number().int().positive().nullable().optional(),
  affiliateNumber: z.string().trim().max(50).nullable().optional(),
  bloodGroup: z.string().trim().max(5).nullable().optional(),
  allergies: z.string().trim().nullable().optional(),
  preExistingConditions: z.string().trim().nullable().optional(),
  medications: z.string().trim().nullable().optional(),
  isDeleted: z.boolean().optional(), // no expongas esto si no querés desde el front
});

// Filtros de listado / búsqueda
export const listPatientsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  includeDeleted: z.coerce.boolean().optional(),
  providerId: z.coerce.number().int().positive().optional(),
});

export const searchPatientsQuerySchema = z.object({
  q: z.string().trim().optional(),      // por nombre/apellido/email
  dni: z.string().trim().optional(),    // búsqueda directa por DNI
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  includeDeleted: z.coerce.boolean().optional(),
});
