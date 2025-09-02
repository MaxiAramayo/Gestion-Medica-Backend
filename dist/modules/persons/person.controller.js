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
exports.searchPersons = exports.deletePerson = exports.updatePerson = exports.getPersonById = exports.getPersons = exports.addPerson = void 0;
const personService = __importStar(require("./person.service"));
const person_validation_1 = require("./person.validation");
const appError_1 = __importDefault(require("../../utils/appError"));
/**
 * Controlador para crear una nueva persona
 * @param req - Request con los datos de la persona en el body
 * @param res - Response con la persona creada
 */
const addPerson = async (req, res) => {
    try {
        // Validar datos del body
        const validatedData = person_validation_1.createPersonSchema.parse(req.body);
        const person = await personService.addPerson(validatedData);
        res.status(201).json({
            success: true,
            message: 'Persona creada exitosamente',
            data: person
        });
    }
    catch (err) {
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors: err.errors
            });
            return;
        }
        if (err instanceof appError_1.default) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.addPerson = addPerson;
/**
 * Controlador para obtener todas las personas
 * @param _req - Request (no se usa)
 * @param res - Response con el array de personas
 */
const getPersons = async (_req, res) => {
    try {
        const persons = await personService.getAllPersons();
        res.status(200).json({
            success: true,
            message: 'Personas obtenidas exitosamente',
            data: persons,
            count: persons.length
        });
    }
    catch (err) {
        if (err instanceof appError_1.default) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getPersons = getPersons;
/**
 * Controlador para obtener una persona por ID
 * @param req - Request con el ID en los parámetros
 * @param res - Response con la persona encontrada
 */
const getPersonById = async (req, res) => {
    try {
        // Validar parámetro ID
        const { id } = person_validation_1.idParamSchema.parse(req.params);
        const person = await personService.getPersonById(Number(id));
        if (!person) {
            res.status(404).json({
                success: false,
                message: 'Persona no encontrada'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Persona obtenida exitosamente',
            data: person
        });
    }
    catch (err) {
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                message: 'ID de persona inválido',
                errors: err.errors
            });
            return;
        }
        if (err instanceof appError_1.default) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.getPersonById = getPersonById;
/**
 * Controlador para actualizar una persona
 * @param req - Request con el ID en parámetros y datos en el body
 * @param res - Response con la persona actualizada
 */
const updatePerson = async (req, res) => {
    try {
        // Validar parámetro ID
        const { id } = person_validation_1.idParamSchema.parse(req.params);
        // Validar datos del body
        const validatedData = person_validation_1.updatePersonSchema.parse(req.body);
        const updatedPerson = await personService.updatePerson(Number(id), validatedData);
        res.status(200).json({
            success: true,
            message: 'Persona actualizada exitosamente',
            data: updatedPerson
        });
    }
    catch (err) {
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors: err.errors
            });
            return;
        }
        if (err instanceof appError_1.default) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.updatePerson = updatePerson;
/**
 * Controlador para eliminar una persona
 * @param req - Request con el ID en los parámetros
 * @param res - Response con mensaje de confirmación
 */
const deletePerson = async (req, res) => {
    try {
        // Validar parámetro ID
        const { id } = person_validation_1.idParamSchema.parse(req.params);
        const deletedPerson = await personService.deletePerson(Number(id));
        res.status(200).json({
            success: true,
            message: 'Persona eliminada exitosamente',
            data: {
                id: deletedPerson.id,
                dni: deletedPerson.dni,
                firstName: deletedPerson.firstName,
                lastName: deletedPerson.lastName
            }
        });
    }
    catch (err) {
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                message: 'ID de persona inválido',
                errors: err.errors
            });
            return;
        }
        if (err instanceof appError_1.default) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.deletePerson = deletePerson;
/**
 * Controlador para buscar personas
 * @param req - Request con el query de búsqueda
 * @param res - Response con las personas encontradas
 */
const searchPersons = async (req, res) => {
    try {
        // Validar query de búsqueda
        const { query } = person_validation_1.searchQuerySchema.parse(req.query);
        if (!query) {
            res.status(400).json({
                success: false,
                message: 'El parámetro de búsqueda "q" es requerido'
            });
            return;
        }
        console.log(`Buscando personas con término: "${query}"`);
        const persons = await personService.searchPersons(query);
        res.status(200).json({
            success: true,
            message: `Búsqueda completada para: "${query}"`,
            data: persons,
            count: persons.length
        });
    }
    catch (err) {
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                message: 'Parámetros de búsqueda inválidos',
                errors: err.errors
            });
            return;
        }
        if (err instanceof appError_1.default) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.searchPersons = searchPersons;
