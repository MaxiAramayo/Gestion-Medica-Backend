import {Prisma, MedicalArea} from "@prisma/client";
import {prisma} from "../../config/db";
import AppError from "../../utils/appError";

interface CreateMedicalAreaInput {
  name: string;
  description?: string | null;
}

interface UpdateMedicalAreaInput {
  name?: string;
  description?: string | null;
}

/**
 * Crea un nuevo área médica en la base de datos
 * @param data - Datos del área médica
 * @returns Promise<MedicalArea> - El área médica creada
 * @throws AppError - 400 si hay error de validación, 409 si el nombre ya existe
 */
export const addMedicalArea = async (data: CreateMedicalAreaInput): Promise<MedicalArea> => {
  try {

    // Validar que el nombre no exista
    const existingArea = await prisma.medicalArea.findUnique({
      where: { name: data.name },
    });

    if (existingArea) {
      throw new AppError("Ya existe un área médica con este nombre", 409);
    }

    const newMedicalArea = await prisma.medicalArea.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });
    return newMedicalArea;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new AppError("Ya existe un área médica con este nombre", 409);
      }
    }
    throw new AppError("Error al crear el área médica", 500);
  }
};


export const getAllMedicalAreas = async (): Promise<MedicalArea[]> => {
  try {
    const medicalAreas = await prisma.medicalArea.findMany();
    return medicalAreas;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al obtener las áreas médicas", 500);
  }
};


/**
 * Obtiene un área médica por su ID
 * @param id - ID del área médica
 * @returns Promise<MedicalArea | null> - El área médica encontrada o null si no existe
 * @throws AppError - 400 si el ID es inválido
 */
export const getMedicalAreaById = async (id: number): Promise<MedicalArea | null> => {
  try {
    if (!id || id <= 0) {
      throw new AppError("ID de área médica no válido", 400);
    }

    const medicalArea = await prisma.medicalArea.findUnique({
      where: { id },
    });

    if (!medicalArea) {
      throw new AppError("Área médica no encontrada", 404);
    }

    return medicalArea;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al obtener el área médica", 500);
  }
};


export const updateMedicalArea = async (
  id: number,
    data: UpdateMedicalAreaInput
): Promise<MedicalArea> => {
  try {

    const existingArea = await prisma.medicalArea.findUnique({
      where: { id },
    });

    if (!existingArea) {
      throw new AppError("Área médica no encontrada", 404);
    }

    const updatedMedicalArea = await prisma.medicalArea.update({
      where: { id },
      data: {
        name: data.name ?? existingArea.name,
        description: data.description ?? existingArea.description,
      },
    });

    return updatedMedicalArea;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al actualizar el área médica", 500);
  }
};

export const deleteMedicalArea = async (id: number): Promise<void> => {
  try {
    const existingArea = await prisma.medicalArea.findUnique({
      where: { id },
    });

    if (!existingArea) {
      throw new AppError("Área médica no encontrada", 404);
    }

    await prisma.medicalArea.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al eliminar el área médica", 500);
  }
};

export const searchMedicalAreas = async (query: string): Promise<MedicalArea[]> => {
  try {
    const medicalAreas = await prisma.medicalArea.findMany({
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
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al buscar áreas médicas", 500);
  }
};