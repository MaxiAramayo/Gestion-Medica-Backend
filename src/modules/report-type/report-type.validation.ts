import {z} from "zod"

export const reportTypeSchema = z.object({
    areaId: z.number().int().positive(),
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
});

// Para UPDATE: todos opcionales (parcial)
export const reportTypeUpdateSchema = z.object({
  areaId: z.number().int().positive().optional(),
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().optional().nullable(),
});