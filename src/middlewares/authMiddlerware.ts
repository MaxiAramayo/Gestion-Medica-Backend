import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import AppError from '../utils/appError';
import config from '../config';

// Extender el tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        roleId: number;
      };
    }
  }
}

interface JWTPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Middleware para verificar autenticación JWT
 * Protege rutas que requieren usuario autenticado
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extraer token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de acceso requerido', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Token de acceso requerido', 401);
    }

    // 2. Verificar y decodificar el token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expirado', 401);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Token inválido', 401);
      }
      throw new AppError('Error al verificar token', 401);
    }

    // 3. Verificar que el usuario existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: true,
        person: true
      }
    });

    if (!user) {
      throw new AppError('Usuario no encontrado', 401);
    }

    if (!user.isActive) {
      throw new AppError('Usuario inactivo', 403);
    }

    // 4. Agregar información del usuario al request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role.name,
      roleId: user.roleId
    };

    // 5. Continuar al siguiente middleware/controlador
    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Middleware para verificar roles específicos
 * Debe usarse DESPUÉS de requireAuth
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError('Usuario no autenticado', 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError('Permisos insuficientes', 403);
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

/**
 * Middleware opcional de autenticación
 * Agrega información del usuario si está autenticado, pero no falla si no lo está
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
          
          const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: {
              role: true
            }
          });

          if (user && user.isActive) {
            req.user = {
              id: user.id,
              email: user.email,
              role: user.role.name,
              roleId: user.roleId
            };
          }
        } catch (error) {
          // Token inválido, pero no falla - continúa sin usuario
        }
      }
    }

    next();
  } catch (error) {
    // En caso de error, continúa sin usuario
    next();
  }
};

/**
 * Middleware para verificar que el usuario puede acceder a sus propios recursos
 * o es administrador
 */
export const requireOwnershipOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      throw new AppError('Usuario no autenticado', 401);
    }

    const resourceUserId = parseInt(req.params.id);
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    // Permitir si es admin o si es el mismo usuario
    if (userRole === 'admin' || currentUserId === resourceUserId) {
      next();
      return;
    }

    throw new AppError('No tienes permisos para acceder a este recurso', 403);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};