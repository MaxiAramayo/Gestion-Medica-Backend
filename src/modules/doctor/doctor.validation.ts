import {z} from "zod"

export const createDoctorSchema = z.object({
  personId: z.number().min(1),
  licenseNumber: z.string().min(5).max(50),
  doctorAreaId: z.number().min(1),
});

export const updateDoctorSchema = z.object({
  personId: z.number().min(1).optional(),
  licenseNumber: z.string().min(5).max(50).optional(),
  doctorAreaId: z.number().min(1).optional(),
});
