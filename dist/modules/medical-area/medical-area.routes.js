"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medical_area_controller_1 = require("./medical-area.controller");
const router = (0, express_1.Router)();
router.post("/medical-areas", medical_area_controller_1.addMedicalArea);
router.get("/medical-areas", medical_area_controller_1.getMedicalAreas);
// IMPORTANTE: definir /search antes de :id para evitar colisiones
router.get("/medical-areas/search", medical_area_controller_1.searchMedicalAreas);
router.get("/medical-areas/:id", medical_area_controller_1.getMedicalAreaById);
// Si querés actualización parcial, usá PATCH aquí y en el controller
router.put("/medical-areas/:id", medical_area_controller_1.updateMedicalArea);
router.delete("/medical-areas/:id", medical_area_controller_1.deleteMedicalArea);
exports.default = router;
