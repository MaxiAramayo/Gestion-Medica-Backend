import { prisma } from '../config/db';
import { hashPassword } from '../utils/hash';

interface RegisterData {
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'medico' | 'paciente';
}

export const registerUser = async (data: RegisterData) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) throw new Error('El email ya está registrado');

  const hashed = await hashPassword(data.password);

  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashed,
      role: data.role
    }
  });

  return { id: newUser.id, email: newUser.email, role: newUser.role };
};

export const getAllUsers = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    }
  });
};
