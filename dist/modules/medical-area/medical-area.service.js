"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMedicalAreas = exports.deleteMedicalArea = exports.updateMedicalArea = exports.getMedicalAreaById = exports.getAllMedicalAreas = exports.addMedicalArea = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../../config/db");
const appError_1 = __importDefault(require("../../utils/appError"));
/**
 * Crea un nuevo área médica en la base de datos
 * @param data - Datos del área médica
 * @returns Promise<MedicalArea> - El área médica creada
 * @throws AppError - 400 si hay error de validación, 409 si el nombre ya existe
 */
const addMedicalArea = async (data) => {
    try {
        // Validar que el nombre no exista
        const existingArea = await db_1.prisma.medicalArea.findUnique({
            where: { name: data.name },
        });
        if (existingArea) {
            throw new appError_1.default("Ya existe un área médica con este nombre", 409);
        }
        const newMedicalArea = await db_1.prisma.medicalArea.create({
            data: {
                name: data.name,
                description: data.description ?? null,
            },
        });
        return newMedicalArea;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new appError_1.default("Ya existe un área médica con este nombre", 409);
            }
        }
        throw new appError_1.default("Error al crear el área médica", 500);
    }
};
exports.addMedicalArea = addMedicalArea;
const getAllMedicalAreas = async () => {
    try {
        const medicalAreas = await db_1.prisma.medicalArea.findMany();
        return medicalAreas;
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            throw error;
        }
        throw new appError_1.default("Error al obtener las áreas médicas", 500);
    }
};
exports.getAllMedicalAreas = getAllMedicalAreas;
/**
 * Obtiene un área médica por su ID
 * @param id - ID del área médica
 * @returns Promise<MedicalArea | null> - El área médica encontrada o null si no existe
 * @throws AppError - 400 si el ID es inválido
 */
const getMedicalAreaById = async (id) => {
    try {
        if (!id || id <= 0) {
            throw new appError_1.default("ID de área médica no válido", 400);
        }
        const medicalArea = await db_1.prisma.medicalArea.findUnique({
            where: { id },
        });
        if (!medicalArea) {
            throw new appError_1.default("Área médica no encontrada", 404);
        }
        return medicalArea;
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            throw error;
        }
        throw new appError_1.default("Error al obtener el área médica", 500);
    }
};
exports.getMedicalAreaById = getMedicalAreaById;
const updateMedicalArea = async (id, data) => {
    try {
        const existingArea = await db_1.prisma.medicalArea.findUnique({
            where: { id },
        });
        if (!existingArea) {
            throw new appError_1.default("Área médica no encontrada", 404);
        }
        const updatedMedicalArea = await db_1.prisma.medicalArea.update({
            where: { id },
            data: {
                name: data.name ?? existingArea.name,
                description: data.description ?? existingArea.description,
            },
        });
        return updatedMedicalArea;
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            throw error;
        }
        throw new appError_1.default("Error al actualizar el área médica", 500);
    }
};
exports.updateMedicalArea = updateMedicalArea;
const deleteMedicalArea = async (id) => {
    try {
        const existingArea = await db_1.prisma.medicalArea.findUnique({
            where: { id },
        });
        if (!existingArea) {
            throw new appError_1.default("Área médica no encontrada", 404);
        }
        await db_1.prisma.medicalArea.delete({
            where: { id },
        });
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            throw error;
        }
        throw new appError_1.default("Error al eliminar el área médica", 500);
    }
};
exports.deleteMedicalArea = deleteMedicalArea;
const searchMedicalAreas = async (query) => {
    try {
        const medicalAreas = await db_1.prisma.medicalArea.findMany({
            where: {
                name: {
                    contains: query,
                    mode: "insensitive", // Búsqueda insensible a mayúsculas/minúsculas
                },
            },
            orderBy: {
                name: "asc", // Ordenar alfabéticamente por nombre
            },
        });
        return medicalAreas;
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            throw error;
        }
        throw new appError_1.default("Error al buscar áreas médicas", 500);
    }
};
exports.searchMedicalAreas = searchMedicalAreas;
