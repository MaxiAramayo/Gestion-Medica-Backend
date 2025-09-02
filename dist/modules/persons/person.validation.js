"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchQuerySchema = exports.idParamSchema = exports.updatePersonSchema = exports.createPersonSchema = void 0;
const zod_1 = require("zod");
// Esquema para crear persona - solo campos obligatorios son required
exports.createPersonSchema = zod_1.z.object({
    // Campos OBLIGATORIOS
    dni: zod_1.z.string().min(7, "El DNI debe tener al menos 7 caracteres").max(20, "El DNI no debe exceder los 20 caracteres"),
    firstName: zod_1.z.string().min(1, "El nombre es obligatorio").max(100, "El nombre no debe exceder los 100 caracteres"),
    lastName: zod_1.z.string().min(1, "El apellido es obligatorio").max(100, "El apellido no debe exceder los 100 caracteres"),
    // Campos OPCIONALES - solo nullable, sin .optional()
    birthDate: zod_1.z.string().pipe(zod_1.z.coerce.date()).nullable(),
    gender: zod_1.z.string().nullable(),
    phoneNumber: zod_1.z.string().nullable(),
    primaryEmail: zod_1.z.string().email("Formato de email inválido").nullable(),
    address: zod_1.z.string().nullable(),
    city: zod_1.z.string().nullable(),
    province: zod_1.z.string().nullable(),
    country: zod_1.z.string().nullable(),
    postalCode: zod_1.z.string().nullable(),
});
// Para update, todos son opcionales
exports.updatePersonSchema = exports.createPersonSchema.partial();
// Esquema para validar parámetros de ID
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().refine((val) => {
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
    }, {
        message: "El ID debe ser un número entero positivo"
    })
});
// Esquema para validar query de búsqueda
exports.searchQuerySchema = zod_1.z.object({
    query: zod_1.z.string()
        .min(1, "El término de búsqueda no puede estar vacío")
        .max(100, "El término de búsqueda no debe exceder los 100 caracteres")
        .optional()
});
