"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPersons = exports.deletePerson = exports.updatePerson = exports.getPersonById = exports.getAllPersons = exports.addPerson = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../../config/db");
const appError_1 = __importDefault(require("../../utils/appError"));
/**
 * Crea una nueva persona en la base de datos
 * @param data - Datos de la persona sin id, createdAt y updatedAt
 * @returns Promise<Person> - La persona creada
 * @throws AppError - 400 si hay error de validación, 409 si el DNI ya existe
 */
const addPerson = async (data) => {
    try {
        // ✅ CONVERSIÓN EXPLÍCITA: undefined → null
        const normalizedData = {
            dni: data.dni,
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: data.birthDate ?? null,
            gender: data.gender ?? null,
            phoneNumber: data.phoneNumber ?? null,
            primaryEmail: data.primaryEmail ?? null,
            address: data.address ?? null,
            city: data.city ?? null,
            province: data.province ?? null,
            country: data.country ?? null,
            postalCode: data.postalCode ?? null,
        };
        const newPerson = await db_1.prisma.person.create({
            data: normalizedData,
        });
        return newPerson;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new appError_1.default("Una persona con este DNI ya existe", 409);
            }
        }
        throw new appError_1.default("Error al crear la persona", 500);
    }
};
exports.addPerson = addPerson;
/**
 * Obtiene todas las personas de la base de datos
 * @returns Promise<Person[]> - Array de todas las personas
 * @throws AppError - 500 si hay error interno del servidor
 */
const getAllPersons = async () => {
    try {
        return await db_1.prisma.person.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    catch (error) {
        throw new appError_1.default("Error al obtener las personas", 500);
    }
};
exports.getAllPersons = getAllPersons;
/**
 * Obtiene una persona por su ID
 * @param id - ID de la persona a buscar
 * @returns Promise<Person | null> - La persona encontrada o null si no existe
 * @throws AppError - 400 si el ID no es válido, 404 si no se encuentra
 */
const getPersonById = async (id) => {
    try {
        if (!id || id <= 0) {
            throw new appError_1.default("ID de persona no válido", 400);
        }
        const person = await db_1.prisma.person.findUnique({
            where: { id },
        });
        if (!person) {
            throw new appError_1.default("Persona no encontrada", 404);
        }
        return person;
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            throw error;
        }
        throw new appError_1.default("Error al obtener la persona", 500);
    }
};
exports.getPersonById = getPersonById;
/**
 * Actualiza una persona existente
 * @param id - ID de la persona a actualizar
 * @param data - Datos parciales de la persona a actualizar
 * @returns Promise<Person> - La persona actualizada
 * @throws AppError - 400 si los datos no son válidos, 404 si no se encuentra, 409 si hay conflicto de DNI
 */
const updatePerson = async (id, data) => {
    try {
        if (!id || id <= 0) {
            throw new appError_1.default("ID de persona no válido", 400);
        }
        // Verificar que la persona existe
        const existingPerson = await db_1.prisma.person.findUnique({
            where: { id },
        });
        if (!existingPerson) {
            throw new appError_1.default("Persona no encontrada", 404);
        }
        // ✅ CONVERSIÓN EXPLÍCITA: undefined → null para campos actualizados
        const normalizedData = {};
        if (data.dni !== undefined)
            normalizedData.dni = data.dni;
        if (data.firstName !== undefined)
            normalizedData.firstName = data.firstName;
        if (data.lastName !== undefined)
            normalizedData.lastName = data.lastName;
        if (data.birthDate !== undefined)
            normalizedData.birthDate = data.birthDate ?? null;
        if (data.gender !== undefined)
            normalizedData.gender = data.gender ?? null;
        if (data.phoneNumber !== undefined)
            normalizedData.phoneNumber = data.phoneNumber ?? null;
        if (data.primaryEmail !== undefined)
            normalizedData.primaryEmail = data.primaryEmail ?? null;
        if (data.address !== undefined)
            normalizedData.address = data.address ?? null;
        if (data.city !== undefined)
            normalizedData.city = data.city ?? null;
        if (data.province !== undefined)
            normalizedData.province = data.province ?? null;
        if (data.country !== undefined)
            normalizedData.country = data.country ?? null;
        if (data.postalCode !== undefined)
            normalizedData.postalCode = data.postalCode ?? null;
        return await db_1.prisma.person.update({
            where: { id },
            data: normalizedData,
        });
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            throw error;
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new appError_1.default("Ya existe una persona con este DNI", 409);
            }
            if (error.code === "P2025") {
                throw new appError_1.default("Persona no encontrada", 404);
            }
        }
        throw new appError_1.default("Error al actualizar la persona", 500);
    }
};
exports.updatePerson = updatePerson;
/**
 * Elimina una persona de la base de datos
 * @param id - ID de la persona a eliminar
 * @returns Promise<Person> - La persona eliminada
 * @throws AppError - 400 si el ID no es válido, 404 si no se encuentra, 409 si hay dependencias
 */
const deletePerson = async (id) => {
    try {
        if (!id || id <= 0) {
            throw new appError_1.default("ID de persona no válido", 400);
        }
        // Verificar que la persona existe
        const existingPerson = await db_1.prisma.person.findUnique({
            where: { id },
        });
        if (!existingPerson) {
            throw new appError_1.default("Persona no encontrada", 404);
        }
        return await db_1.prisma.person.delete({
            where: { id },
        });
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            throw error;
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                throw new appError_1.default("Persona no encontrada", 404);
            }
            if (error.code === "P2003") {
                throw new appError_1.default("No se puede eliminar la persona porque tiene dependencias asociadas", 409);
            }
        }
        throw new appError_1.default("Error al eliminar la persona", 500);
    }
};
exports.deletePerson = deletePerson;
/**
 * Busca personas por nombre, apellido o DNI
 * @param query - Término de búsqueda
 * @returns Promise<Person[]> - Array de personas que coinciden con la búsqueda
 * @throws AppError - 400 si el query está vacío, 500 si hay error interno
 */
const searchPersons = async (query) => {
    try {
        if (!query || query.trim().length === 0) {
            throw new appError_1.default("El término de búsqueda no puede estar vacío", 400);
        }
        const searchTerm = query.trim();
        return await db_1.prisma.person.findMany({
            where: {
                OR: [
                    { firstName: { contains: searchTerm, mode: "insensitive" } },
                    { lastName: { contains: searchTerm, mode: "insensitive" } },
                    { dni: { contains: searchTerm, mode: "insensitive" } },
                    { primaryEmail: { contains: searchTerm, mode: "insensitive" } },
                ],
            },
            orderBy: {
                lastName: "asc",
            },
        });
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            throw error;
        }
        throw new appError_1.default("Error al buscar personas", 500);
    }
};
exports.searchPersons = searchPersons;
