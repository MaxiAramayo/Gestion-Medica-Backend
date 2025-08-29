import { Prisma, Patient, Person } from "@prisma/client";
import { prisma } from "../../config/db";
import AppError from "../../utils/appError";

interface queryParams {
  firstName?: string;
  lastName?: string;
  dni?: string;
}

interface CreatePatientInput {
  socialSecurityProviderId?: number;
  affiliateNumber?: string | null;
  bloodGroup?: string | null;
  allergies?: string | null;
  preExistingConditions?: string | null;
  medications?: string | null;
}

export const searchPatients = async (query: queryParams): Promise<Person[]> => {
  try {
    const { firstName, lastName, dni } = query;
    // buscar personas y el paciente vinculado a ella

    const persons = await prisma.person.findMany({
      where: {
        OR: [
          { firstName: { contains: firstName, mode: "insensitive" } },
          { lastName: { contains: lastName, mode: "insensitive" } },
          { dni: { contains: dni, mode: "insensitive" } },
        ],
      },
      include: {
        patient: true,
      },
    });

    return persons;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al buscar pacientes", 500);
  }
};

export const createPatient = async (
  dataPatient: CreatePatientInput,
  personId: number
): Promise<Patient> => {
  try {
    // 1) Validar Person existe
    const person = await prisma.person.findUnique({ where: { id: personId } });
    if (!person) {
      throw new AppError("No existe una persona con este ID", 404);
    }

    // 2) Evitar duplicado: personId es unique en Patient
    const existing = await prisma.patient.findUnique({
      where: { personId } ,
    });
    if (existing) {
      throw new AppError("La persona ya está registrada como paciente", 409);
    }

    // Crear el paciente
    const patient = await prisma.patient.create({
      data: {
        personId,
        socialSecurityProviderId: dataPatient.socialSecurityProviderId ?? null,
        affiliateNumber: dataPatient.affiliateNumber ?? null,
        bloodGroup: dataPatient.bloodGroup ?? null,
        allergies: dataPatient.allergies ?? null,
        preExistingConditions: dataPatient.preExistingConditions ?? null,
        medications: dataPatient.medications ?? null,
      },
    });

    return patient;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al crear paciente", 500);
  }
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: Number(id) },
    });
    return patient;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al obtener paciente", 500);
  }
};

export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    const patients = await prisma.patient.findMany();
    return patients;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al obtener pacientes", 500);
  }
};

export const updatePatient = async (
  id: string,
  data: Partial<CreatePatientInput>
): Promise<Patient | null> => {
  try {
    const patient = await prisma.patient.update({
      where: { id: Number(id) },
      data,
    });
    return patient;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al actualizar paciente", 500);
  }
};
