"use strict";
// src/utils/asyncHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wrapper para controladores asíncronos de Express.
 * Captura cualquier error que ocurra dentro del controlador y lo pasa al middleware de errores.
 * Esto evita la necesidad de usar bloques try/catch en cada controlador asíncrono.
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        // Promise.resolve(fn(req, res, next)) asegura que el resultado de fn sea una promesa.
        // .catch(next) envía cualquier error de la promesa al siguiente middleware (nuestro errorHandler).
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = asyncHandler;
