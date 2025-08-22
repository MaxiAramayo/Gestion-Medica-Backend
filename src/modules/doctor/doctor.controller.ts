import {Request, Response} from "express";
import AppError from "../../utils/appError";

import * as doctorService from "./doctor.service";
import { createDoctorSchema } from "./doctor.validation";

export const createDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorData = req.body;

    if(doctorData.roleId != 1 ){
        throw new AppError("El usuario no es un doctor", 403);
    }

    const validatedData = createDoctorSchema.parse(doctorData);

    const newDoctor = await doctorService.createDoctor(validatedData);
    res.status(201).json({
        status: "success",
        message: "Doctor creado exitosamente",
        data: newDoctor
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const getDoctorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = req.params.id;

    const doctor = await doctorService.getDoctorById(doctorId);

    if (!doctor) {
      throw new AppError("Doctor no encontrado", 404);
    }

    res.status(200).json({
      status: "success",
      data: doctor,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};


export const getDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await doctorService.getDoctors();

    if (!doctors || doctors.length === 0) {
      throw new AppError("No hay doctores registrados", 404);
    }

    res.status(200).json({
      status: "success",
      data: doctors,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const updateDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = req.params.id;
    const doctorData = req.body;

    const validatedData = createDoctorSchema.parse(doctorData);

    const updatedDoctor = await doctorService.updateDoctor(doctorId, validatedData);
    if (!updatedDoctor) {
      throw new AppError("Doctor no encontrado", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Doctor actualizado exitosamente",
      data: updatedDoctor,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const deleteDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = req.params.id;

    const deletedDoctor = await doctorService.deleteDoctor(doctorId);
    if (!deletedDoctor) {
      throw new AppError("Doctor no encontrado", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Doctor eliminado exitosamente",
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};