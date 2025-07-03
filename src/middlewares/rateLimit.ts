import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 10, // máximo 5 intentos por IP
  message: 'Demasiados intentos. Intenta de nuevo en 10 minutos.',
});
