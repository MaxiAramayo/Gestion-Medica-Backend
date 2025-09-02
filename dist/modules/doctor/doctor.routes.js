"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/doctor/doctor.routes.ts
const express_1 = require("express");
const doctor_controller_1 = require("./doctor.controller");
const router = (0, express_1.Router)();
// CRUD
router.post("/doctors", doctor_controller_1.createDoctor); // admin
router.get("/doctors", doctor_controller_1.getDoctors); // admin
router.get("/doctors/:id", doctor_controller_1.getDoctorById); // admin/owner
router.patch("/doctors/:id", doctor_controller_1.updateDoctor); // admin
router.delete("/doctors/:id", doctor_controller_1.deleteDoctor); // admin (raro)
// Centros (opcional)
router.post("/doctors/:id/centers", doctor_controller_1.assignCentersToDoctor); // { centerIds: number[] }
router.delete("/doctors/:id/centers/:centerId", doctor_controller_1.removeCenterFromDoctor);
exports.default = router;
