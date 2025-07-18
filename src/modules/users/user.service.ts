import { Person, Prisma, User } from "@prisma/client";
import { prisma } from "../../config/db";
import { hashPassword } from "../../utils/hash";
import { registerUserSchema } from "./user.validation";
import AppError from "../../utils/appError";

interface RegisterServiceInput {
  email: string;
  password: string;
  roleId: number;
  person: {
    dni: string;
    firstName: string;
    lastName: string;
    birthDate?: Date | null;
    gender?: string | null;
    phoneNumber?: string | null;
    primaryEmail?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
    postalCode?: string | null;
  };
}

/**
 * Crea un nuevo usuario en el sistema
 * @param data - Datos del usuario y persona
 * @returns Promise<User> - Usuario creado
 * @throws AppError - 409 si email o DNI ya existen, 400 si hay error de validación
 */
export const createUser = async (data: RegisterServiceInput) => {
  try {
    const { email, password, roleId } = data;
    const personData = data.person;
    // Hashear la contraseña antes de guardar
    const hashedPassword = await hashPassword(password);
    let personId: number;
    //validamos si el email ya existe

    const existEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existEmail) {
      throw new AppError("El email ya está registrado", 409);
    }
    //validamos si el dni ya existe

    const existDni = await prisma.person.findUnique({
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
      const newPerson = await prisma.person.create({
        data: normalizedPersonData,
      });
      
      personId = newPerson.id;

    } else {
      // Si existe, usamos el ID de la persona existente
      personId = existDni.id;
    }

    // Creamos el usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId,
        personId, // Vinculamos el ID de la persona
      },
    });

    return newUser;
  } catch (error) {
    // Re-lanzar AppErrors existentes (ej. DNI duplicado de personService, email duplicado)
    if (error instanceof AppError) {
      throw error;
    }
    // Manejar errores específicos de Prisma que puedan ocurrir en este servicio
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003" && error.meta?.field_name === "roleId") {
        throw new AppError("El rol especificado no existe o es inválido.", 400);
      }
      // Si la transacción (si la implementas) falla por alguna razón no manejada
      // Esto es un catch-all para errores de DB no esperados
      throw new AppError("Error de base de datos al registrar usuario.", 500);
    }
    // Error genérico para cualquier otro tipo de error no esperado
    throw new AppError("Error interno del servidor al registrar usuario.", 500);
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        person: true, // Incluimos los datos de la persona
        role: true, // Incluimos el rol del usuario
      },
      orderBy: {
        createdAt: "desc", // Ordenar por fecha de creación
      },
    });

    return users;
  } catch (error) {
    // Manejar errores específicos de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new AppError("Error al obtener los usuarios", 500);
    }
    // Error genérico para cualquier otro tipo de error no esperado
    throw new AppError("Error interno del servidor al obtener usuarios.", 500);
  }
};

export const getUserById = async (id: number): Promise<User | null> => {
  try {
    if (!id || id <= 0) {
      throw new AppError("ID de usuario no válido", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        person: true, // Incluimos los datos de la persona
        role: true, // Incluimos el rol del usuario
      },
    });

    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    return user;
  } catch (error) {
    // Re-lanzar AppErrors existentes
    if (error instanceof AppError) {
      throw error;
    }
    // Error genérico para cualquier otro tipo de error no esperado
    throw new AppError("Error interno del servidor al obtener usuario.", 500);
  }
};
