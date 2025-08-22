import { Router } from "express";
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  searchPatients
} from "./patient.controller";
import { requireAuth } from "../../middlewares/authMiddlerware";

const router = Router();

// CRUD básico
router.post("/patients", requireAuth, createPatient);
router.get("/patients", requireAuth, getPatients);
router.get("/patients/:id", requireAuth, getPatientById);
router.patch("/patients/:id", requireAuth, updatePatient);


// Búsqueda
router.get("/patients/search", requireAuth, searchPatients);

export default router;
