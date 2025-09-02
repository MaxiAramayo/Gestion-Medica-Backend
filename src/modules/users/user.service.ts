import { Person, Prisma, User } from "@prisma/client";
import { prisma } from "../../config/db";
import { hashPassword } from "../../utils/hash";
import { RegisterUserInput, UserWithRelations, UpdateUserInput } from "./user.interface";
import AppError from "../../utils/appError";

/**
 * Crea un nuevo usuario en el sistema
 * @param data - Datos del usuario y persona
 * @returns Promise<User> - Usuario creado
 * @throws AppError - 409 si email o DNI ya existen, 400 si hay error de validación
 */
export const createUser = async (data: RegisterUserInput): Promise<User> => {
  try {
    console.log("🔍 Datos recibidos en createUser:", JSON.stringify(data, null, 2));
    
    const { email, password, roleId } = data;
    const personData = data.person;
    
    console.log("📧 Email:", email);
    console.log("🔐 Password length:", password?.length);
    console.log("👤 Role ID:", roleId);
    console.log("👤 Person data:", JSON.stringify(personData, null, 2));
    
    // Hashear la contraseña antes de guardar
    const hashedPassword = await hashPassword(password);
    console.log("✅ Password hasheada correctamente");
    
    let personId: number;
    
    // Validamos si el email ya existe
    console.log("🔍 Verificando si email existe...");
    const existEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existEmail) {
      console.log("❌ Email ya existe");
      throw new AppError("El email ya está registrado", 409);
    }
    console.log("✅ Email disponible");
    
    // Validamos si el dni ya existe
    console.log("🔍 Verificando si DNI existe...");
    const existDni = await prisma.person.findUnique({
      where: { dni: String(personData.dni) },
    });

    // Si no existe la persona
    if (!existDni) {
      console.log("👤 Persona no existe, creando nueva...");
      
      // Normalizamos los datos de la persona
      const normalizedPersonData = {
        dni: String(personData.dni),
        firstName: personData.firstName,
        lastName: personData.lastName,
        birthDate: personData.birthDate ?? null,
        gender: personData.gender ?? null,
        phoneNumber: personData.phoneNumber ?? null,
        primaryEmail: personData.primaryEmail ?? null,
        address: personData.address ?? null,
        city: personData.city ?? null,
        province: personData.province ?? null,
        country: personData.country ?? null,
        postalCode: personData.postalCode ?? null,
      };

      console.log("📋 Datos normalizados de persona:", JSON.stringify(normalizedPersonData, null, 2));

      // Almacenamos la persona en la base de datos
      const newPerson = await prisma.person.create({
        data: normalizedPersonData,
      });
      
      console.log("✅ Persona creada con ID:", newPerson.id);
      personId = newPerson.id;

    } else {
      console.log("👤 Persona ya existe con ID:", existDni.id);
      personId = existDni.id;
    }

    // Verificar que el rol existe antes de crear el usuario
    console.log("🔍 Verificando si el rol existe...");
    const roleExists = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!roleExists) {
      console.log("❌ Rol no existe:", roleId);
      throw new AppError("El rol especificado no existe", 400);
    }
    console.log("✅ Rol encontrado:", roleExists.name);

    // Creamos el usuario
    console.log("👤 Creando usuario...");
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId,
        personId,
      },
    });

    console.log("✅ Usuario creado exitosamente con ID:", newUser.id);
    return newUser;
    
  } catch (error) {
    console.error("❌ Error en createUser:", error);
    
    // Re-lanzar AppErrors existentes
    if (error instanceof AppError) {
      console.log("🔄 Re-lanzando AppError:", error.message);
      throw error;
    }
    
    // Manejar errores específicos de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("🗃️ Error de Prisma:", error.code, error.message);
      console.log("🗃️ Meta:", error.meta);
      
      if (error.code === "P2003") {
        const field = error.meta?.field_name;
        if (field === "roleId") {
          throw new AppError("El rol especificado no existe o es inválido.", 400);
        }
        if (field === "personId") {
          throw new AppError("Error al vincular la persona con el usuario.", 500);
        }
        throw new AppError(`Error de referencia en el campo: ${field}`, 400);
      }
      
      if (error.code === "P2002") {
        const fields = error.meta?.target as string[];
        throw new AppError(`Ya existe un registro con estos datos: ${fields?.join(', ')}`, 409);
      }
      
      throw new AppError(`Error de base de datos: ${error.message}`, 500);
    }
    
    // Log completo del error para debugging
    console.error("💥 Error completo:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...error
    });
    
    // Error genérico
    throw new AppError(`Error interno del servidor: ${error.message}`, 500);
  }
};

export const getAllUsers = async (): Promise<UserWithRelations[]> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        person: true, // Incluimos los datos de la persona
        role: true, // Incluimos el rol del usuario
      },
      orderBy: {
        createdAt: "desc", // Ordenar por fecha de creación
      },
    });

    return users;
  } catch (error) {
    // Manejar errores específicos de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new AppError("Error al obtener los usuarios", 500);
    }
    // Error genérico para cualquier otro tipo de error no esperado
    throw new AppError("Error interno del servidor al obtener usuarios.", 500);
  }
};

export const getUserById = async (id: number): Promise<UserWithRelations | null> => {
  try {
    if (!id || id <= 0) {
      throw new AppError("ID de usuario no válido", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        person: true, // Incluimos los datos de la persona
        role: true, // Incluimos el rol del usuario
      },
    });

    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    return user;
  } catch (error) {
    // Re-lanzar AppErrors existentes
    if (error instanceof AppError) {
      throw error;
    }
    // Error genérico para cualquier otro tipo de error no esperado
    throw new AppError("Error interno del servidor al obtener usuario.", 500);
  }
};

/**
 * Actualiza un usuario existente
 * @param id - ID del usuario a actualizar
 * @param data - Datos a actualizar
 * @returns Promise<UserWithRelations> - Usuario actualizado
 * @throws AppError - 404 si el usuario no existe, 400 si hay error de validación
 */
export const updateUser = async (id: number, data: UpdateUserInput): Promise<UserWithRelations> => {
  try {
    if (!id || id <= 0) {
      throw new AppError("ID de usuario no válido", 400);
    }

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new AppError("Usuario no encontrado", 404);
    }

    // Si se va a actualizar la contraseña, hashearla
    const updateData = { ...data };
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    // Verificar si el email ya existe en otro usuario
    if (updateData.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email: updateData.email,
          id: { not: id }
        }
      });

      if (emailExists) {
        throw new AppError("El email ya está registrado por otro usuario", 409);
      }
    }

    // Actualizar el usuario
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        person: true,
        role: true,
      },
    });

    return updatedUser;
  } catch (error) {
    // Re-lanzar AppErrors existentes
    if (error instanceof AppError) {
      throw error;
    }
    // Manejar errores específicos de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003" && error.meta?.field_name === "roleId") {
        throw new AppError("El rol especificado no existe o es inválido.", 400);
      }
    }
    // Error genérico para cualquier otro tipo de error no esperado
    throw new AppError("Error interno del servidor al actualizar usuario.", 500);
  }
};
