import { Router } from "express";
import {
  createDoctor,   // POST /doctors
  getDoctors,     // GET  /doctors
  getDoctorById,  // GET  /doctors/:id
  updateDoctor,   // PATCH/PUT /doctors/:id
  deleteDoctor,   // DELETE /doctors/:id (opcional)
} from "./doctor.controller";
// import { requireAuth } from "../../middlewares/requireAuth"; // el tuyo

const router = Router();

// Crear perfil de médico (paso 2). Requiere login.
router.post("/doctors",  createDoctor);

// Lectura/listado (según tu política: admin / self)
router.get("/doctors", getDoctors);
router.get("/doctors/:id",  getDoctorById);

// Actualizar datos de médico
router.patch("/doctors/:id",  updateDoctor);

// Opcional: eliminar
router.delete("/doctors/:id",  deleteDoctor);

// Opcional: vincular centros
// router.post("/doctors/:id/centers", requireAuth, assignCentersToDoctor);
// router.delete("/doctors/:id/centers/:centerId", requireAuth, removeCenterFromDoctor);

export default router;