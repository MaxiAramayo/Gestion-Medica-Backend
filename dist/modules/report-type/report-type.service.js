"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchReportTypes = exports.deleteReportType = exports.updateReportType = exports.getReportTypeById = exports.getAllReportTypes = exports.addReportType = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../../config/db");
const appError_1 = __importDefault(require("../../utils/appError"));
const normalizeName = (s) => s.trim().replace(/\s+/g, " ");
/**
 * Crear ReportType vinculado a un área
 */
const addReportType = async (data) => {
    try {
        const area = await db_1.prisma.medicalArea.findUnique({ where: { id: data.areaId } });
        if (!area)
            throw new appError_1.default("Área médica no encontrada", 404);
        const name = normalizeName(data.name);
        if (!name)
            throw new appError_1.default("El nombre es obligatorio", 400);
        // Unicidad por (areaId, name)
        const dup = await db_1.prisma.reportType.findFirst({
            where: { areaId: data.areaId, name }
        });
        if (dup)
            throw new appError_1.default("Ya existe un tipo de reporte con ese nombre en el área indicada", 409);
        const reportType = await db_1.prisma.reportType.create({
            data: {
                areaId: data.areaId,
                name,
                description: data.description ?? null
            }
        });
        return reportType;
    }
    catch (error) {
        if (error instanceof appError_1.default)
            throw error;
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2003") { // FK
                throw new appError_1.default("Área médica inválida", 400);
            }
            if (error.code === "P2002") { // unique
                throw new appError_1.default("Ya existe un tipo de reporte con ese nombre en el área indicada", 409);
            }
        }
        throw new appError_1.default("Error al crear el tipo de reporte", 500);
    }
};
exports.addReportType = addReportType;
/**
 * Listado (con filtro por área y paginación opcional)
 */
const getAllReportTypes = async (q) => {
    try {
        const where = {};
        if (q?.areaId)
            where.areaId = q.areaId;
        const page = Math.max(1, q?.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, q?.pageSize ?? 20));
        const skip = (page - 1) * pageSize;
        const [total, data] = await db_1.prisma.$transaction([
            db_1.prisma.reportType.count({ where }),
            db_1.prisma.reportType.findMany({
                where,
                orderBy: [{ areaId: "asc" }, { name: "asc" }],
                skip,
                take: pageSize
            })
        ]);
        return { data, total, page, pageSize };
    }
    catch {
        throw new appError_1.default("Error al obtener los tipos de reporte", 500);
    }
};
exports.getAllReportTypes = getAllReportTypes;
/**
 * Obtener por ID
 */
const getReportTypeById = async (id) => {
    try {
        const rt = await db_1.prisma.reportType.findUnique({ where: { id } });
        if (!rt)
            throw new appError_1.default("Tipo de reporte no encontrado", 404);
        return rt;
    }
    catch (error) {
        if (error instanceof appError_1.default)
            throw error;
        throw new appError_1.default("Error al obtener el tipo de reporte", 500);
    }
};
exports.getReportTypeById = getReportTypeById;
/**
 * Actualizar (parcial). Soporta cambio de nombre y/o de área (opcional).
 */
const updateReportType = async (id, data) => {
    try {
        const current = await db_1.prisma.reportType.findUnique({ where: { id } });
        if (!current)
            throw new appError_1.default("Tipo de reporte no encontrado", 404);
        const nextAreaId = data.areaId ?? current.areaId;
        if (data.areaId && data.areaId !== current.areaId) {
            const area = await db_1.prisma.medicalArea.findUnique({ where: { id: data.areaId } });
            if (!area)
                throw new appError_1.default("Área médica no encontrada", 404);
        }
        const nextName = data.name !== undefined ? normalizeName(data.name) : current.name;
        if (!nextName)
            throw new appError_1.default("El nombre no puede quedar vacío", 400);
        // Proteger unicidad por (areaId, name) si cambian
        if (nextAreaId !== current.areaId || nextName !== current.name) {
            const dup = await db_1.prisma.reportType.findFirst({
                where: {
                    areaId: nextAreaId,
                    name: nextName,
                    NOT: { id } // excluir el propio
                }
            });
            if (dup)
                throw new appError_1.default("Ya existe un tipo de reporte con ese nombre en el área indicada", 409);
        }
        const updated = await db_1.prisma.reportType.update({
            where: { id },
            data: {
                areaId: nextAreaId,
                name: nextName,
                description: data.description ?? current.description
            }
        });
        return updated;
    }
    catch (error) {
        if (error instanceof appError_1.default)
            throw error;
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new appError_1.default("Ya existe un tipo de reporte con ese nombre en el área indicada", 409);
            }
            if (error.code === "P2003") {
                throw new appError_1.default("Área médica inválida", 400);
            }
            if (error.code === "P2025") {
                throw new appError_1.default("Tipo de reporte no encontrado", 404);
            }
        }
        throw new appError_1.default("Error al actualizar el tipo de reporte", 500);
    }
};
exports.updateReportType = updateReportType;
/**
 * Eliminar (bloquea si hay FKs: templates o medical_reports)
 */
const deleteReportType = async (id) => {
    try {
        const current = await db_1.prisma.reportType.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { reportTemplates: true, medicalReports: true }
                }
            }
        });
        if (!current)
            throw new appError_1.default("Tipo de reporte no encontrado", 404);
        if (current._count.reportTemplates || current._count.medicalReports) {
            throw new appError_1.default("No se puede eliminar: el tipo de reporte está en uso (plantillas o informes existentes).", 409);
        }
        await db_1.prisma.reportType.delete({ where: { id } });
    }
    catch (error) {
        if (error instanceof appError_1.default)
            throw error;
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2003") {
                throw new appError_1.default("No se puede eliminar: el tipo de reporte está en uso por claves foráneas.", 409);
            }
            if (error.code === "P2025") {
                throw new appError_1.default("Tipo de reporte no encontrado", 404);
            }
        }
        throw new appError_1.default("Error al eliminar el tipo de reporte", 500);
    }
};
exports.deleteReportType = deleteReportType;
/**
 * Búsqueda por texto (opcionalmente filtrada por área) + orden
 */
const searchReportTypes = async (query, q) => {
    try {
        const term = (query ?? "").trim();
        if (!term)
            return { data: [], total: 0, page: 1, pageSize: q?.pageSize ?? 20 };
        const where = {
            AND: [
                q?.areaId ? { areaId: q.areaId } : {},
                {
                    OR: [
                        { name: { contains: term, mode: "insensitive" } },
                        { description: { contains: term, mode: "insensitive" } }
                    ]
                }
            ]
        };
        const page = Math.max(1, q?.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, q?.pageSize ?? 20));
        const skip = (page - 1) * pageSize;
        const [total, data] = await db_1.prisma.$transaction([
            db_1.prisma.reportType.count({ where }),
            db_1.prisma.reportType.findMany({
                where,
                orderBy: [{ areaId: "asc" }, { name: "asc" }],
                skip,
                take: pageSize
            })
        ]);
        return { data, total, page, pageSize };
    }
    catch {
        throw new appError_1.default("Error al buscar los tipos de reporte", 500);
    }
};
exports.searchReportTypes = searchReportTypes;
