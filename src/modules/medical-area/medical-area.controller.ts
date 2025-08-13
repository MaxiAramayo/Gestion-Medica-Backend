import { Request, Response } from "express";
import AppError from "../../utils/appError";
import {
  createMedicalAreaSchema,
} from "./medical-area.validation";
import * as medicalAreaService from "./medical-area.service";

export const getMedicalAreas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const medicalAreas = await medicalAreaService.getAllMedicalAreas();
    res.status(200).json({
      success: true,
      message: "Áreas médicas obtenidas exitosamente",
      data: medicalAreas,
      count: medicalAreas.length,
    });
  } catch (err: any) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const addMedicalArea = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = createMedicalAreaSchema.parse(req.body);
    const medicalArea = await medicalAreaService.addMedicalArea(validatedData);

    res.status(201).json({
      success: true,
      message: "Área médica creada exitosamente",
      data: medicalArea,
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

export const getMedicalAreaById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      throw new AppError("ID de área médica inválido", 400);
    }

    const medicalArea = await medicalAreaService.getMedicalAreaById(Number(id));

    res.status(200).json({
      success: true,
      message: "Área médica obtenida exitosamente",
      data: medicalArea,
    });
  } catch (err: any) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const updateMedicalArea = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      throw new AppError("ID de área médica inválido", 400);
    }

    const validatedData = createMedicalAreaSchema.parse(req.body);

    const updatedMedicalArea = await medicalAreaService.updateMedicalArea(
      Number(id),
      validatedData
    );

    res.status(200).json({
      success: true,
      message: "Área médica actualizada exitosamente",
      data: updatedMedicalArea,
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({
        success: false,
        message: "Datos inválidos",
        errors: err.errors,
      });
      return;
    }

    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const deleteMedicalArea = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      throw new AppError("ID de área médica inválido", 400);
    }

    await medicalAreaService.deleteMedicalArea(Number(id));

    res.status(200).json({
      success: true,
      message: "Área médica eliminada exitosamente",
    });
  } catch (err: any) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

export const searchMedicalAreas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string" || query.trim() === "") {
      throw new AppError("Parámetro de búsqueda inválido", 400);
    }

    const medicalAreas = await medicalAreaService.searchMedicalAreas(
      query.trim()
    );

    res.status(200).json({
      success: true,
      message: "Búsqueda de áreas médicas exitosa",
      data: medicalAreas,
      count: medicalAreas.length,
    });
  } catch (err: any) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

