import { Router } from "express";
import {
  addMedicalArea,
  getMedicalAreas,
  getMedicalAreaById,
  updateMedicalArea,          // si preferís PATCH, cambialo también abajo
  deleteMedicalArea,
  searchMedicalAreas,
} from "./medical-area.controller";

const router = Router();

router.post("/medical-areas", addMedicalArea);
router.get("/medical-areas", getMedicalAreas);

// IMPORTANTE: definir /search antes de :id para evitar colisiones
router.get("/medical-areas/search", searchMedicalAreas);

router.get("/medical-areas/:id", getMedicalAreaById);
// Si querés actualización parcial, usá PATCH aquí y en el controller
router.put("/medical-areas/:id", updateMedicalArea);
router.delete("/medical-areas/:id", deleteMedicalArea);


export default router;
