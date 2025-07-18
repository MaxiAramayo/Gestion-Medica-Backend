import { Request, Response } from "express";
import * as userService from "./user.service";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/appError";
import { registerUserSchema } from "./user.validation";

/**
 * Controlador para registrar un nuevo usuario
 * @param req - Request con los datos del usuario en el body
 * @param res - Response con el usuario creado (sin password)
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: Aquí agregarás la validación con Zod
    const userData = req.body;

    // Validar que los datos del usuario sean correctos
    const validateData = registerUserSchema.parse(userData);

    const newUser = await userService.createUser(validateData);

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        id: newUser.id,
        email: newUser.email,
        // No devolvemos el password por seguridad
      },
    });
  }
);

/**
 * Controlador para obtener todos los usuarios
 * @param _req - Request (no se usa)
 * @param res - Response con el array de usuarios
 */
export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    success: true,
    message: "Usuarios obtenidos exitosamente",
    data: users,
    count: users.length,
  });
});

/**
 * Controlador para obtener un usuario por ID
 * @param req - Request con el ID en los parámetros
 * @param res - Response con el usuario encontrado
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Aquí agregarás la validación del ID con Zod
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    throw new AppError("ID de usuario inválido", 400);
  }

  const user = await userService.getUserById(Number(id));

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  res.status(200).json({
    success: true,
    message: "Usuario obtenido exitosamente",
    data: user,
  });
});
