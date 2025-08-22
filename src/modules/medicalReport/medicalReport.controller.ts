import { Request, Response } from 'express';
import * as medicalReportService from './medicalReport.service';
import asyncHandler from '../../utils/asyncHandler';
import {
  createMedicalReportSchema,
  updateMedicalReportSchema,
  medicalReportFiltersSchema,
  paginationSchema,
  idParamSchema,
  searchReportsSchema,
} from './medicalReport.validation';

/**
 * Controlador para crear un nuevo reporte médico
 */
export const createMedicalReport = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validatedData = createMedicalReportSchema.parse(req.body);
    const medicalReport = await medicalReportService.createMedicalReport(validatedData);

    res.status(201).json({
      success: true,
      message: 'Reporte médico creado exitosamente',
      data: medicalReport,
    });
  }
);

/**
 * Controlador para obtener todos los reportes médicos con filtros y paginación
 */
export const getMedicalReports = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const filters = medicalReportFiltersSchema.parse(req.query);
    const pagination = paginationSchema.parse(req.query);
    const result = await medicalReportService.getAllMedicalReports(filters, pagination);

    res.json({
      success: true,
      message: 'Reportes médicos obtenidos exitosamente',
      data: result.data,
      pagination: result.pagination,
    });
  }
);

/**
 * Controlador para obtener un reporte médico por ID
 */
export const getMedicalReportById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    const medicalReport = await medicalReportService.getMedicalReportById(Number(id));

    res.json({
      success: true,
      message: 'Reporte médico obtenido exitosamente',
      data: medicalReport,
    });
  }
);

/**
 * Controlador para actualizar un reporte médico
 */
export const updateMedicalReport = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    const validatedData = updateMedicalReportSchema.parse(req.body);
    const medicalReport = await medicalReportService.updateMedicalReport(Number(id), validatedData);

    res.json({
      success: true,
      message: 'Reporte médico actualizado exitosamente',
      data: medicalReport,
    });
  }
);

/**
 * Controlador para eliminar un reporte médico
 */
export const deleteMedicalReport = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    await medicalReportService.deleteMedicalReport(Number(id));

    res.json({
      success: true,
      message: 'Reporte médico eliminado exitosamente',
    });
  }
);

/**
 * Controlador para buscar reportes médicos
 */
export const searchMedicalReports = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { query } = searchReportsSchema.parse(req.query);
    const result = await medicalReportService.searchMedicalReports(query || '');

    res.json({
      success: true,
      message: 'Búsqueda completada exitosamente',
      data: result,
    });
  }
);
