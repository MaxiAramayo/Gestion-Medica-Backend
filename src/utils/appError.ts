/**
 * Error personalizado para manejar errores HTTP.
 */
class AppError extends Error {
  public statusCode: number;
  public status: 'fail' | 'error';
  public isOperational: boolean;
  public errors?: any[];

  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;