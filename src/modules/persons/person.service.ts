import { Person, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";
import AppError from "../../utils/appError";

/**
 * Servicio para manejar operaciones relacionadas con personas
 * Incluye operaciones CRUD y búsqueda de personas
 */

// Tipo específico para crear persona que coincide con Zod
interface CreatePersonInput {
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
}

/**
 * Crea una nueva persona en la base de datos
 * @param data - Datos de la persona sin id, createdAt y updatedAt
 * @returns Promise<Person> - La persona creada
 * @throws AppError - 400 si hay error de validación, 409 si el DNI ya existe
 */
export const addPerson = async (data: CreatePersonInput): Promise<Person> => {
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

    const newPerson = await prisma.person.create({
      data: normalizedData,
    });

    return newPerson;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError("Una persona con este DNI ya existe", 409);
      }
    }
    throw new AppError("Error al crear la persona", 500);
  }
};

/**
 * Obtiene todas las personas de la base de datos
 * @returns Promise<Person[]> - Array de todas las personas
 * @throws AppError - 500 si hay error interno del servidor
 */
export const getAllPersons = async (): Promise<Person[]> => {
  try {
    return await prisma.person.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al obtener las personas", 500);
  }
};

/**
 * Obtiene una persona por su ID
 * @param id - ID de la persona a buscar
 * @returns Promise<Person | null> - La persona encontrada o null si no existe
 * @throws AppError - 400 si el ID no es válido, 404 si no se encuentra
 */
export const getPersonById = async (id: number): Promise<Person | null> => {
  try {
    if (!id || id <= 0) {
      throw new AppError("ID de persona no válido", 400);
    }

    const person = await prisma.person.findUnique({
      where: { id },
    });

    if (!person) {
      throw new AppError("Persona no encontrada", 404);
    }

    return person;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al obtener la persona", 500);
  }
};

/**
 * Actualiza una persona existente
 * @param id - ID de la persona a actualizar
 * @param data - Datos parciales de la persona a actualizar
 * @returns Promise<Person> - La persona actualizada
 * @throws AppError - 400 si los datos no son válidos, 404 si no se encuentra, 409 si hay conflicto de DNI
 */
export const updatePerson = async (
  id: number,
  data: Partial<CreatePersonInput>
): Promise<Person> => {
  try {
    if (!id || id <= 0) {
      throw new AppError("ID de persona no válido", 400);
    }

    // Verificar que la persona existe
    const existingPerson = await prisma.person.findUnique({
      where: { id },
    });

    if (!existingPerson) {
      throw new AppError("Persona no encontrada", 404);
    }

    // ✅ CONVERSIÓN EXPLÍCITA: undefined → null para campos actualizados
    const normalizedData: any = {};
    
    if (data.dni !== undefined) normalizedData.dni = data.dni;
    if (data.firstName !== undefined) normalizedData.firstName = data.firstName;
    if (data.lastName !== undefined) normalizedData.lastName = data.lastName;
    if (data.birthDate !== undefined) normalizedData.birthDate = data.birthDate ?? null;
    if (data.gender !== undefined) normalizedData.gender = data.gender ?? null;
    if (data.phoneNumber !== undefined) normalizedData.phoneNumber = data.phoneNumber ?? null;
    if (data.primaryEmail !== undefined) normalizedData.primaryEmail = data.primaryEmail ?? null;
    if (data.address !== undefined) normalizedData.address = data.address ?? null;
    if (data.city !== undefined) normalizedData.city = data.city ?? null;
    if (data.province !== undefined) normalizedData.province = data.province ?? null;
    if (data.country !== undefined) normalizedData.country = data.country ?? null;
    if (data.postalCode !== undefined) normalizedData.postalCode = data.postalCode ?? null;

    return await prisma.person.update({
      where: { id },
      data: normalizedData,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError("Ya existe una persona con este DNI", 409);
      }
      if (error.code === "P2025") {
        throw new AppError("Persona no encontrada", 404);
      }
    }
    throw new AppError("Error al actualizar la persona", 500);
  }
};

/**
 * Elimina una persona de la base de datos
 * @param id - ID de la persona a eliminar
 * @returns Promise<Person> - La persona eliminada
 * @throws AppError - 400 si el ID no es válido, 404 si no se encuentra, 409 si hay dependencias
 */
export const deletePerson = async (id: number): Promise<Person> => {
  try {
    if (!id || id <= 0) {
      throw new AppError("ID de persona no válido", 400);
    }

    // Verificar que la persona existe
    const existingPerson = await prisma.person.findUnique({
      where: { id },
    });

    if (!existingPerson) {
      throw new AppError("Persona no encontrada", 404);
    }

    return await prisma.person.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new AppError("Persona no encontrada", 404);
      }
      if (error.code === "P2003") {
        throw new AppError(
          "No se puede eliminar la persona porque tiene dependencias asociadas",
          409
        );
      }
    }
    throw new AppError("Error al eliminar la persona", 500);
  }
};

/**
 * Busca personas por nombre, apellido o DNI
 * @param query - Término de búsqueda
 * @returns Promise<Person[]> - Array de personas que coinciden con la búsqueda
 * @throws AppError - 400 si el query está vacío, 500 si hay error interno
 */
export const searchPersons = async (query: string): Promise<Person[]> => {
  try {
    if (!query || query.trim().length === 0) {
      throw new AppError("El término de búsqueda no puede estar vacío", 400);
    }

    const searchTerm = query.trim();

    return await prisma.person.findMany({
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
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al buscar personas", 500);
  }
};
