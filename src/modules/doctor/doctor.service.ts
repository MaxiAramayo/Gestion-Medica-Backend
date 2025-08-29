import {Prisma, DoctorDetails } from "@prisma/client";
import {prisma} from "../../config/db";
import AppError from "../../utils/appError";

export interface DoctorInput {
  personId: number;
  licenseNumber: string;
  doctorAreaId: number;
}

export const createDoctor = async (data: DoctorInput): Promise<DoctorDetails> => {
  try {
    const newDoctor = {
      personId: data.personId,
      licenseNumber: data.licenseNumber,
      doctorAreaId: data.doctorAreaId,
    };

    const createdDoctor = await prisma.doctorDetails.create({
      data: newDoctor,
    });

    return createdDoctor;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al crear el doctor", 500);
  }
};

export const getDoctorById = async (id: string): Promise<DoctorDetails | null> => {
  try {
    const doctor = await prisma.doctorDetails.findUnique({
      where: { id: Number(id) },
    });
    return doctor;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al obtener el doctor", 500);
  }
};

export const getDoctors = async (): Promise<DoctorDetails[]> => {
  try {
    const doctors = await prisma.doctorDetails.findMany();
    return doctors;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al obtener los doctores", 500);
  }
};

export const deleteDoctor = async (id: string): Promise<DoctorDetails | null> => {
  try {
    const existingDoctor = await prisma.doctorDetails.findUnique({
      where: { id: Number(id) },
    });

    if (!existingDoctor) {
      throw new AppError("Doctor no encontrado", 404);
    }

    // desactivarlo
    const doctorDeleted = await prisma.doctorDetails.update({
      where: { id: Number(id) },
      data: { isActive: false },
    });

    return doctorDeleted;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al eliminar el doctor", 500);
  }
};

export const updateDoctor = async (id: string, data: DoctorInput): Promise<DoctorDetails | null> => {
  try {

    const updatedDoctor = await prisma.doctorDetails.update({
      where: { id: Number(id) },
      data: { ...data },
    });

    return updatedDoctor;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al actualizar el doctor", 500);
  }
};