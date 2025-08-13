import {z} from "zod"

export const reportTypeSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
});
