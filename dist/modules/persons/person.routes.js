"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const person_controller_1 = require("./person.controller");
const router = (0, express_1.Router)();
// IMPORTANTE: Las rutas específicas ANTES que las rutas con parámetros
router.post('/persons', person_controller_1.addPerson); // Crear persona
router.get('/persons', person_controller_1.getPersons); // Obtener todas las personas
router.get('/persons/search', person_controller_1.searchPersons); // ✅ DEBE IR ANTES de /:id
router.get('/persons/:id', person_controller_1.getPersonById); // ✅ Después de rutas específicas
router.put('/persons/:id', person_controller_1.updatePerson); // Actualizar persona
router.delete('/persons/:id', person_controller_1.deletePerson); // Eliminar persona
exports.default = router;
