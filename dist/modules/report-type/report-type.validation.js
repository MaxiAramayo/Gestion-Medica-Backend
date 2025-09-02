"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportTypeUpdateSchema = exports.reportTypeSchema = void 0;
const zod_1 = require("zod");
exports.reportTypeSchema = zod_1.z.object({
    areaId: zod_1.z.number().int().positive(),
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().max(500).optional(),
});
// Para UPDATE: todos opcionales (parcial)
exports.reportTypeUpdateSchema = zod_1.z.object({
    areaId: zod_1.z.number().int().positive().optional(),
    name: zod_1.z.string().trim().min(1).optional(),
    description: zod_1.z.string().trim().optional().nullable(),
});
