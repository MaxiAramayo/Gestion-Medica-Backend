"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMedicalAreas = exports.deleteMedicalArea = exports.updateMedicalArea = exports.getMedicalAreaById = exports.addMedicalArea = exports.getMedicalAreas = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const medical_area_validation_1 = require("./medical-area.validation");
const medicalAreaService = __importStar(require("./medical-area.service"));
const getMedicalAreas = async (req, res) => {
    try {
        const medicalAreas = await medicalAreaService.getAllMedicalAreas();
        res.status(200).json({
            success: true,
            message: "Áreas médicas obtenidas exitosamente",
            data: medicalAreas,
            count: medicalAreas.length,
        });
    }
    catch (err) {
        if (err instanceof appError_1.default) {
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
exports.getMedicalAreas = getMedicalAreas;
const addMedicalArea = async (req, res) => {
    try {
        const validatedData = medical_area_validation_1.createMedicalAreaSchema.parse(req.body);
        const medicalArea = await medicalAreaService.addMedicalArea(validatedData);
        res.status(201).json({
            success: true,
            message: "Área médica creada exitosamente",
            data: medicalArea,
        });
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
        });
    }
};
exports.addMedicalArea = addMedicalArea;
const getMedicalAreaById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            throw new appError_1.default("ID de área médica inválido", 400);
        }
        const medicalArea = await medicalAreaService.getMedicalAreaById(Number(id));
        res.status(200).json({
            success: true,
            message: "Área médica obtenida exitosamente",
            data: medicalArea,
        });
    }
    catch (err) {
        if (err instanceof appError_1.default) {
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
exports.getMedicalAreaById = getMedicalAreaById;
const updateMedicalArea = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            throw new appError_1.default("ID de área médica inválido", 400);
        }
        const validatedData = medical_area_validation_1.createMedicalAreaSchema.parse(req.body);
        const updatedMedicalArea = await medicalAreaService.updateMedicalArea(Number(id), validatedData);
        res.status(200).json({
            success: true,
            message: "Área médica actualizada exitosamente",
            data: updatedMedicalArea,
        });
    }
    catch (err) {
        if (err.name === "ZodError") {
            res.status(400).json({
                success: false,
                message: "Datos inválidos",
                errors: err.errors,
            });
            return;
        }
        if (err instanceof appError_1.default) {
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
exports.updateMedicalArea = updateMedicalArea;
const deleteMedicalArea = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            throw new appError_1.default("ID de área médica inválido", 400);
        }
        await medicalAreaService.deleteMedicalArea(Number(id));
        res.status(200).json({
            success: true,
            message: "Área médica eliminada exitosamente",
        });
    }
    catch (err) {
        if (err instanceof appError_1.default) {
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
exports.deleteMedicalArea = deleteMedicalArea;
const searchMedicalAreas = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || typeof query !== "string" || query.trim() === "") {
            throw new appError_1.default("Parámetro de búsqueda inválido", 400);
        }
        const medicalAreas = await medicalAreaService.searchMedicalAreas(query.trim());
        res.status(200).json({
            success: true,
            message: "Búsqueda de áreas médicas exitosa",
            data: medicalAreas,
            count: medicalAreas.length,
        });
    }
    catch (err) {
        if (err instanceof appError_1.default) {
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
exports.searchMedicalAreas = searchMedicalAreas;
