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
exports.getUserById = exports.getUsers = exports.registerUser = void 0;
const userService = __importStar(require("./user.service"));
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const appError_1 = __importDefault(require("../../utils/appError"));
const user_validation_1 = require("./user.validation");
/**
 * Controlador para registrar un nuevo usuario
 * @param req - Request con los datos del usuario en el body
 * @param res - Response con el usuario creado (sin password)
 */
exports.registerUser = (0, asyncHandler_1.default)(async (req, res) => {
    const userData = req.body;
    // Validar que los datos del usuario sean correctos
    const validateData = user_validation_1.registerUserSchema.parse(userData);
    const newUser = await userService.createUser(validateData);
    res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente",
        data: {
            id: newUser.id,
            email: newUser.email,
            // No devolvemos el password por seguridad
        },
    });
});
/**
 * Controlador para obtener todos los usuarios
 * @param _req - Request (no se usa)
 * @param res - Response con el array de usuarios
 */
exports.getUsers = (0, asyncHandler_1.default)(async (_req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json({
        success: true,
        message: "Usuarios obtenidos exitosamente",
        data: users,
        count: users.length,
    });
});
/**
 * Controlador para obtener un usuario por ID
 * @param req - Request con el ID en los parámetros
 * @param res - Response con el usuario encontrado
 */
exports.getUserById = (0, asyncHandler_1.default)(async (req, res) => {
    // TODO: Aquí agregarás la validación del ID con Zod
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        throw new appError_1.default("ID de usuario inválido", 400);
    }
    const user = await userService.getUserById(Number(id));
    if (!user) {
        throw new appError_1.default("Usuario no encontrado", 404);
    }
    res.status(200).json({
        success: true,
        message: "Usuario obtenido exitosamente",
        data: user,
    });
});
