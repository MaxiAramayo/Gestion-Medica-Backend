"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedicalAreaSchema = exports.createMedicalAreaSchema = void 0;
const zod_1 = require("zod");
exports.createMedicalAreaSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "El nombre del área médica es obligatorio").max(100, "El nombre no debe exceder los 100 caracteres"),
    description: zod_1.z.string().max(500, "La descripción no debe exceder los 500 caracteres").optional(),
});
exports.updateMedicalAreaSchema = exports.createMedicalAreaSchema.partial();
