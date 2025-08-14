import { Request, Response } from "express";
import AppError from "../../utils/appError";

import * as reportTypeService from "./report-type.service";
import { reportTypeSchema, reportTypeUpdateSchema } from "./report-type.validation";

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
      count: reportTypes.data.length, 
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

export const updateReportType = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError("ID inválido", 400);
    }

    // Usar el schema parcial para update
    const validatedData = reportTypeUpdateSchema.parse(req.body);

    const reportType = await reportTypeService.updateReportType(id, validatedData);

    res.status(200).json({
      success: true,
      message: "Tipo de reporte actualizado correctamente",
      data: reportType,
    });
  } catch (err: any) {
    if (err) {
      res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: err.flatten(),
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
    const { query, areaId, page, pageSize } = req.query;

    if (!query || typeof query !== "string" || query.trim() === "") {
          throw new AppError("Parámetro de búsqueda inválido", 400);
        }

    const reportTypes = await reportTypeService.searchReportTypes(
      String(query),
      {
        areaId: areaId ? Number(areaId) : undefined,
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined
      }
    );
    
    

    res.status(200).json({
      success: true,
      message: "Tipos de reporte encontrados",
      data: reportTypes,
      count: reportTypes.data.length,
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
