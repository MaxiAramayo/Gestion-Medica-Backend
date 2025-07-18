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
      throw new Error("Usuario no encontrado o inactivo");
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      throw new Error("Credenciales inválidas");
    }

    const token = generateToken({ id: user.id, role: user.role.id });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.roleId,
        isActive: user.isActive,
      },
    };
  } catch (error) {
    throw new AppError("Error al iniciar sesión", 500);
  }
};
