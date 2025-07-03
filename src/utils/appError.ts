
/**
 * Clase de error personalizada para manejar errores con códigos de estado HTTP.
 * Extiende la clase Error nativa de JavaScript.
 */


class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean; // Indica si el error es predecible y manejado (ej. error de validación)

  constructor(message: string, statusCode: number) {
    super(message); // Llama al constructor de la clase Error con el mensaje
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // 'fail' para 4xx, 'error' para 5xx
    this.isOperational = true; // Estos son errores que esperamos y manejamos

    // Captura el stack trace para un mejor debugging, omitiendo el constructor del AppError
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;