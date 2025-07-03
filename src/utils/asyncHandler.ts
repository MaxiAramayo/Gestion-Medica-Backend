// src/utils/asyncHandler.ts

import { Request, Response, NextFunction } from 'express';

// Define el tipo para un controlador de Express que puede ser asíncrono
type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | void;

/**
 * Wrapper para controladores asíncronos de Express.
 * Captura cualquier error que ocurra dentro del controlador y lo pasa al middleware de errores.
 * Esto evita la necesidad de usar bloques try/catch en cada controlador asíncrono.
 */
const asyncHandler = (fn: AsyncController) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Promise.resolve(fn(req, res, next)) asegura que el resultado de fn sea una promesa.
    // .catch(next) envía cualquier error de la promesa al siguiente middleware (nuestro errorHandler).
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;