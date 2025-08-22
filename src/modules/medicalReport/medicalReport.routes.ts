import { Router } from "express";
import {
  createMedicalReport,
  getMedicalReports,
  getMedicalReportById,
  updateMedicalReport,
  deleteMedicalReport,
  searchMedicalReports
} from "./medicalReport.controller";
import { requireAuth, requireRole } from "../../middlewares/authMiddlerware";

const router = Router();

/**
 * Rutas simplificadas para reportes médicos
 * Solo operaciones CRUD básicas, sin estadísticas ni gestión compleja de imágenes
 */

/**
 * @route   POST /api/medical-reports
 * @desc    Crear un nuevo reporte médico con imágenes opcionales
 * @access  Privado (Doctores y Admins)
 */
router.post("/", requireAuth, requireRole(['doctor', 'admin']), createMedicalReport);

/**
 * @route   GET /api/medical-reports
 * @desc    Obtener todos los reportes médicos con filtros y paginación
 * @access  Privado (Todos los usuarios autenticados)
 */
router.get("/", requireAuth, getMedicalReports);

/**
 * @route   GET /api/medical-reports/search
 * @desc    Buscar reportes médicos por término
 * @access  Privado (Todos los usuarios autenticados)
 */
router.get("/search", requireAuth, searchMedicalReports);

/**
 * @route   GET /api/medical-reports/:id
 * @desc    Obtener un reporte médico por ID (incluye imágenes automáticamente)
 * @access  Privado (Todos los usuarios autenticados)
 */
router.get("/:id", requireAuth, getMedicalReportById);

/**
 * @route   PUT /api/medical-reports/:id
 * @desc    Actualizar un reporte médico existente
 * @access  Privado (Doctor propietario o Admin)
 */
router.put("/:id", requireAuth, updateMedicalReport);

/**
 * @route   DELETE /api/medical-reports/:id
 * @desc    Eliminar un reporte médico
 * @access  Privado (Doctor propietario o Admin)
 */
router.delete("/:id", requireAuth, deleteMedicalReport);

export default router;
