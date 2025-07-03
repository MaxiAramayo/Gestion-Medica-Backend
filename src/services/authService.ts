import { prisma } from '../config/db';
import { comparePasswords } from '../utils/hash';
import { generateToken } from '../utils/jwt';


export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isActive || user.isDeleted) {
    throw new Error('Usuario no encontrado o inactivo');
  }

  const isMatch = await comparePasswords(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  const token = generateToken({ id: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
};
