// src/middlewares/errorHandler.middleware.ts

import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError'; // Nuestra clase de error personalizada
import config from '../config'; // Para verificar el entorno (desarrollo/producción)

// Función para enviar errores detallados en desarrollo
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack, // El stack trace es útil en desarrollo
  });
};

// Función para enviar errores concisos en producción
const sendErrorProd = (err: AppError, res: Response) => {
  // Errores operacionales de confianza: enviamos detalles del cliente
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Errores de programación o desconocidos: no filtramos detalles del error
    // y enviamos un mensaje genérico. Estos errores deben ser debuggeados.
    console.error('ERROR 💥', err); // Registrar el error en consola para debugging
    res.status(500).json({
      status: 'error',
      message: 'Algo salió muy mal!',
    });
  }
};

/**
 * Middleware global para el manejo de errores.
 * Este debe ser el ÚLTIMO middleware en app.ts.
 */
const errorHandler = (
  err: AppError, // El error que se propaga
  req: Request,
  res: Response,
  next: NextFunction // Aunque no lo usemos, debe estar presente para ser un middleware de error
) => {
  // Asignar valores por defecto si el error no es de tipo AppError
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.nodeEnv === 'development') {
    sendErrorDev(err, res);
  } else if (config.nodeEnv === 'production') {
    // Puedes añadir lógica para manejar tipos de errores específicos de producción aquí
    // Por ejemplo, errores de base de datos, errores de validación de librerías, etc.
    // y convertirlos a AppError operacionales si no lo son ya.

    let error = { ...err }; // Crea una copia para evitar mutar el error original
    error.name = err.name; // Asegúrate de copiar el nombre
    error.message = err.message; // Asegúrate de copiar el mensaje
    error.statusCode = err.statusCode; // Asegúrate de copiar el status code
    error.status = err.status; // Asegúrate de copiar el status
    error.isOperational = err.isOperational; // Asegúrate de copiar isOperational

    // Ejemplo de cómo manejar errores de Prisma si no se han convertido a AppError
    // if (err.name === 'PrismaClientKnownRequestError') {
    //   // Puedes buscar códigos de error específicos de Prisma aquí
    //   // Por ejemplo, para un error de registro duplicado (P2002)
    //   if ((err as any).code === 'P2002') {
    //     error = new AppError('Valores duplicados en el campo ' + (err as any).meta.target, 400);
    //   }
    //   // Otros errores de Prisma...
    // }

    sendErrorProd(error as AppError, res);
  }
};

export default errorHandler;