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
exports.searchReportTypes = exports.deleteReportType = exports.updateReportType = exports.getReportTypeById = exports.getReportTypes = exports.addReportType = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const reportTypeService = __importStar(require("./report-type.service"));
const report_type_validation_1 = require("./report-type.validation");
const addReportType = async (req, res) => {
    try {
        const validatedData = report_type_validation_1.reportTypeSchema.parse(req.body);
        const reportType = await reportTypeService.addReportType(validatedData);
        res.status(201).json({
            success: true,
            message: "tipo de reporte generado correctamente",
            data: reportType,
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
exports.addReportType = addReportType;
const getReportTypes = async (req, res) => {
    try {
        const reportTypes = await reportTypeService.getAllReportTypes();
        res.status(200).json({
            success: true,
            message: "Tipos de reporte obtenidos correctamente",
            data: reportTypes,
            count: reportTypes.data.length,
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
exports.getReportTypes = getReportTypes;
const getReportTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const reportType = await reportTypeService.getReportTypeById(Number(id));
        if (!reportType) {
            throw new appError_1.default("Tipo de reporte no encontrado", 404);
        }
        res.status(200).json({
            success: true,
            message: "Tipo de reporte obtenido correctamente",
            data: reportType,
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
exports.getReportTypeById = getReportTypeById;
const updateReportType = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new appError_1.default("ID inválido", 400);
        }
        // Usar el schema parcial para update
        const validatedData = report_type_validation_1.reportTypeUpdateSchema.parse(req.body);
        const reportType = await reportTypeService.updateReportType(id, validatedData);
        res.status(200).json({
            success: true,
            message: "Tipo de reporte actualizado correctamente",
            data: reportType,
        });
    }
    catch (err) {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Error de validación",
                errors: err.flatten(),
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
exports.updateReportType = updateReportType;
const deleteReportType = async (req, res) => {
    try {
        const { id } = req.params;
        const reportType = await reportTypeService.deleteReportType(Number(id));
        res.status(200).json({
            success: true,
            message: "Tipo de reporte eliminado correctamente",
            data: reportType,
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
exports.deleteReportType = deleteReportType;
const searchReportTypes = async (req, res) => {
    try {
        const { query, areaId, page, pageSize } = req.query;
        if (!query || typeof query !== "string" || query.trim() === "") {
            throw new appError_1.default("Parámetro de búsqueda inválido", 400);
        }
        const reportTypes = await reportTypeService.searchReportTypes(String(query), {
            areaId: areaId ? Number(areaId) : undefined,
            page: page ? Number(page) : undefined,
            pageSize: pageSize ? Number(pageSize) : undefined
        });
        res.status(200).json({
            success: true,
            message: "Tipos de reporte encontrados",
            data: reportTypes,
            count: reportTypes.data.length,
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
exports.searchReportTypes = searchReportTypes;
