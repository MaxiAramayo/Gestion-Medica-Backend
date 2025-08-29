import { Request, Response } from "express";
import * as userService from "./user.service";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/appError";
import { registerUserSchema, updateUserSchema, userIdParamSchema } from "./user.validation";
import { CreateUserResponse, GetUsersResponse, GetUserResponse, UpdateUserResponse, UserResponse, UserWithRelations } from "./user.interface";

/**
 * Función helper para convertir UserWithRelations a UserResponse
 */
const formatUserResponse = (user: UserWithRelations): UserResponse => {
  return {
    id: user.id,
    personId: user.personId,
    email: user.email,
    roleId: user.roleId,
    isActive: user.isActive,
    isVerified: user.isVerified,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    person: {
      id: user.person.id,
      dni: user.person.dni,
      firstName: user.person.firstName,
      lastName: user.person.lastName,
      birthDate: user.person.birthDate?.toISOString() || null,
      gender: user.person.gender,
      phoneNumber: user.person.phoneNumber,
      primaryEmail: user.person.primaryEmail,
      address: user.person.address,
      city: user.person.city,
      province: user.person.province,
      country: user.person.country,
      postalCode: user.person.postalCode,
    },
    role: {
      id: user.role.id,
      name: user.role.name,
    },
  };
};

/**
 * Controlador para registrar un nuevo usuario
 * @param req - Request con los datos del usuario en el body
 * @param res - Response con el usuario creado (sin password)
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userData = req.body;

    // Validar que los datos del usuario sean correctos
    const validateData = registerUserSchema.parse(userData);

    const newUser = await userService.createUser(validateData);

    // Obtener el usuario completo con relaciones para la respuesta
    const userWithRelations = await userService.getUserById(newUser.id);

    if (!userWithRelations) {
      throw new AppError("Error al obtener el usuario creado", 500);
    }

    const response: CreateUserResponse = {
      success: true,
      message: "Usuario registrado exitosamente",
      data: formatUserResponse(userWithRelations),
    };

    res.status(201).json(response);
  }
);

/**
 * Controlador para obtener todos los usuarios
 * @param _req - Request (no se usa)
 * @param res - Response con el array de usuarios
 */
export const getUsers = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const users = await userService.getAllUsers();

  const response: GetUsersResponse = {
    success: true,
    message: "Usuarios obtenidos exitosamente",
    data: users.map(formatUserResponse),
  };

  res.status(200).json(response);
});

/**
 * Controlador para obtener un usuario por ID
 * @param req - Request con el ID en los parámetros
 * @param res - Response con el usuario encontrado
 */
export const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = userIdParamSchema.parse(req.params);

  const user = await userService.getUserById(Number(id));

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  const response: GetUserResponse = {
    success: true,
    message: "Usuario obtenido exitosamente",
    data: formatUserResponse(user),
  };

  res.status(200).json(response);
});

/**
 * Controlador para actualizar un usuario
 * @param req - Request con el ID en los parámetros y datos en el body
 * @param res - Response con el usuario actualizado
 */
export const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = userIdParamSchema.parse(req.params);
  const updateData = updateUserSchema.parse(req.body);

  const updatedUser = await userService.updateUser(Number(id), updateData);

  const response: UpdateUserResponse = {
    success: true,
    message: "Usuario actualizado exitosamente",
    data: formatUserResponse(updatedUser),
  };

  res.status(200).json(response);
});
