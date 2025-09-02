"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdParamSchema = exports.updateUserSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
// Esquema específico para registro de usuario - solo campos mínimos requeridos
const createPersonSchemaForUser = zod_1.z.object({
    // Campos OBLIGATORIOS
    dni: zod_1.z.string().min(7, "El DNI debe tener al menos 7 caracteres").max(20, "El DNI no debe exceder los 20 caracteres"),
    firstName: zod_1.z.string().min(1, "El nombre es obligatorio").max(100, "El nombre no debe exceder los 100 caracteres"),
    lastName: zod_1.z.string().min(1, "El apellido es obligatorio").max(100, "El apellido no debe exceder los 100 caracteres"),
    // Campos OPCIONALES - pueden ser omitidos o null
    birthDate: zod_1.z.string().pipe(zod_1.z.coerce.date()).nullable().optional(),
    gender: zod_1.z.string().nullable().optional(),
    phoneNumber: zod_1.z.string().nullable().optional(),
    primaryEmail: zod_1.z.string().email("Formato de email inválido").nullable().optional(),
    address: zod_1.z.string().nullable().optional(),
    city: zod_1.z.string().nullable().optional(),
    province: zod_1.z.string().nullable().optional(),
    country: zod_1.z.string().nullable().optional(),
    postalCode: zod_1.z.string().nullable().optional(),
});
// Esquema para el registro de un nuevo usuario
exports.registerUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Formato de email inválido"),
    password: zod_1.z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número"),
    roleId: zod_1.z.number().int().positive("El ID del rol debe ser un número entero positivo"),
    person: createPersonSchemaForUser
});
// Esquema para login
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Formato de email inválido"),
    password: zod_1.z.string().min(1, "La contraseña es requerida")
});
// Esquema para actualizar usuario (todos opcionales)
exports.updateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Formato de email inválido").optional(),
    password: zod_1.z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número")
        .optional(),
    roleId: zod_1.z.number().int().positive("El ID del rol debe ser un número entero positivo").optional(),
    isActive: zod_1.z.boolean().optional()
});
// Esquema para buscar usuarios por id
exports.userIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().refine((val) => {
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
    }, {
        message: "El ID debe ser un número entero positivo"
    })
});
