import { Request, Response } from "express";
import AppError from "../../utils/appError";

import * as reportTypeService from "./report-type.service";
import { reportTypeSchema } from "./report-type.validation";

export const addReportType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = reportTypeSchema.parse(req.body);
    const reportType = await reportTypeService.addReportType(validatedData);
    res.status(201).json({
      success: true,
      message: "tipo de reporte generado correctamente",
      data: reportType,
    });
  } catch (err) {
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

export const getReportTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reportTypes = await reportTypeService.getAllReportTypes();
    res.status(200).json({
      success: true,
      message: "Tipos de reporte obtenidos correctamente",
      data: reportTypes,
      count: reportTypes.length,
    });
  } catch (err) {
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

export const getReportTypeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const reportType = await reportTypeService.getReportTypeById(Number(id));

    if (!reportType) {
      throw new AppError("Tipo de reporte no encontrado", 404);
    }

    res.status(200).json({
      success: true,
      message: "Tipo de reporte obtenido correctamente",
      data: reportType,
    });
  } catch (err) {
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

export const updateReportType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = reportTypeSchema.parse(req.body);
    const reportType = await reportTypeService.updateReportType(
      Number(id),
      validatedData
    );

    if (!reportType) {
      throw new AppError("Tipo de reporte no encontrado", 404);
    }

    res.status(200).json({
      success: true,
      message: "Tipo de reporte actualizado correctamente",
      data: reportType,
    });
  } catch (err) {
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

export const deleteReportType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reportType = await reportTypeService.deleteReportType(Number(id));
  
    res.status(200).json({
      success: true,
      message: "Tipo de reporte eliminado correctamente",
      data: reportType,
    });
  } catch (err) {
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

export const searchReportTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    const reportTypes = await reportTypeService.searchReportTypes(query);
    
    if (!query || typeof query !== "string" || query.trim() === "") {
      throw new AppError("Parámetro de búsqueda inválido", 400);
    }

    res.status(200).json({
      success: true,
      message: "Tipos de reporte encontrados",
      data: reportTypes,
      count: reportTypes.length,
    });

  } catch (err) {
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
