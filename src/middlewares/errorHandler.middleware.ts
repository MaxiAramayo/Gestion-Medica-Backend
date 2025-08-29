import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import config from "../config";

const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error =
    err instanceof AppError
      ? err
      : new AppError(err.message || "Error desconocido", 500);

  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  const response: any = {
    status,
    message: error.message,
  };

  // Solo muestra detalles en desarrollo
  if (
    config.nodeEnv === "development" ||
    process.env.NODE_ENV === "development"
  ) {
    response.error = {
      name: error.name,
      isOperational: error.isOperational ?? false,
      statusCode,
    };
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
