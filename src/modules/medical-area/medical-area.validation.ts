import {z} from 'zod';

export const createMedicalAreaSchema = z.object({
  name: z.string().min(1, "El nombre del área médica es obligatorio").max(100, "El nombre no debe exceder los 100 caracteres"),
  description: z.string().max(500, "La descripción no debe exceder los 500 caracteres").optional(),
});

export const updateMedicalAreaSchema = createMedicalAreaSchema.partial();

