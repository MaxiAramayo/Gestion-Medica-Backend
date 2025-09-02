"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../../config/db");
const hash_1 = require("../../utils/hash");
const appError_1 = __importDefault(require("../../utils/appError"));
/**
 * Crea un nuevo usuario en el sistema
 * @param data - Datos del usuario y persona
 * @returns Promise<User> - Usuario creado
 * @throws AppError - 409 si email o DNI ya existen, 400 si hay error de validación
 */
const createUser = async (data) => {
    try {
        const { email, password, roleId } = data;
        const personData = data.person;
        // Hashear la contraseña antes de guardar
        const hashedPassword = await (0, hash_1.hashPassword)(password);
        let personId;
        //validamos si el email ya existe
        const existEmail = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (existEmail) {
            throw new appError_1.default("El email ya está registrado", 409);
        }
        //validamos si el dni ya existe
        const existDni = await db_1.prisma.person.findUnique({
            where: { dni: personData.dni },
        });
        //si no existe a la persona
        if (!existDni) {
            // Creamos la persona
            // ✅ CONVERSIÓN EXPLÍCITA: undefined → null
            const normalizedPersonData = {
                dni: personData.dni,
                firstName: personData.firstName,
                lastName: personData.lastName,
                // Conversión explícita de undefined a null
                birthDate: personData.birthDate ?? null,
                gender: personData.gender ?? null,
                phoneNumber: personData.phoneNumber ?? null,
                primaryEmail: personData.primaryEmail ?? null,
                address: personData.address ?? null,
                city: personData.city ?? null,
                province: personData.province ?? null,
                country: personData.country ?? null,
                postalCode: personData.postalCode ?? null,
            };
            // almacenamos a la persona en la base de datos
            const newPerson = await db_1.prisma.person.create({
                data: normalizedPersonData,
            });
            personId = newPerson.id;
        }
        else {
            // Si existe, usamos el ID de la persona existente
            personId = existDni.id;
        }
        // Creamos el usuario
        const newUser = await db_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                roleId,
                personId, // Vinculamos el ID de la persona
            },
        });
        return newUser;
    }
    catch (error) {
        // Re-lanzar AppErrors existentes (ej. DNI duplicado de personService, email duplicado)
        if (error instanceof appError_1.default) {
            throw error;
        }
        // Manejar errores específicos de Prisma que puedan ocurrir en este servicio
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2003" && error.meta?.field_name === "roleId") {
                throw new appError_1.default("El rol especificado no existe o es inválido.", 400);
            }
            // Si la transacción (si la implementas) falla por alguna razón no manejada
            // Esto es un catch-all para errores de DB no esperados
            throw new appError_1.default("Error de base de datos al registrar usuario.", 500);
        }
        // Error genérico para cualquier otro tipo de error no esperado
        throw new appError_1.default("Error interno del servidor al registrar usuario.", 500);
    }
};
exports.createUser = createUser;
const getAllUsers = async () => {
    try {
        const users = await db_1.prisma.user.findMany({
            include: {
                person: true, // Incluimos los datos de la persona
                role: true, // Incluimos el rol del usuario
            },
            orderBy: {
                createdAt: "desc", // Ordenar por fecha de creación
            },
        });
        return users;
    }
    catch (error) {
        // Manejar errores específicos de Prisma
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            throw new appError_1.default("Error al obtener los usuarios", 500);
        }
        // Error genérico para cualquier otro tipo de error no esperado
        throw new appError_1.default("Error interno del servidor al obtener usuarios.", 500);
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    try {
        if (!id || id <= 0) {
            throw new appError_1.default("ID de usuario no válido", 400);
        }
        const user = await db_1.prisma.user.findUnique({
            where: { id },
            include: {
                person: true, // Incluimos los datos de la persona
                role: true, // Incluimos el rol del usuario
            },
        });
        if (!user) {
            throw new appError_1.default("Usuario no encontrado", 404);
        }
        return user;
    }
    catch (error) {
        // Re-lanzar AppErrors existentes
        if (error instanceof appError_1.default) {
            throw error;
        }
        // Error genérico para cualquier otro tipo de error no esperado
        throw new appError_1.default("Error interno del servidor al obtener usuario.", 500);
    }
};
exports.getUserById = getUserById;
