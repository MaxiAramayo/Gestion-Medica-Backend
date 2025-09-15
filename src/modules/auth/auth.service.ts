import { prisma } from "../../config/db";
import AppError from "../../utils/appError";
import { comparePasswords } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";

export const loginService = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        person: true,
      },
    });

    if (!user || !user.isActive) {
      throw new AppError("Usuario no encontrado o inactivo", 404);
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      throw new AppError("Credenciales inválidas", 401);
    }

    const token = generateToken({
      id: user.id,
      role: user.role.name,
      email: user.email,
      isActive: user.isActive,
    });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name,
        isActive: user.isActive,
      },
    };
  } catch (error: any) {
    // Si ya es un AppError, lo re-lanzamos tal como está
    if (error instanceof AppError) {
      throw error;
    }
    // Solo para errores inesperados
    throw new AppError(error.message || "Error al iniciar sesión", 500);
  }
};

