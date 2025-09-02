"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorSchema = void 0;
const zod_1 = require("zod");
exports.doctorSchema = zod_1.z.object({
    areaId: zod_1.z.number().int().positive(),
    name: zod_1.z.string().min(2).max(100),
    lastName: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().max(15).optional(),
});
